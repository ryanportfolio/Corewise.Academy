# Clarity review evaluation, October 16, 2026

Maintainer evidence, not reviewer input. [benchmark.json](benchmark.json) holds
the excerpts, frozen keys, source-guide identity, and per-case blind grading.
Give reviewers only the excerpt text, audience, house voice, assigned skill,
and its required calibration. Keep keys and prior outcomes out of their context.

## What changed and why

The earlier guide review accepted vague instructions and unnatural prose despite
general guidance about clarity. The candidate adds fixed calibration examples,
a dedicated sentence read, scrutiny of the proposed replacement, quoted weakest
passages with reasons, and explicit author responsibility for the verdict.

The first candidate failed: it retained the inspectable-result/correctable-mistake
sentence and reproduced that pattern in another proposed fix. It also retained
the authored sentence about verifying missing browser evidence. That failed run
is retained here with both raw round-one reports. The next candidate adds task-selection calibration
and separates preserving a caveat's meaning from preserving defective wording.

## Frozen comparison and results

Both readers had fresh context, the same inherited model/settings, inputs,
audience, house voice, tool limits, and one-review budget. Only the assigned skill
and its fixed calibration differed. A separate agent authored the new held-out
set without reading either skill or prior cases, then graded anonymized reports
against its unchanged key. The author checked its judgments against raw reports.

| Measure | Baseline | Revised review |
| --- | --- | --- |
| Original corpus, usable required fixes | 4/8 | 7/8 |
| Original known passages | 0/2 | 2/2 |
| Original development passages | 4/6 | 5/6 |
| Independently authored held-out passages | 5/6 | 5/6 |
| Clean controls retained, both sets | 8/8 | 8/8 |
| Production-guide target passages | 0/5 | 5/5 |

The production targets include all four editor-rejected passages plus the
browser-evidence sentence. Calibration covers G2-G5, including the browser-evidence
fix, plus P02 and the synonym pattern in P04. Production-target results are
regression evidence, not unseen generalization.
The original novel cases were also inspected after the failed first round and
used during revision. Their second-round scores are development evidence. Only
the independently authored set was fresh after revision; both versions scored 5/6.
Quoted weakest-passage evidence and substantive sentence review were observed
in the candidate output; headings alone did not earn credit.

Local acceptance thresholds were fixed before testing: both known cases,
at least five of six unseen cases in each set, all five guide targets, and clean
controls preserved. Only required findings with sufficient repairs or targeted
author questions count. Optional notes and synonym swaps do not count.

## Limits and rejected fixes

P08's proposed rewrite still leaves the missing case unnamed. H08's rewrite
supplies examples but drops the criterion for expanding scope and imposes an
unjustified single-screen limit. Both were excluded as usable fixes. H08 was the
grader's closest call and was scored conservatively. One extra full-guide
self-check edit was unnecessary; reject it too. The eight fixed clean controls
had no required edits, changed quotations, lost caveats, or removed technical terms.

The bounded improvement is more valid required catches on the original corpus
and guide. This includes treating previously optional edits as requirements and
applying the supplied calibration. It does not establish better detection in new
writing. The separately authored held-out score did not improve. This paired
test establishes local acceptance, not a future error rate. Later use is pending.

## Audit trail and publication changes

[provenance.json](provenance.json) identifies the baseline, failed candidate,
tested candidate, exact input files, and raw reports with SHA-256 hashes. The
snapshots and both rounds' reports are committed here. The frozen guide is also
identified by its original source commit. `benchmark.json` includes a guide key
mapping G1-G5 to the criteria used in the recorded plan and grading brief. That
JSON mapping was added during the publication audit; it was not a separately
hashed key before the trial. P/H inputs and their original frozen keys remain
unchanged.

The paired scores apply to `tested-candidate/SKILL.md` and its calibration,
not to every later revision. Publication review added two narrow guards: disclose
calibration drawn from the draft, and ask the author when needed context is absent.
Their validation is recorded separately in provenance. Reviewer agreement with
calibrated replacements in this guide is not independent confirmation of those
passages; the author inspected them directly. The reviewer still had fresh context
for the remainder of the guide.

## Repeating the check

Freeze the baseline, candidate, calibration, inputs, and keys before dispatch.
Use separate fresh read-only readers, then a judge blind to version identities.
Check the repairs as well as the findings. Preserve failed candidates. For a new
calibration change, add fresh independently authored cases so memorizing existing
examples cannot establish improvement. Keep source facts and mechanical checks
separate from editorial judgment. Keep temporary runs in scratch; retain the
snapshots, keys, and raw reports used for published evaluation claims in this
single archive, outside the reviewer skill's input directory.

The separate publication-guard check passed its two behavioral checks: the
coordinator recorded calibration overlap and required author inspection, and the
reader asked for missing selection criteria without inventing a feature. Its
fixture correctly remained INCOMPLETE. The report and fixture are archived here;
this check does not repeat the paired comparison or establish a detection rate.
