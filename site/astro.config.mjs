// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://corewise.academy',
  integrations: [mdx()],
  // Fenced blocks on this site are prose artifacts (prompts), not source code;
  // they are styled by the guide layout instead of a shiki theme.
  markdown: { syntaxHighlight: false },
});
