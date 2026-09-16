/** Génère SEO.md et MAILLAGE.md à partir de dist/ (npm run docs). */
import fs from 'node:fs';
import { lirePages, normaliser } from './lib-pages.mjs';

const pages = lirePages().filter((p) => p.url !== '/404/');
const urls = new Set(pages.map((p) => p.url));
const motsCles = {
  '/': 'artisan multiservices Romainville', '/services/': 'services artisan Romainville', '/services/meubles-sur-mesure/': 'meuble sur mesure Seine-Saint-Denis',
  '/services/reparation-meubles/': 'réparation meuble Romainville', '/services/montage-meubles/': 'montage meuble Seine-Saint-Denis', '/services/renovation-interieure/': 'rénovation appartement 93',
  '/services/electricite/': 'électricien Romainville', '/services/plomberie/': 'plombier Romainville', '/realisations/': 'réalisations artisan Romainville', '/zone-intervention/': 'zone intervention artisan 93',
  '/a-propos/': 'Seydou Traoré artisan Romainville', '/devis/': 'devis artisan Romainville', '/blog/': 'conseils travaux 93', '/accessibilite/': '—', '/plan-du-site/': '—', '/mentions-legales/': '— (noindex)', '/politique-confidentialite/': '— (noindex)', '/devis/merci/': '— (noindex)',
};
const mc = (u) => motsCles[u] ?? (u.startsWith('/zone-intervention/') ? `artisan multiservices ${u.split('/')[2]}` : u.startsWith('/blog/') ? 'longue traîne (article)' : u.startsWith('/realisations/') ? 'réalisation (brouillon)' : '');

let seo = '# SEO — récapitulatif par page\n\nGénéré automatiquement par `npm run docs` après `npm run build`. Le nombre de mots est celui du `<main>` de la page construite.\n\n| URL | Title (car.) | Meta description (car.) | H1 | Mot-clé principal | Mots | Index |\n|---|---|---|---|---|---|---|\n';
for (const p of pages) seo += `| ${p.url} | ${p.title} (${p.title.length}) | ${p.description} (${p.description.length}) | ${p.h1[0] ?? '—'} | ${mc(p.url)} | ${p.mots} | ${p.noindex ? 'noindex' : 'index'} |\n`;
fs.writeFileSync('SEO.md', seo);

const sortants = new Map(), entrants = new Map([...urls].map((u) => [u, []]));
for (const p of pages) {
  const vus = new Map();
  for (const l of p.liensMain) { const u = normaliser(l.href); if (u && urls.has(u) && u !== p.url && !vus.has(u)) vus.set(u, l.ancre); }
  sortants.set(p.url, vus);
  const tousVus = new Set();
  for (const l of p.liensTous) { const u = normaliser(l.href); if (u && urls.has(u) && u !== p.url && !tousVus.has(u)) { tousVus.add(u); entrants.get(u).push({ de: p.url, ancre: l.ancre, contexte: vus.has(u) }); } }
}
let m = '# Maillage interne\n\nGénéré automatiquement par `npm run docs`. « Contextuels » = liens dans le `<main>` (hors menu, fil d’Ariane et pied de page). « Entrants » compte tous les liens, menu et pied de page inclus, en distinguant les liens contextuels.\n\n';
const orphelines = [...entrants].filter(([u, e]) => e.length === 0 && u !== '/devis/merci/').map(([u]) => u);
m += `## Synthèse\n\n- Pages : ${pages.length}\n- Pages orphelines : ${orphelines.length ? orphelines.join(', ') : 'aucune'}\n- Pages avec moins de 3 liens entrants : ${[...entrants].filter(([u, e]) => e.length < 3 && u !== '/devis/merci/').map(([u, e]) => `${u} (${e.length})`).join(', ') || 'aucune'}\n\n`;
m += '| Page | Liens entrants (total / contextuels) | Liens contextuels sortants | Liens totaux |\n|---|---|---|---|\n';
for (const p of pages) { const e = entrants.get(p.url); m += `| ${p.url} | ${e.length} / ${e.filter((x) => x.contexte).length} | ${sortants.get(p.url).size} | ${p.liensTous.length} |\n`; }
m += '\n## Détail par page\n';
for (const p of pages) {
  m += `\n### ${p.url}\n\n**Sortants contextuels (${sortants.get(p.url).size})** :\n`;
  for (const [u, a] of sortants.get(p.url)) m += `- → ${u} — « ${a.slice(0, 70)} »\n`;
  const e = entrants.get(p.url);
  m += `\n**Entrants (${e.length})** :\n`;
  for (const x of e) m += `- ← ${x.de}${x.contexte ? ' (contextuel)' : ''} — « ${x.ancre.slice(0, 70)} »\n`;
}
fs.writeFileSync('MAILLAGE.md', m);
console.log('SEO.md et MAILLAGE.md générés.');
