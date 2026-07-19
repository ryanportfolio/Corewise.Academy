// What each guide offers "for your agent". A guide is not automatically a skill:
// some map to a real installable skill, some to a distilled agent guide (plain
// instructions, not a skill), and some to nothing at all. Guides absent from this
// map show no "For your agent" plate and have no /guides/<slug>.md file.
import { CAVEMAN_SKILL } from './cavemanSkill';
import { SHOWPIECE_SKILL } from './showpieceSkill';
import vetThirdPartySkill from './skills/vet-third-party-skill.md?raw';
import stopShouting from './agentGuides/stop-shouting-at-the-model.md?raw';
import stopHitting from './agentGuides/stop-hitting-your-token-limit.md?raw';
import briefModel from './agentGuides/brief-the-model.md?raw';
import rentModel from './agentGuides/rent-the-model-own-the-method.md?raw';
import guardrails from './agentGuides/guardrails-for-long-runs.md?raw';
import firmware from './agentGuides/firmware-not-folklore.md?raw';
import giveMemory from './agentGuides/give-your-agent-a-memory.md?raw';

export interface AgentArtifact {
  kind: 'skill' | 'guide';
  /** Label shown on the copy plate. */
  name: string;
  /** Suggested save location for the reader. */
  savePath: string;
  /** The full file, copied verbatim and served raw. */
  content: string;
  /** The skill is already embedded in the guide body; suppress the bottom plate but still serve the raw file. */
  inBody?: boolean;
}

// Skill: the guide packages a genuine, installable skill.
// Guide: a distilled, agent-facing version of the article (not a skill).
// Absent: pure human reading, no agent artifact.
export const AGENT_ARTIFACTS: Record<string, AgentArtifact> = {
  'thinking-on-a-budget': {
    kind: 'skill',
    name: '/caveman',
    savePath: '.claude/skills/caveman/SKILL.md',
    content: CAVEMAN_SKILL,
  },
  'the-design-concept-does-the-work': {
    kind: 'skill',
    name: '/showpiece',
    savePath: '.claude/skills/showpiece/SKILL.md',
    content: SHOWPIECE_SKILL,
    inBody: true,
  },
  'expertise-you-can-install': {
    kind: 'skill',
    name: '/vet-third-party-skill',
    savePath: '.claude/skills/vet-third-party-skill/SKILL.md',
    content: vetThirdPartySkill,
  },
  'stop-shouting-at-the-model': {
    kind: 'guide',
    name: 'prompting-newest-claude-models',
    savePath: '.claude/reference/prompting-newest-claude-models.md',
    content: stopShouting,
  },
  'stop-hitting-your-token-limit': {
    kind: 'guide',
    name: 'stop-hitting-your-token-limit',
    savePath: '.claude/reference/stop-hitting-your-token-limit.md',
    content: stopHitting,
  },
  'brief-the-model': {
    kind: 'guide',
    name: 'brief-the-model',
    savePath: '.claude/reference/brief-the-model.md',
    content: briefModel,
  },
  'rent-the-model-own-the-method': {
    kind: 'guide',
    name: 'rent-the-model-own-the-method',
    savePath: '.claude/reference/rent-the-model-own-the-method.md',
    content: rentModel,
  },
  'guardrails-for-long-runs': {
    kind: 'guide',
    name: 'guardrails-for-long-runs',
    savePath: '.claude/reference/guardrails-for-long-runs.md',
    content: guardrails,
  },
  'firmware-not-folklore': {
    kind: 'guide',
    name: 'firmware-not-folklore',
    savePath: '.claude/reference/firmware-not-folklore.md',
    content: firmware,
  },
  'give-your-agent-a-memory': {
    kind: 'guide',
    name: 'give-your-agent-a-memory',
    savePath: '.claude/reference/give-your-agent-a-memory.md',
    content: giveMemory,
  },
};

export const agentArtifactFor = (slug: string): AgentArtifact | undefined => AGENT_ARTIFACTS[slug];
