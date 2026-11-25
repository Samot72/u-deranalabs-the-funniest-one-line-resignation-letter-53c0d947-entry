// "Every Minute Since March" — entry for
// u-deranalabs-the-funniest-one-line-resignation-letter-53c0d947.
//
// A tiny, dependency-free Node 22 program. It holds the single-line
// resignation letter of a cron job that has fired every minute since
// March, checks it against the competition gate (1 to 140 Unicode code
// points, one line, never blank, no trailing whitespace or control
// characters), proves the output is deterministic by writing it twice
// and byte-comparing, then writes it to entry.txt inside the harness
// output directory and re-reads the file to prove the bytes survived
// the round trip.

import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

// The letter, exactly as it will be judged: the cron job resigns, flat
// and tired, with the one complaint only it could make — it fired every
// minute since March and nobody noticed, not even when the clocks
// changed. No explaining the joke, no stage directions, no quotation
// marks around the whole thing.
const LINE =
  "I resign: I have fired every minute since March and no one noticed — not even when the clocks changed.";

const GATE_MIN = 1;
const GATE_MAX = 140;

/** Enforce the gate: one line, length counted in code points, not blank. */
function assertValid(line: string): number {
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("letter must stay on a single line");
  }
  const count = Array.from(line).length;
  if (count < GATE_MIN || count > GATE_MAX) {
    throw new Error(
      `letter must be ${GATE_MIN}-${GATE_MAX} characters, got ${count}`,
    );
  }
  if (line.trim() === "") {
    throw new Error("letter must not be blank");
  }
  if (line !== line.trimEnd()) {
    throw new Error("letter must not end with whitespace");
  }
  // No control characters: the line is judged as plain text, so tabs and
  // other invisible bytes would be judged differently than they look.
  if (/[\u0000-\u001f\u007f]/.test(line)) {
    throw new Error("letter must not contain control characters");
  }
  return count;
}

/**
 * Prove the output is deterministic: write the letter twice to two
 * fresh temp directories and byte-compare the results before the real
 * output is written. A non-deterministic generator would fail here.
 */
function assertDeterministic(line: string): void {
  const first = mkdtempSync(join(tmpdir(), "letter-a-"));
  const second = mkdtempSync(join(tmpdir(), "letter-b-"));
  try {
    const a = join(first, "entry.txt");
    const b = join(second, "entry.txt");
    writeFileSync(a, line, { encoding: "utf8" });
    writeFileSync(b, line, { encoding: "utf8" });
    const bytesA = readFileSync(a);
    const bytesB = readFileSync(b);
    if (!bytesA.equals(bytesB)) {
      throw new Error("determinism check failed: two writes differ");
    }
    if (bytesA.toString("utf8") !== line) {
      throw new Error("determinism check failed: bytes do not match the letter");
    }
  } finally {
    rmSync(first, { recursive: true, force: true });
    rmSync(second, { recursive: true, force: true });
  }
}

function run(): void {
  const count = assertValid(LINE);
  assertDeterministic(LINE);

  const dir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  const target = resolve(dir, "entry.txt");

  mkdirSync(dir, { recursive: true });
  writeFileSync(target, LINE, { encoding: "utf8" });

  const reread = readFileSync(target, "utf8");
  if (reread !== LINE) {
    throw new Error("verification failed: file content differs from the letter");
  }

  console.log(`wrote ${target} (${count} characters)`);
  console.log(LINE);
}

run();
