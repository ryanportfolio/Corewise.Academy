# Inspiration for the about film

Research for a 60 s silent explainer about the slowest step in a business: work queues at one stage, speeding up other stages changes nothing, the stage is found, fixed, verified by repeated scored runs, handed over, and the search moves to the next weak point. Ink line work on warm paper, monospace labels, serif statements, one accent colour per actor.

Read 2026-11-10. Every row below was read at the linked source unless marked unverified. Quotes are the source's words.

## Teachings

| Person | Teaching | Source |
|---|---|---|
| Bret Victor | Show the whole behaviour at once: a static plot that "represents the system for all time, not one particular time" beats watching playback. Overlay many runs, add one summary metric plotted against the parameter, and mark outliers whose colour or position is "conspicuously different from their neighbors". The insight sits in "the transitions between" the abstract and concrete views. | [Up and Down the Ladder of Abstraction](http://worrydream.com/LadderOfAbstraction/) |
| Bret Victor | Flow "must be made visible and tangible". "Show the data", show comparisons rather than single values, and eliminate hidden state so every action has a visible effect. Overlay all frames to "give context to the active frame". | [Learnable Programming](http://worrydream.com/LearnableProgramming/) |
| Grant Sanderson | "Open with the key exercise; don't put it at the end." Definitions are "an ending point", not a starting point. "Always ask what picture or visual you could use." "Every movement on the screen should be deliberate, with an identifiable purpose." | [3Blue1Brown about / SoME1 FAQ](https://www.3blue1brown.com/about/) |
| Nicky Case | Place your bets: ask the viewer to predict before showing the answer, then reveal how the prediction compared; the reveal lands harder after the viewer has wrestled with the question. Sandbox pieces start as a "kiddy pool" and add parts gradually. | [Explorable Explanations: 4 more design patterns](https://blog.ncase.me/explorable-explanations-4-more-design-patterns/) |
| Bartosz Ciechanowski | Show a part on its own before it joins the machine; "I'll first hide all the unrelated parts" while explaining one mechanism. Colour-code each part and keep its name tied to that colour. Highlight a pair of gears "only when they're actively transferring power". Add one component at a time. | [Mechanical Watch](https://ciechanow.ski/mechanical-watch/) |
| Mike Bostock | Animation "relies heavily on our memory"; "the eye scans faster than the hand". A comic strip of key frames can explain more than playback. "Showing a single run of the algorithm does not effectively assess the quality" of a random process: show many runs. Design for "the specific question at hand". | [Visualizing Algorithms](https://bost.ocks.org/mike/algorithms/) |
| Mike Bostock | Object constancy: give every mark a key so the same item stays the same mark through a transition; "the default join-by-index can be misleading". Persisting items move, entering and exiting items fade. Between unrelated views use "a simpler cross-fade or cut". | [Object Constancy](https://bost.ocks.org/mike/constancy/) |
| Jeffrey Heer and George Robertson | Keep every in-between frame a valid diagram. Use simple transitions; translation and expand/contract read more easily than rotation. Stage complex changes into simple sub-transitions (for example rescale axes before changing values). Stagger onsets to reduce occlusion when 3 or more items overlap. Slow-in slow-out timing. Transitions "around 1 second", faster when movement is small. | [Animated Transitions in Statistical Data Graphics, 2007](https://idl.cs.washington.edu/files/2007-AnimatedTransitions-InfoVis.pdf) |
| Sam Rose | Queue as slots; each request is a moving element that "shrinks in a clock-like fashion" while being processed. New arrivals are briefly highlighted "to make it easier to see where they end up in the queue". A waiting request gradually turns hollow as its user gives up. Priority items differ by colour and stripes. | [Queueing](https://samwho.dev/queueing/) |
| Sam Rose | Link text to picture: "little SVG symbols next to the words that are highlighted with colours that match up with the visuals". | [Write That Blog interview](https://writethatblog.substack.com/p/sam-rose-on-technical-blogging) |
| Jorge R. Canedo Estrada | "The movement is what tells the story rather than the frame itself." Simple shapes leave "a certain elegance and simplicity where you can't hide the movement." "Don't be afraid of just looking at the same movement a hundred times until it feels right." | [HuffPost interview, 2020](https://www.huffpost.com/entry/lhm-2020-motion-designer-jorge-r-canedo-e_n_5f6a31a4c5b68400a231f426) |
| Jay Grandin | The studio's core skill: "trying to figure out what is the nugget, why does anyone care?" For a confusing topic, don't tell it as "some aspirational story, that's a poem", and don't use the "five paragraph essay" (say what you'll say, say it, repeat it); use a clear logical flow. | [Motion Hatch ep. 98](https://motionhatch.com/098-how-giant-ant-became-a-leading-motion-design-studio-jay-grandin) |
| Rauno Freiberg | Motion should show where a thing came from, and direction can encode position in a stack. Good reasons to animate: "Object permanence, creating a focal point, and delight." A repeated flourish becomes "cognitive burden after seeing the same animation for the hundredth time". A brief accent-colour blink confirms a selection without a long transition. | [Invisible Details of Interaction Design](https://rauno.me/craft/interaction-design) |
| Emil Kowalski | Delight is a valid purpose only for animation people see rarely; frequent repetition turns it into irritation. UI animation stays "under 300ms"; marketing pages are the exception. | [You Don't Need Animations](https://emilkowal.ski/ui/you-dont-need-animations) |
| Edward Tufte | Smallest effective difference and layering and separation: design theory for marking a signal against a quiet ground. Tufte's own page points to *Visual Explanations* ch. 4 and *Envisioning Information* ch. 3, and to "muting the contrast between data and background". Unverified: the wording "Make all visual distinctions as subtle as possible, but still clear and effective" comes from secondary quotes of the book, not read at source. | [Sparkline theory and practice](https://www.edwardtufte.com/notebook/sparkline-theory-and-practice-edward-tufte/) |
| Jake Archibald | Draw-on line technique: set `stroke-dasharray` to the path length (from `getTotalLength()`), set `stroke-dashoffset` to the same length to hide it, then animate the offset to 0. On canvas the same idea is `setLineDash` plus `lineDashOffset`. | [Animated line drawing in SVG](https://jakearchibald.com/2013/animated-line-drawing-svg/) |

### Checked, nothing usable found at source

- Amelia Wattenberger: wattenberger.com/blog returned 404 and the 2019 D3 post did not render; her animation teaching is in a paid book and workshop. Unverified.
- Emanuele Colombo: only course pages and third-party summaries (arcs, overlap, 12 principles). No first-hand text read. Unverified.
- Ben Marriott: nothing beyond the graph-editor point already in principles.md.
- School of Motion Explainer Camp (Jake Bartlett): the course page lists visual metaphors, storyboards and animatics, but gives no technique.
- Jay Grandin and Bartosz Ciechanowski on process: no written interview found for Ciechanowski; his techniques above come from the article itself.

## New against principles.md

principles.md already has: concrete before abstract, purposeful movement, but/therefore chains, the ladder of abstraction (as concrete, general, concrete), Tversky congruence and apprehension, common fate, tracking limits, Ciechanowski as a reference work, Grandin's "feeling givers". New here:

- Show the whole run at once next to the live run: overlay or a key-frame strip, because playback taxes memory (Victor, Bostock).
- One run proves nothing about a variable process; show many runs and one summary number per run (Bostock, Victor).
- Mark the outlier by being "conspicuously different from its neighbours", and keep everything else muted (Victor, Tufte).
- Hide unrelated parts while one mechanism is explained; highlight a part only while it is doing work (Ciechanowski).
- Keyed object constancy: an item keeps its mark for the whole film; unrelated scenes cut or cross-fade instead of morphing (Bostock).
- Concrete transition rules with numbers: about 1 s per transition, stage complex changes, stagger onsets when 3 or more items overlap, prefer translation and expand/contract over rotation, keep every in-between frame a valid diagram (Heer and Robertson).
- Queue grammar from a working example: slots, arrival highlight, clock-wipe for processing, hollowing for waiting too long (Rose).
- Colour-key the words: a caption word carries the same colour as the actor it names (Rose).
- Ask the viewer to predict, hold, then reveal (Case, place your bets).
- Open with the key exercise; the term arrives at the end (Sanderson). principles.md has "never open with definitions" but not "definition as ending point".
- Find "the nugget, why does anyone care", and avoid the five-paragraph-essay structure (Grandin).
- Motion shows origin; direction encodes position; a repeated flourish wears out by the hundredth time (Rauno, Kowalski). Relevant because the film's loop repeats.
- With simple shapes the movement carries the story and weak motion can't hide; rewatch each move many times (Canedo).
- Draw-on stroke technique via dash offset (Archibald).

## Apply to this piece

1. **Sam Rose's queue grammar with Bostock's keyed constancy.** Draw each work item as one keyed ink token that keeps its identity from intake to delivery, flash its outline briefly when it lands in a queue slot, wipe it clock-wise while a stage processes it, and let tokens that wait too long thin from filled to hollow, so the pile-up at the slow stage reads without a caption.
2. **Bostock and Victor: one run proves nothing, so show many.** For the verify beat, run the fixed line several times as a strip of small repeated runs with one monospace score per run (items delivered per tick) plotted as a row of marks, so the fix is shown as a stable number across runs rather than one lucky pass.
3. **Heer's staging with Ciechanowski's "highlight only what is doing work".** Change one thing per transition (about 1 s each, translation rather than rotation), keep the other stations in muted hairline, and give the accent colour only to the stage that is currently the constraint, so when the constraint moves to the next stage the accent moves with it and the viewer sees the loop restart.
