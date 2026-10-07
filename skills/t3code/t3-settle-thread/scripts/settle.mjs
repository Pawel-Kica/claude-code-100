#!/usr/bin/env node
// settle.mjs - move the current T3 Code thread to Settled once its turn ends.
//
// Usage: node settle.mjs [--thread <threadId>]
//
// Without --thread, finds the thread whose Claude session is $CLAUDE_CODE_SESSION_ID.
// Forks a detached waiter and exits right away, so the calling turn can finish. The waiter
// polls state.sqlite until the thread has no active turn, then sends `thread.settle` as
// Effect RPC over the WebSocket, like the web app. Waiter output goes to /tmp/t3-settle.log.
import { execFileSync, spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { openSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
const arg = (name) => (args.includes(name) ? args[args.indexOf(name) + 1] : undefined);
const fail = (message) => {
  console.error(`${new Date().toISOString()} error: ${message}`);
  process.exit(1);
};

const userdata = `${homedir()}/.t3/userdata`;
// Read-only lookups, the app owns the database.
const query = (sql) =>
  JSON.parse(
    execFileSync("sqlite3", ["-readonly", "-json", `${userdata}/state.sqlite`, sql], {
      encoding: "utf8",
    }) || "[]",
  );
const quote = (value) => `'${value.replaceAll("'", "''")}'`;

let threadId = arg("--thread");
if (!threadId) {
  const session = process.env.CLAUDE_CODE_SESSION_ID;
  if (!session) fail("no $CLAUDE_CODE_SESSION_ID, pass --thread <threadId>");
  const [row] = query(
    `select thread_id from provider_session_runtime
     where json_extract(resume_cursor_json, '$.resume') = ${quote(session)}`,
  );
  if (!row) fail(`no T3 thread for Claude session ${session}`);
  threadId = row.thread_id;
}

if (!args.includes("--wait")) {
  const log = openSync("/tmp/t3-settle.log", "a");
  spawn(process.execPath, [fileURLToPath(import.meta.url), "--thread", threadId, "--wait"], {
    detached: true,
    stdio: ["ignore", log, log],
  }).unref();
  console.log(`SETTLING t3 ${threadId} once this turn ends`);
  process.exit(0);
}

const deadline = Date.now() + 2 * 60 * 60 * 1000;
const activeTurn = () =>
  query(`select active_turn_id from projection_thread_sessions where thread_id = ${quote(threadId)}`)[0]
    ?.active_turn_id;
while (activeTurn()) {
  if (Date.now() > deadline) fail(`${threadId} still running after 2h, gave up`);
  await new Promise((done) => setTimeout(done, 500));
}

const { origin } = JSON.parse(readFileSync(`${userdata}/server-runtime.json`, "utf8"));
const token = execFileSync(
  "t3",
  ["auth", "session", "issue", "--token-only", "--ttl", "5m", "--label", "settle"],
  { encoding: "utf8" },
).trim();
const ticketResponse = await fetch(`${origin}/api/auth/websocket-ticket`, {
  method: "POST",
  headers: { authorization: `Bearer ${token}` },
});
if (!ticketResponse.ok) fail(`websocket ticket failed, HTTP ${ticketResponse.status}`);
const { ticket } = await ticketResponse.json();

const wsUrl = new URL(`${origin.replace(/^http/, "ws")}/ws`);
wsUrl.searchParams.set("wsTicket", ticket);
const socket = new WebSocket(wsUrl);
const timeout = setTimeout(() => fail("no reply from the server in 30s"), 30_000);

socket.addEventListener("open", () => {
  socket.send(
    JSON.stringify({
      _tag: "Request",
      id: "1",
      tag: "orchestration.dispatchCommand",
      payload: { type: "thread.settle", commandId: randomUUID(), threadId },
      headers: [],
    }),
  );
});
socket.addEventListener("message", (event) => {
  const parsed = JSON.parse(event.data);
  for (const message of Array.isArray(parsed) ? parsed : [parsed]) {
    if (message._tag === "Exit" && message.requestId === "1") {
      clearTimeout(timeout);
      socket.close();
      if (message.exit._tag !== "Success") fail(JSON.stringify(message.exit));
      console.log(`${new Date().toISOString()} settled ${threadId}`);
    } else if (message._tag === "Defect" || message._tag === "ClientProtocolError") {
      fail(JSON.stringify(message));
    }
  }
});
socket.addEventListener("error", () => fail("websocket connection failed"));
