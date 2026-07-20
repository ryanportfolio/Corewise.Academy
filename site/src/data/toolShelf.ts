// The skills offered for copy on the "How guides get made" page. Each is a real
// file from the repo that runs this site, cleaned for publication (em dashes
// swapped for house punctuation, references to bundled companion files removed so
// the single file stands alone). Grouped by what the reader would reach for.
import { SHOWPIECE_SKILL } from './showpieceSkill';
import { CAVEMAN_SKILL } from './cavemanSkill';
import vetThirdPartySkill from './skills/vet-third-party-skill.md?raw';
import humanizer from './skills/humanizer.md?raw';
import purposefulWriting from './skills/purposeful-writing.md?raw';
import plainWords from './skills/plain-words.md?raw';
import enhancePrompt from './skills/enhance-prompt.md?raw';
import brainstorming from './skills/brainstorming.md?raw';
import systematicDebugging from './skills/systematic-debugging.md?raw';
import testDrivenDevelopment from './skills/test-driven-development.md?raw';
import verificationBeforeCompletion from './skills/verification-before-completion.md?raw';

export interface ShelfSkill {
  /** Display name on the plate. */
  name: string;
  /** Where the reader saves the file to install it. */
  savePath: string;
  /** One plain line: what it does for you. */
  blurb: string;
  /** The full file, copied verbatim from the data files above. */
  content: string;
  /** If the skill has its own guide on the site, link it. */
  guideHref?: string;
}

export interface ShelfGroup {
  title: string;
  note: string;
  skills: ShelfSkill[];
}

export const TOOL_SHELF: ShelfGroup[] = [
  {
    title: 'Prose and clarity',
    note: 'The writing pass this site runs on its own copy. Point them at a draft.',
    skills: [
      {
        name: '/humanizer',
        savePath: '.claude/skills/humanizer/SKILL.md',
        blurb: 'Strip AI tells from a draft and give it a human voice.',
        content: humanizer,
      },
      {
        name: '/purposeful-writing',
        savePath: '.claude/skills/purposeful-writing/SKILL.md',
        blurb: 'Draft or revise prose so it does one job for a real reader.',
        content: purposefulWriting,
      },
      {
        name: '/plain-words',
        savePath: '.claude/skills/plain-words/SKILL.md',
        blurb: 'Swap fancy or insider words for plain ones a stranger gets.',
        content: plainWords,
      },
      {
        name: '/enhance-prompt',
        savePath: '.claude/skills/enhance-prompt/SKILL.md',
        blurb: 'Turn a rough request into a clean prompt a fresh agent can run.',
        content: enhancePrompt,
      },
    ],
  },
  {
    title: 'Method and engineering',
    note: 'How the work gets built and checked, not just the writing.',
    skills: [
      {
        name: '/brainstorming',
        savePath: '.claude/skills/brainstorming/SKILL.md',
        blurb: 'Work through a design with open goals before writing any code.',
        content: brainstorming,
      },
      {
        name: '/test-driven-development',
        savePath: '.claude/skills/test-driven-development/SKILL.md',
        blurb: 'Write the failing test first, then the code that passes it.',
        content: testDrivenDevelopment,
      },
      {
        name: '/systematic-debugging',
        savePath: '.claude/skills/systematic-debugging/SKILL.md',
        blurb: 'Reproduce a bug and trace it to the root cause before fixing.',
        content: systematicDebugging,
      },
      {
        name: '/verification-before-completion',
        savePath: '.claude/skills/verification-before-completion/SKILL.md',
        blurb: 'Prove the work is done before you claim it is.',
        content: verificationBeforeCompletion,
      },
    ],
  },
  {
    title: 'Craft and safety',
    note: 'The three with a full guide of their own. The plate copies the skill; the link explains it.',
    skills: [
      {
        name: '/showpiece',
        savePath: '.claude/skills/showpiece/SKILL.md',
        blurb: 'Build a one-of-a-kind artifact that reads as crafted, not AI slop.',
        content: SHOWPIECE_SKILL,
        guideHref: '/guides/the-design-concept-does-the-work/',
      },
      {
        name: '/caveman',
        savePath: '.claude/skills/caveman/SKILL.md',
        blurb: 'Cut token use by speaking in compressed shorthand, full accuracy kept.',
        content: CAVEMAN_SKILL,
        guideHref: '/guides/thinking-on-a-budget/',
      },
      {
        name: '/vet-third-party-skill',
        savePath: '.claude/skills/vet-third-party-skill/SKILL.md',
        blurb: 'Scan a skill for injection or data theft before you install it.',
        content: vetThirdPartySkill,
        guideHref: '/guides/expertise-you-can-install/',
      },
    ],
  },
];
