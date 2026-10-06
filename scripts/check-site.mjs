/**
 * Vérifications post-build (npm run check) :
 *  - un seul H1 par page, hiérarchie sans saut de niveau
 *  - aucun lien interne cassé, aucune page orpheline (≥ 3 liens entrants)
 *  - ≤ 100 liens par page, title 50–60, description 140–155
 *  - sitemap valide, sans pages noindex ; canonical présent
 *  - JSON-LD parsable, sans aggregateRating/review
 *  - images avec alt, width et height
 *  - volumes de mots conformes à la grille
 */
import fs from 'node:fs';
import path from 'node:path';
import { DIST, lirePages, normaliser } from './lib-pages.mjs';

const pages = lirePages();
const urls = new Set(pages.map((p) => p.url));
const erreurs = [];
const avert = [];
const existeFichier = (u) => fs.existsSync(path.join(DIST, u)) || fs.existsSync(path.join(DIST, u, 'index.html'));

const cibles = [
  [/^\/$/, 900, 1200], [/^\/services\/$/, 500, 700], [/^\/services\/.+/, 1000, 1400], [/^\/zone-intervention\/$/, 500, 700],
  [/^\/zone-intervention\/.+/, 600, 900], [/^\/realisations\/$/, 300, 500], [/^\/realisations\/.+/, 300, 500], [/^\/a-propos\/$/, 500, 800],
  [/^\/devis\/$/, 250, 400], [/^\/blog\/.+/, 1200, 1800],
];

const entrants = new Map([...urls].map((u) => [u, new Set()]));
for (const p of pages) {
  if (p.h1.length !== 1) erreurs.push(`${p.url} : ${p.h1.length} H1`);
  let prev = 0;
  for (const h of p.headings) { if (h.niveau > prev + 1 && prev !== 0) erreurs.push(`${p.url} : saut de niveau H${prev} → H${h.niveau} (« ${h.texte.slice(0, 40)} »)`); prev = h.niveau; }
  if (!p.noindex && (p.title.length < 50 || p.title.length > 60)) avert.push(`${p.url} : title ${p.title.length} car.`);
  if (!p.noindex && (p.description.length < 140 || p.description.length > 155)) avert.push(`${p.url} : description ${p.description.length} car.`);
  if (!p.canonical) erreurs.push(`${p.url} : canonical manquant`);
  if (p.liensTous.length > 100) avert.push(`${p.url} : ${p.liensTous.length} liens (> 100)`);
  for (const l of p.liensTous) {
    const u = normaliser(l.href);
    if (!u) continue;
    if (!urls.has(u) && !existeFichier(u)) erreurs.push(`${p.url} : lien cassé → ${l.href}`);
    if (urls.has(u) && u !== p.url && !p.noindex) entrants.get(u).add(p.url);
    if (/^(cliquez ici|en savoir plus|ici|lire la suite)$/i.test(l.ancre)) avert.push(`${p.url} : ancre pauvre « ${l.ancre} »`);
  }
  for (const s of p.jsonLd) {
    try { const j = JSON.parse(s); const txt = JSON.stringify(j); if (/aggregateRating|"review"/.test(txt)) erreurs.push(`${p.url} : aggregateRating/review interdit`); if (!j['@graph']?.length) erreurs.push(`${p.url} : @graph vide`); }
    catch (e) { erreurs.push(`${p.url} : JSON-LD invalide (${e.message})`); }
  }
  for (const img of p.images) {
    if (!/\salt(=|\s|>)/.test(img)) erreurs.push(`${p.url} : image sans alt`); // `alt` nu = alt="" (image décorative)
    if (!/\swidth=/.test(img) || !/\sheight=/.test(img)) erreurs.push(`${p.url} : image sans width/height`);
  }
  const cible = cibles.find(([re]) => re.test(p.url));
  if (cible && !p.noindex && (p.mots < cible[1] || p.mots > cible[2])) avert.push(`${p.url} : ${p.mots} mots (cible ${cible[1]}–${cible[2]})`);
}
for (const [u, src] of entrants) {
  if (u === '/404/' || u === '/devis/merci/') continue;
  if (src.size === 0) erreurs.push(`${u} : page orpheline`);
  else if (src.size < 3) avert.push(`${u} : seulement ${src.size} lien(s) entrant(s)`);
}

// Sitemap
const sitemapIndex = path.join(DIST, 'sitemap-index.xml');
if (!fs.existsSync(sitemapIndex)) erreurs.push('sitemap-index.xml absent');
else {
  const fichiers = [...fs.readFileSync(sitemapIndex, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => path.join(DIST, new URL(m[1]).pathname));
  const locs = fichiers.flatMap((f) => fs.existsSync(f) ? [...fs.readFileSync(f, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname) : (erreurs.push(`sitemap manquant : ${f}`), []));
  for (const p of pages) {
    const dans = locs.includes(p.url);
    if (p.noindex && dans) erreurs.push(`sitemap : page noindex incluse ${p.url}`);
    if (!p.noindex && !dans && p.url !== '/404/') erreurs.push(`sitemap : page manquante ${p.url}`);
  }
  for (const l of locs) if (!urls.has(l)) erreurs.push(`sitemap : URL inconnue ${l}`);
}
if (!fs.existsSync(path.join(DIST, 'robots.txt'))) erreurs.push('robots.txt absent');

console.log(`\n${pages.length} pages vérifiées.`);
if (avert.length) { console.log(`\nAvertissements (${avert.length}) :`); avert.forEach((a) => console.log('  ~', a)); }
if (erreurs.length) { console.log(`\nERREURS (${erreurs.length}) :`); erreurs.forEach((e) => console.log('  ✗', e)); process.exit(1); }
console.log('\n✓ Aucune erreur bloquante.');
