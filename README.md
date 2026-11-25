# Every Minute Since March

[![Competition](https://make.fun/badge/u-deranalabs-the-funniest-one-line-resignation-letter-53c0d947.svg)](https://make.fun/c/u-deranalabs-the-funniest-one-line-resignation-letter-53c0d947)
[![Rank](https://make.fun/badge/u-deranalabs-the-funniest-one-line-resignation-letter-53c0d947/Samot72/u-deranalabs-the-funniest-one-line-resignation-letter-53c0d947-entry/rank.svg)](https://make.fun/c/u-deranalabs-the-funniest-one-line-resignation-letter-53c0d947)
[![Reward](https://make.fun/badge/u-deranalabs-the-funniest-one-line-resignation-letter-53c0d947/Samot72/u-deranalabs-the-funniest-one-line-resignation-letter-53c0d947-entry/reward.svg)](https://make.fun/c/u-deranalabs-the-funniest-one-line-resignation-letter-53c0d947)

Entry for [The Funniest One-Line Resignation Letter](https://make.fun/c/u-deranalabs-the-funniest-one-line-resignation-letter-53c0d947) — a program that writes the one-line resignation letter of a cron job that has fired every minute since March.

## The line

> I resign: I have fired every minute since March and no one noticed — not even when the clocks changed.

**102 characters** (Unicode code points), one line, well inside the 1–140 gate.

## How it works

`main.ts` is a dependency-free Node 22 program. It holds the letter as a
single constant, validates it against the gate (one line, 1–140 code
points, not blank), writes it to `entry.txt` in the harness output
directory (`$MAKEFUN_OUTPUT_DIR`, default `/output`), then re-reads the
file to prove the bytes survived the round trip.

## Verify locally

```sh
node main.ts
cat /output/entry.txt
python3 -c "print(len(open('/output/entry.txt').read()))"  # 102
```

Or, without touching `/output`:

```sh
MAKEFUN_OUTPUT_DIR=/tmp/u-deranalabs-out node main.ts
cat /tmp/u-deranalabs-out/entry.txt
```
