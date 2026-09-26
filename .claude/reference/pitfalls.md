# Pitfalls

> Accumulated project-specific gotchas. Dated entries, newest at the bottom. If this file exceeds ~200 lines, split by area (`pitfalls-<area>.md`) and update the CLAUDE.md index.

Quote the evidence in each entry: the command, the message, what it cost.

## "no checks reported" means too early, not no CI (2026-08-19)

Right after pushing a branch, `gh pr checks <n>` can answer:

```
no checks reported on the 'claude/youtube-video-ingest-d2d931' branch
```

That is the workflows not having registered yet, not the repo lacking CI. This
repo runs three jobs on every PR: `no-em-dash`, `readme-plate`, and `validate`.
Reading the message as a green light merged PR #250 with no CI run against it.

`--auto` does not fix this on its own. Auto-merge waits only for checks that
branch protection marks required, and `main` here is unprotected:

```
gh api repos/ryanportfolio/Corewise.Academy/branches/main/protection
{"message":"Branch not protected", "status":"404"}
```

So PR #252 merged with `no-em-dash` and `validate` still `IN_PROGRESS`. They
passed, but nothing had gated the merge.

Fix: poll until no check is pending, then merge.

```bash
for i in $(seq 1 20); do
  out=$(gh pr checks <n> --json name,state --jq '.[] | .name+": "+.state')
  echo "$out" | grep -qE "IN_PROGRESS|PENDING|QUEUED" || { echo "$out"; break; }
  sleep 15
done
```

A zero-check answer within a minute of a push is not an answer yet; wait for at
least one check to appear before trusting it. Protecting `main` with the three
jobs required would make `--auto` sufficient and remove the polling, but that
changes repository settings, so it needs the owner's say-so.

## Reusing a branch after its squash merge conflicts on every file (2026-08-19)

Squash-merging collapses a branch into one new commit on `main`. The branch's
own commits stay behind and are not ancestors of that commit. Push a follow-up
to the same branch and every file the squash introduced looks added on both
sides from the shared base:

```
CONFLICT (add/add): Merge conflict in site/src/content/guides/one-skills-library-for-your-whole-team.mdx
```

`gh pr view` reported `"mergeable":"CONFLICTING"` and
`"mergeStateStatus":"DIRTY"` for a follow-up that changed two lines.

Fix: after a squash merge, cut follow-up work from freshly fetched `origin/main`.

```bash
git fetch origin main && git checkout -b <new-branch> origin/main
```

If a reused branch is already conflicted, merge `origin/main` into it and keep
the branch copy, since the branch content is main's content plus the new edit.
Confirm with `git diff origin/main` that the net change is only the intended
lines before merging.

## GitHub recomputes mergeability asynchronously (2026-08-19)

`gh pr view --json mergeable` right after a push returns the previous answer. It
reported `CONFLICTING` on a branch whose conflict was already resolved and
pushed, then `MERGEABLE UNSTABLE` on the next query seconds later. Re-query
before acting on a mergeability verdict, and read `UNSTABLE` as checks still
running rather than as a failure.

## Transcript export can fail while the panel works (2026-09-25)

For video `45K3zHckCnQ`, `scripts/transcript.mjs` found English captions but
received HTTP 429 from both caption clients, then printed `No transcript
available`. Browser transcript export also reported no transcript. The visible
YouTube Show transcript panel nevertheless returned the full 0:00-25:54 text.
The export failure would have blocked ingest unnecessarily. Diagnose the earlier
HTTP error and check the visible panel once before declaring captions unavailable.
The in-app browser's generic page export is unsupported; use scoped transcript
text reads when that panel succeeds. Oversized whole-page snapshots can truncate
the middle even when the closing segment appears.
