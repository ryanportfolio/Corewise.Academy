# Solving bottlenecks: brief for the A-800 film

Source: `site/src/scripts/about-film.js`. It plays on `/about/`, sheet A-800.
Every on-screen string is listed with its source in `facts.md`.

## Feeling and job

The viewer should feel the relief of a queue draining, and leave able to say:
Ryan finds the one slow step in a business, fixes it with reviewed and tested
work, and hands it over.

## Direction

One ink drawing on the page's paper, in the drawing set's line law. Customers
are dots moving through four stages. The channel is as wide as each stage's
capacity, so the slow stage is drawn as a bottle neck. Customers queue behind
it, hollow out as they wait, and drop off dashed. Vermilion marks the
constraint and moves when the constraint moves.

Two directions were set aside: a kinetic-type piece built only from the
portfolio copy (it explains nothing a stranger can see), and a portfolio
showreel of the twelve works (the page above already is one).

## Beat sheet

82 seconds, silent, 16:9 on desktop and recomposed 4:5 on phones.

| t (s) | Beat | Picture | Words on screen |
|---|---|---|---|
| 0 to 11 | Cold open | The channel draws in. Customers flow, pile up behind the narrow convert stage, hollow out and drop off | A business grows only as fast as its slowest step |
| 11 to 20 | But | Everything upstream speeds up. The queue swells, more drop off, the "through" gauge does not move | Speeding up any other step changes nothing |
| 20 to 29 | Step 1 | A caliper measures each stage and stops on the neck. A revision cloud rings it. Bars count the drop-off per stage | Find the slowest step together |
| 29 to 38 | Step 2 | A goal splits into smaller ones. Two versions are tested, one is struck out dashed, one is kept | Break the goal down |
| 38 to 48 | Step 3 | A change runs build, review, test, ship. The reviewer catches it once and sends it back | Build the fix |
| 48 to 57 | Step 4 | One mark per scored run builds a distribution. A second batch lands to the right and the average moves | Test it many times |
| 57 to 66 | Step 5, the payoff | The change rises into the neck and the walls open. The queue drains, "through" passes its old mark, and a stamp lands | Hand it over |
| 66 to 74 | Step 6 | A smaller queue forms at the next stage. The cloud moves there. A four-part cycle turns | Continue to optimize |
| 74 to 82 | End slate | The channel keeps flowing | Tell me what you want to build or fix |

## Rules the build follows

- `frame(t)` is a pure function of time. The customer flow is simulated once
  from a fixed seed into a timetable; nothing integrates between frames.
- No sound. No periods in display text.
- One accent per actor: vermilion for the constraint, blue for the change being
  built, ochre for the reviewer, green for the verified result.
- Applied from `inspiration.md`: one keyed mark per customer for the whole film,
  hollowing while waiting (Sam Rose, Mike Bostock); many scored runs instead of
  one lucky pass (Bostock, Bret Victor); the accent sits only on the stage that
  is the constraint and moves with it (Heer, Ciechanowski).

## Status

Built and checked from stills at desktop, phone and night theme. Not yet done:
a review of natural-speed playback by the owner, and any video export. An MP4
would go through WebCodecs per the motion-design skill, after the owner
approves the pacing.
