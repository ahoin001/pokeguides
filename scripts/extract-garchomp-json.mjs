import fs from "node:fs";
import path from "node:path";

const transcript =
  "C:/Users/ahoin/.cursor/projects/c-Users-ahoin-Desktop-Pokemon/agent-transcripts/3887a8b6-a45c-4aa8-be76-8f9c074c3b76/3887a8b6-a45c-4aa8-be76-8f9c074c3b76.jsonl";
const outParsed =
  "C:/Users/ahoin/AppData/Local/Cursor/AgentStores/cursor_agent_stores/3887a8b6-a45c-4aa8-be76-8f9c074c3b76/files/garchomp-conversion-parsed.json";

const raw = fs.readFileSync(transcript, "utf8");
const needle = "Garchomp Conversion Network";
const lineStart = raw.lastIndexOf("\n", raw.indexOf(needle)) + 1;
const lineEnd = raw.indexOf("\n", raw.indexOf(needle));
const line = raw.slice(lineStart, lineEnd === -1 ? undefined : lineEnd);
const row = JSON.parse(line);
const text = row.message.content.find((c) => c.type === "text")?.text ?? "";

const marker = "with this info:\n{";
const start = text.indexOf(marker);
if (start < 0) {
  console.error("marker not found in decoded text");
  process.exit(1);
}
let jsonText = text.slice(start + "with this info:\n".length);
const endTag = jsonText.indexOf("</user_query>");
if (endTag >= 0) jsonText = jsonText.slice(0, endTag).trimEnd();

function extractObject(s) {
  let depth = 0;
  let inStr = false;
  let esc = false;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (inStr) {
      if (esc) esc = false;
      else if (ch === "\\") esc = true;
      else if (ch === '"') inStr = false;
      continue;
    }
    if (ch === '"') {
      inStr = true;
      continue;
    }
    if (ch === "{") depth++;
    if (ch === "}") {
      depth--;
      if (depth === 0) return s.slice(0, i + 1);
    }
  }
  throw new Error(`unbalanced depth=${depth} len=${s.length}`);
}

jsonText = extractObject(jsonText);
const data = JSON.parse(jsonText);
fs.mkdirSync(path.dirname(outParsed), { recursive: true });
fs.writeFileSync(outParsed, JSON.stringify(data, null, 2));
console.log("Length", jsonText.length);
console.log("title", data.title);
console.log("packages", data.packages?.length ?? data.packs?.length);
console.log("altSlots", data.construction?.altSlots?.length);
console.log("roster", data.roster?.length ?? data.box?.length);
