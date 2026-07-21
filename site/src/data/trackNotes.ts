// Per-track editorial matter for the track pages: a title tagline, field
// notes, chalk lines quoted from the guides, and the primary sources the
// track's guides teach from. Quotes are verbatim from the named guide.
export interface TrackNotes {
  tagline: string;
  notes: string[];
  quotes: { text: string; guideTitle: string; href: string }[];
  links: { href: string; label: string }[];
}

export const TRACK_NOTES: Record<string, TrackNotes> = {
  foundations: {
    tagline: 'how AI models work',
    notes: [
      'Foundations is where the Academy starts because every other layer leans on it. Before prompting tricks or agent setups, you need a working picture of what a large language model can and cannot do, how the current lineup differs, and why the model you learned last quarter may not be the model shipping now.',
      'The foundations here are deliberately practical: release notes read closely, vendor guides compared side by side, and the migration changes that actually bite. A typical guide in this layer runs 5 minutes, so the whole shelf fits inside a coffee break.',
    ],
    quotes: [
      {
        text: 'This quarter’s Claude lineup already replaced last quarter’s.',
        guideTitle: 'The new Claude lineup and what it breaks',
        href: '/guides/new-claude-lineup/',
      },
      {
        text: 'Two vendors, one instruction: say less.',
        guideTitle: 'Claude and OpenAI, one prompting playbook',
        href: '/guides/one-prompting-playbook/',
      },
      {
        text: 'Discipline makes the astronomer; the telescope only helps.',
        guideTitle: 'Rent the model, own the method',
        href: '/guides/rent-the-model-own-the-method/',
      },
    ],
    links: [
      { href: 'https://docs.claude.com/en/docs/about-claude/models/overview', label: 'Anthropic · Claude models overview' },
      { href: 'https://platform.openai.com/docs/models', label: 'OpenAI · model reference' },
      { href: 'https://arxiv.org/abs/1706.03762', label: 'Vaswani et al. · “Attention Is All You Need” (arXiv)' },
      { href: 'https://en.wikipedia.org/wiki/Large_language_model', label: 'Wikipedia · large language model' },
      { href: 'https://www.anthropic.com/news', label: 'Anthropic · release announcements' },
    ],
  },
  prompting: {
    tagline: 'briefing the model',
    notes: [
      'Prompting is the craft of briefing a model, and context is the material you brief it with. This layer treats the two as one discipline: what you say, what you attach, and how you arrange both so the model attends to what matters instead of guessing.',
      'The prompting guides run from the fundamentals that hold across every current model to the context budgets that decide what an agent session costs. Reading the whole layer takes 26 minutes; the habits it replaces waste far more than that every week.',
    ],
    quotes: [
      {
        text: 'A colleague who is confused, Claude will be too.',
        guideTitle: 'Brief the model like a brilliant new hire',
        href: '/guides/brief-the-model/',
      },
      {
        text: 'You are steering a model that already listens.',
        guideTitle: 'Stop shouting at the model',
        href: '/guides/stop-shouting-at-the-model/',
      },
      {
        text: 'Reasoning tokens are billed twice.',
        guideTitle: 'Thinking on a budget',
        href: '/guides/thinking-on-a-budget/',
      },
    ],
    links: [
      { href: 'https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/overview', label: 'Anthropic · prompt engineering documentation' },
      { href: 'https://platform.openai.com/docs/guides/prompt-engineering', label: 'OpenAI · prompt engineering guide' },
      { href: 'https://arxiv.org/abs/2005.14165', label: 'Brown et al. · “Language Models are Few-Shot Learners” (arXiv)' },
      { href: 'https://en.wikipedia.org/wiki/Prompt_engineering', label: 'Wikipedia · prompt engineering' },
      { href: 'https://www.anthropic.com/engineering', label: 'Anthropic · engineering blog' },
    ],
  },
  agents: {
    tagline: 'reliable autonomy',
    notes: [
      'Agents are models that act: they call tools, read files, and carry multi-step work without a human on every turn. Automation only pays when that autonomy is reliable, so this layer covers the working rules that keep agents honest over hours-long runs.',
      'The agents shelf is currently the deepest in the Academy: 60 minutes of reading across seven guides, from finding the bottleneck worth automating to giving an agent a memory that survives the session. Run records, verification, and handover discipline run through every one of them.',
    ],
    quotes: [
      {
        text: 'The line moves at the pace of the slowest hiker: find yours before you build anything.',
        guideTitle: 'Automate the step that slows you down',
        href: '/guides/automate-the-bottleneck/',
      },
      {
        text: 'Installing a skill means installing someone’s judgment.',
        guideTitle: 'Expertise you can install',
        href: '/guides/expertise-you-can-install/',
      },
      {
        text: 'A session ends and the agent forgets everything, unless you give it somewhere to write.',
        guideTitle: 'Give your agent a memory',
        href: '/guides/give-your-agent-a-memory/',
      },
    ],
    links: [
      { href: 'https://www.anthropic.com/engineering/building-effective-agents', label: 'Anthropic · building effective agents' },
      { href: 'https://modelcontextprotocol.io/', label: 'Model Context Protocol · official site' },
      { href: 'https://arxiv.org/abs/2210.03629', label: 'Yao et al. · “ReAct: Synergizing Reasoning and Acting” (arXiv)' },
      { href: 'https://github.com/anthropics/claude-code', label: 'Anthropic · Claude Code repository' },
      { href: 'https://en.wikipedia.org/wiki/Intelligent_agent', label: 'Wikipedia · intelligent agent' },
    ],
  },
  building: {
    tagline: 'shipping AI features',
    notes: [
      'Building with AI means shipping features other people rely on, which is a different job from getting a demo to work once. This layer covers the parts that survive contact with users: API discipline, retrieval, evals, and design decisions that a page can actually defend.',
      'The building shelf opens with design because that is where most AI-assisted work visibly fails. One guide, 9 minutes, and a method that generalizes; API, retrieval, and eval guides join the shelf as they clear editorial review, since 100% of the catalogue passes through a human editor first.',
    ],
    quotes: [
      {
        text: 'Slop is what a page looks like when nothing decided it.',
        guideTitle: 'The design concept does the work',
        href: '/guides/the-design-concept-does-the-work/',
      },
      {
        text: 'One repo learns; the next should not start dumb.',
        guideTitle: 'Every new repo starts with your lessons',
        href: '/guides/firmware-not-folklore/',
      },
      {
        text: 'Installing a skill means installing someone’s judgment.',
        guideTitle: 'Expertise you can install',
        href: '/guides/expertise-you-can-install/',
      },
    ],
    links: [
      { href: 'https://docs.claude.com/', label: 'Anthropic · Claude developer documentation' },
      { href: 'https://platform.openai.com/docs/', label: 'OpenAI · developer documentation' },
      { href: 'https://arxiv.org/abs/2312.10997', label: 'Gao et al. · “Retrieval-Augmented Generation for LLMs: A Survey” (arXiv)' },
      { href: 'https://en.wikipedia.org/wiki/Retrieval-augmented_generation', label: 'Wikipedia · retrieval-augmented generation' },
      { href: 'https://astro.build/', label: 'Astro · the framework this site ships on' },
    ],
  },
  practice: {
    tagline: 'daily habits and judgment',
    notes: [
      'Practice is the layer for what you do every day: the habits, verification rituals, and taste that decide whether working with AI makes you steadily better or slowly worse. Knowing when not to use the model is part of the same practice as knowing how.',
      'The practice shelf is being written now, so its levels sit empty while drafts clear review. The standard it will hold to is already set: guides of 5 to 11 minutes, objectives you can check, and 100% of claims sourced or marked as the editor’s own field notes.',
    ],
    quotes: [
      {
        text: 'Reasoning tokens are billed twice.',
        guideTitle: 'Thinking on a budget',
        href: '/guides/thinking-on-a-budget/',
      },
      {
        text: 'A model that runs for hours needs a support structure.',
        guideTitle: 'Guardrails for hours-long agent runs',
        href: '/guides/guardrails-for-long-runs/',
      },
      {
        text: 'Discipline makes the astronomer; the telescope only helps.',
        guideTitle: 'Rent the model, own the method',
        href: '/guides/rent-the-model-own-the-method/',
      },
    ],
    links: [
      { href: 'https://www.anthropic.com/engineering', label: 'Anthropic · engineering blog' },
      { href: 'https://en.wikipedia.org/wiki/Automation_bias', label: 'Wikipedia · automation bias' },
      { href: 'https://arxiv.org/abs/2107.03374', label: 'Chen et al. · “Evaluating LLMs Trained on Code” (arXiv)' },
      { href: 'https://docs.claude.com/', label: 'Anthropic · Claude developer documentation' },
      { href: 'https://platform.openai.com/docs/guides/prompt-engineering', label: 'OpenAI · prompt engineering guide' },
    ],
  },
};
