---
description: Use only when the user explicitly asks to enable session-wide automatic commit, push, PR, and merge; not for one-shot shipping requests.
---

# Merge — Auto-Merge Mode (Session-Wide)

> Note: inside a git worktree this skill may be exposed under a directory-scoped name (e.g. `.claude/worktrees/<name>:merge`). Invoke the scoped name — same skill, same behavior.

Invoking `/merge` does NOT do a one-off merge. It **flips on Auto-Merge Mode for the rest of the session**, like `/caveman` persists, and it covers the session in BOTH directions:

- **Backward (retroactive sweep):** any work already completed and verified earlier in this session that is not yet on `main` — open PRs, pushed branches, committed-but-unmerged changes — gets the integration cycle immediately on activation.
- **Forward:** every task completed after activation gets the cycle the moment it is complete and verified — no waiting to be asked, no per-merge confirmation.

Invoking `/merge` IS the user's standing authorization to merge into `main` repeatedly for the session — **everything before it and everything after it**. That includes PRs this session deliberately left for review (e.g. editorial-content PRs under a "the editor merges" convention): activating the mode IS the editor's approval, so merge those too. That is why there is no per-merge confirm gate (see [Why no confirm](#why-no-per-merge-confirm)).

## Step 0: Activate the mode

On `/merge`, announce activation in **plain prose** (not caveman), so the user can immediately correct a misread of this standing authorization. Say, concisely:

> **Auto-Merge Mode is ON for this session.** I will now merge into `main`, without asking: (1) everything this session already completed that isn't merged yet — including any PRs left open for review — and (2) every task completed from here on: commit the touched files, push, ensure a PR exists, and merge (resolving conflicts where unambiguous). The session branch is kept the whole session. Say "stop merge" to turn this off.

Then run the **retroactive sweep** before continuing other work: list this session's unmerged output (`gh pr list --author @me --state open`, plus any pushed-but-PR-less or committed-but-unpushed session branches), and run the integration cycle on each item that is complete and verified. Only genuinely unfinished or unverified work is excluded — and say so explicitly if anything is skipped. After the sweep, the cycle fires on every task completion.

## The Integration Cycle

Run this whenever a task is complete and verified. "Complete" = the requested change is finished and verified to the extent this environment allows (read code / logs / headless rasterize) — NOT mid-task, exploratory, or throwaway work. Never fabricate verification to trigger the cycle.

### 1. Identify the branch
- `git branch --show-current`.
- If on `main` (should not happen mid-session): create a session branch first, never commit to `main` directly. The one session branch is reused for the whole session.

### 2. Commit + push the work
- Stage **only the files this task touched** — never blanket-commit unrelated changes (`git status --short` to see what's there).
- Commit with a clear message; end with the standard `Co-Authored-By:` trailer.
- `git push` (set upstream on first push of the branch).

### 3. Ensure a PR exists
- `gh pr view --json number,title,state,mergeable,mergeStateStatus,headRefName,baseRefName,url`.
- If no PR, or the prior PR is already `MERGED`/`CLOSED` (a reused branch's old PR closes after each merge), open a fresh one: `gh pr create --base main --fill` (or use the `pr` skill). Confirm `baseRefName` is `main`.

### 4. Sync with main + check conflicts
- `git fetch origin`.
- Inspect `mergeable` / `mergeStateStatus`. `main` advances fast (other sessions land work), so expect occasional divergence.
- If clean (`MERGEABLE`), go to step 6.

### 5. Resolve conflicts (like normal)
If `mergeable` is `CONFLICTING` or the merge is blocked by divergence:
- `git merge origin/main` into the session branch.
- Resolve conflicts the normal way: open each conflicted file, keep both sides' intent, remove markers, `git add`, commit the merge, `git push`.
- **Auto-clarity carve-out:** resolve only conflicts where the correct resolution is unambiguous. If both sides changed the same logic and the right merge is a real judgment call (risk of silently dropping someone's work), **stop, report the conflicted hunks in plain prose, and ask** before committing. Do not guess on semantic conflicts.
- Re-check `mergeable`, then proceed.

### 6. Merge into main
```
gh pr merge <number> --merge
```
- `--merge` → merge commit (matches this repo's `Merge pull request #...` history).
- **No `--delete-branch`** — the one session branch is kept until the session is done.
- **No `--squash` / `--rebase`** unless the user explicitly asked.
- **No `--admin`** — do not bypass branch protection or failing required checks. If the merge is blocked by checks/protection, report why and stop (pause the cycle for that task); do not force it.

### 7. Confirm it went live
Merging is publishing: the cycle is not done until the change is on the live site (or the deploy blocker is reported). Identify the project's deploy platform from `.claude/reference/deployment.md` or auto-memory (this repo: Vercel, root dir `site/`, `main` auto-deploys; other projects may use Railway etc.).

- **Auto-deploy platforms (Vercel/Railway on `main`):** the merge itself triggers the deploy — do not trigger a second one. Verify it: check the platform's commit status on the merge commit (`gh api repos/{owner}/{repo}/commits/<merge-sha>/status`) or the platform CLI, and confirm it reaches success. A cheap live check (e.g. `curl -s https://<site>/ | grep` for the changed copy) is the gold standard when the change is greppable.
- **Deploy blocked (rate limit, quota, build failure):** report it plainly with the platform's message and when it will clear — never imply the change is live. If the block is a build FAILURE (not a limit), treat it like a failing check: diagnose before merging further UI work.
- **Manual-deploy platforms:** run the documented deploy command after merge (see `deployment.md`); if credentials/environment make that impossible here, say so and hand the exact command to the user.

### 8. Report
Confirm the merge landed, give the PR URL, note the branch was kept, and state the live-deploy status from step 7 (deployed / queued / blocked-with-reason). If anything blocked it (failing checks, protection, unresolved/ambiguous conflict), report the exact `gh`/`git` output and the reason — never claim success you did not verify.

## Deploy budget: batch the merges

This repo deploys on Vercel's free tier: **100 deployments per rolling 24
hours, previews included** (hit on 2026-07-18; the error is "Deployment rate
limited — retry in 24 hours" and the live site silently goes stale while
`main` is correct).

Two things spend that budget:

- **Pushes to non-main branches** used to burn a preview deploy each.
  `site/vercel.json` now sets `git.deploymentEnabled` to `{"**": false,
  "main": true}`, so only `main` deploys — pushes and PRs are free. Do not
  remove that block; it is the rate-limit fix. (Branches cut before the block
  landed still carry the old config and still preview-deploy on push; merge
  `origin/main` into them to pick it up.)
- **Every merge to `main`** still triggers one production deploy.

So inside Auto-Merge Mode, commit and push continuously but run the
merge-to-main step on a batch cadence:

- Merge when a coherent chunk of work is done (a whole editorial ruling applied,
  a feature finished), not once per micro-task. Several small completed tasks
  waiting together ride one merge.
- A direct user request to merge, or the end of the session, always flushes the
  batch immediately.
- After each merge, check the deploy landed:
  `gh api repos/<owner>/<repo>/commits/main/status --jq .state`. On `failure`
  with a rate-limit message, tell the user live is stale and when it clears; do
  not keep merging micro-batches into a rate-limited window.

## Why no per-merge confirm

Merging into `main` is outward-facing and hard to fully undo. The single confirmation is **turning the mode on** — that is the explicit, standing authorization for the session. After that, per-merge prompts would defeat the purpose. The safety valves that remain:
- the mode only fires on genuinely-complete, verified work;
- ambiguous/semantic conflicts still stop and ask;
- branch protection / required checks are still respected (no `--admin`);
- the user can say "stop merge" at any time.

## Deactivation

Turn the mode OFF when the user says "stop merge", "stop auto-merge", "normal mode for merging", or the session ends. The session branch is **not** deleted on deactivation — clean up manually only when the session's work is truly done.

## Anti-patterns

- Don't merge once per micro-task — each merge burns a production deploy from a
  100/day budget; batch completed work (see Deploy budget above).
- Don't skip the retroactive sweep — "the cycle fires on the next completion" is wrong; activation merges the session's existing completed work too.
- Don't hold back review-gated PRs from this session after activation — `/merge` is the reviewer's/editor's standing approval.
- Don't merge mid-task, exploratory, or unverified work — "complete + verified" is the gate.
- Don't fabricate verification just to trigger the cycle.
- Don't blanket-commit unrelated files — stage only what the task touched.
- Don't push merge commits straight to `main` via `git push` — always integrate through `gh pr merge` so history stays `Merge pull request #...`.
- Don't delete the branch (`--delete-branch`) — one branch for the whole session.
- Don't switch merge method (`--squash`/`--rebase`) on your own.
- Don't bypass protections/checks (`--admin`) without an explicit ask — report the block and stop.
- Don't guess on semantic merge conflicts — resolve the unambiguous ones, stop and ask on the rest.
- Don't fabricate success — report the real `gh pr merge` / `git merge` outcome.
- Don't stop at the merge — a merge whose deploy silently failed or is rate-limited is NOT live; verify or report per step 7.
