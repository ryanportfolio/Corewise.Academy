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
