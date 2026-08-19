# Pitfalls

Accumulated gotchas. Add an entry when something bites; quote the evidence.

## "no checks reported" means too early, not no CI (2026-08-19)

Right after pushing a branch, `gh pr checks <n>` can answer:

```
no checks reported on the 'claude/youtube-video-ingest-d2d931' branch
```

That is the workflows not having registered yet, not the repo lacking CI. This
repo runs three jobs on every PR: `no-em-dash`, `readme-plate`, and `validate`.
Reading the message as a green light merged PR #250 with no CI run against it.

Fix: merge with `--auto` so GitHub waits for the checks itself.

```bash
gh pr merge <n> --squash --auto
```

Where a plain merge is wanted, poll until at least one check appears before
trusting the result. A zero-check answer within a minute of a push is not an
answer yet.
