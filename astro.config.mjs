import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import fs from 'node:fs';

// Réalisations en brouillon (noindex) : exclues du sitemap
const brouillons = fs.readdirSync('./src/content/realisations')
  .filter((f) => f.endsWith('.md') && /brouillon:\s*true/.test(fs.readFileSync(`./src/content/realisations/${f}`, 'utf8')))
  .map((f) => `/realisations/${f.replace(/\.md$/, '')}/`);

// Domaine de production : à remplacer par le vrai domaine (voir TODO-CLIENT.md)
const SITE = process.env.PUBLIC_SITE_URL || 'https://acs.nairox.fr';

export default defineConfig({
  site: SITE,
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  compressHTML: true,
  integrations: [
    sitemap({
      // Pages en noindex exclues du sitemap
      filter: (page) =>
        !page.includes('/mentions-legales/') &&
        !page.includes('/politique-confidentialite/') &&
        !page.includes('/devis/merci/') &&
        !page.includes('/404') &&
        !brouillons.some((b) => page.endsWith(b)),
      changefreq: 'monthly',
      priority: 0.7,
    }),
  ],
});
