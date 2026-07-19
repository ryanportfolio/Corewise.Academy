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

## Other projects

- willaicite: Railway (geo-audit tool). Different platform and live URL; see its own deployment notes.
