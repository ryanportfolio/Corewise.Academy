# Give a managed agent a memory store

Consult when a Managed Agents session needs to carry state (preferences, conventions, prior mistakes, domain context) across sessions that otherwise start fresh. For live endpoint shapes, ids, and error codes, check the Anthropic Managed Agents memory docs rather than trusting this file.

## What a memory store is

A memory store is a workspace-scoped set of text files, each addressed by a path like `/formatting_standards.md`. It mounts as a directory the agent reads and writes with its ordinary file tools.

- Attach a store at session creation. It mounts under `/mnt/memory/` at a short name derived from the store's name.
- Read the authoritative `mount_path` off the session's memory-store resource. Do not construct the path yourself.
- Enable the agent's file tools at agent creation, or it cannot touch the mount at all.
- A description of every mount lands in the system prompt automatically, so the agent knows what each store holds.

## Writes persist only under the real mount path

- Every change creates an immutable memory version (id prefix `memver_`). That is the audit trail and the way to restore an earlier version.
- Versions belong to the store and survive after a memory is deleted, so history stays complete.
- A write anywhere else under `/mnt/memory/` (not the real mount path) goes to temporary local storage and vanishes when the session ends.

## read_only is the decision that matters

The `access` field defaults to `read_write`, and that default is risky.

- Threat: a prompt injection from untrusted input makes one session write malicious content, and a later session reads it back as trusted memory. The write happens under untrusted conditions, the read under trusted ones.
- Access is enforced at the filesystem level, so `read_only` genuinely rejects writes.
- Use `read_only` for reference material and any store the agent has no business modifying.
- Reserve `read_write` for the sessions that actually add memories. Every write to a `read_write` mount is attributed to its session in the version history.

## Caps, and how each one fails

| Cap | Limit | What fails at it |
| --- | --- | --- |
| Memory size | 100 kB, about 25 thousand tokens | Writing that memory at all |
| Memories per store | 2,000 | New writes (`memories.create` and the agent's own writes to new paths); existing entries stay readable and editable |
| Stores per session | 8, fixed in `resources[]` at creation | Attaching more, or swapping mid-session |

- Prefer many small focused files over a few large ones, because of the per-memory 100 kB cap.
- You cannot add or drop a store mid-session. Plan the full attach list up front in `resources[]`.

## Multi-store layout

Each store carries its own 2,000-memory budget, so split by scope:

- One store per end user.
- One shared domain-knowledge store, mounted `read_only` across many sessions.
- One store per project.
- Common pattern: a `read_only` shared reference store plus a `read_write` store scoped to whoever is actually writing.

## Keeping stores healthy

- Prune stale entries with `memories.delete` every 2 weeks or so. A store sitting near its cap quietly confuses the agent.
- When a store fragments, run a dreaming session to consolidate its content into a separate new output store without touching the original. Then switch sessions to the output store and archive the old one.
- When a store outgrows its scope, attach a fresh store for new content and reattach the original as `read_only`, so the agent reads both but writes only to the new one.

## Rollback and redaction

- There is no restore endpoint. To roll back, retrieve the `memver_` version you want and write its content back with `memories.update` (or `memories.create` if the parent was deleted).
- The redact endpoint scrubs content from a historical version while preserving its metadata: for leaked secrets, personal data, or a deletion request.
- You cannot redact a memory's current version. Write a new version or delete the memory first, then redact the old one.

Source guide: site/src/content/guides/give-your-agent-a-memory.mdx
