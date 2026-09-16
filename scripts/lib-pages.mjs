// Utilitaires partagés : lecture des pages construites dans dist/
import fs from 'node:fs';
import path from 'node:path';

export const DIST = path.resolve('dist');

const walk = (d, acc = []) => { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); fs.statSync(p).isDirectory() ? walk(p, acc) : f.endsWith('.html') && acc.push(p); } return acc; };

const decode = (s) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ');
const strip = (h) => decode(h.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();

export function lirePages() {
  return walk(DIST).map((fichier) => {
    const html = fs.readFileSync(fichier, 'utf8');
    let url = '/' + path.relative(DIST, fichier).replace(/\\/g, '/').replace(/index\.html$/, '').replace(/\.html$/, '');
    if (url === '/404') url = '/404/';
    const main = html.match(/<main[^>]*>([\s\S]*?)<\/main>/)?.[1] ?? '';
    const texte = main.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ');
    const mots = strip(texte).split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
    const title = decode(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '');
    const description = decode(html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '');
    const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1] ?? '';
    const noindex = /<meta name="robots" content="noindex/.test(html);
    const h1 = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map((m) => strip(m[1]));
    const headings = [...html.matchAll(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/g)].map((m) => ({ niveau: Number(m[1]), texte: strip(m[2]) }));
    const liensTous = [...html.matchAll(/<a\s[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g)].map((m) => ({ href: m[1], ancre: strip(m[2]) }));
    const liensMain = [...main.matchAll(/<a\s[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g)].map((m) => ({ href: m[1], ancre: strip(m[2]) }));
    const jsonLd = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
    const images = [...html.matchAll(/<img\s[^>]*>/g)].map((m) => m[0]);
    return { fichier, url, html, mots, title, description, canonical, noindex, h1, headings, liensTous, liensMain, jsonLd, images };
  }).sort((a, b) => a.url.localeCompare(b.url));
}

export const normaliser = (href) => {
  if (!href || href.startsWith('#') || /^(mailto|tel|sms|https?):/.test(href)) return null;
  let u = href.split('#')[0].split('?')[0];
  if (!u.startsWith('/')) return null;
  if (!u.endsWith('/') && !/\.[a-z0-9]+$/i.test(u)) u += '/';
  return u;
};
