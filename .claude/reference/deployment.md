# Deployment

## CoreWise Academy (this repo)

- Platform: Vercel. Root directory `site/`. `main` auto-deploys to production; live at https://corewise.academy.
- Only `main` deploys: `site/vercel.json` sets `git.deploymentEnabled` to `{"**": false, "main": true}` (the rate-limit fix). Branch pushes and PRs do not deploy, so they are free.
- Deploy budget: Vercel free tier, 100 production deploys per rolling 24h (previews included). Batch merges; do not merge once per micro-task.

## Merge is not done until it is live on the site (standing rule)

Every merge is complete only when confirmed live on the actual deployed site, not just merged to `main`.

- After `gh pr merge`, confirm the production deploy reached success:
  `gh api repos/ryanportfolio/Corewise.Academy/commits/main/status --jq .state` (expect `success`).
- When the change touches site-visible content (`site/`), also verify on the live URL: load or grep https://corewise.academy for the changed copy. That live check is the definition of done, not the commit status alone.
- On a rate-limit or build failure, say plainly that live is stale and when it clears. Never imply the change is live when it is not.
- Caveat: merges touching only internal agent files (`.claude/`, `.agents/`) redeploy the site byte-identical and have no public-visible surface. Confirm the deploy went green and state there is nothing user-facing to show.

### 2026-07-24: curl cannot do the live check; use WebFetch with a cache-buster

`curl` has no working TLS in this environment. Every HTTPS request fails with exit code 35
(SSL connect error) and no body, so a `curl | grep` live check silently reports "copy not
there yet" no matter what is deployed. A background `until curl ... ; do sleep; done` poll
built on it never fires. Use WebFetch for the live check instead. WebFetch caches per URL
for 15 minutes, so on a re-check after a deploy add a throwaway query param
(`https://corewise.academy/tracks/foundations/?v=2`) or the stale pre-deploy text comes
back and reads as a failed deploy. Bit once on the Foundations copy merge: the deploy was
green the whole time, the checker was broken.

## Other projects

- willaicite: Railway (geo-audit tool). Different platform and live URL; see its own deployment notes.
