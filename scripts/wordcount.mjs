// Compte les mots du <main> de chaque page HTML de dist/
import fs from 'node:fs';
import path from 'node:path';
const dist = path.resolve('dist');
const pages = [];
const walk = (d) => { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); fs.statSync(p).isDirectory() ? walk(p) : f === 'index.html' && pages.push(p); } };
walk(dist);
for (const p of pages.sort()) {
  const html = fs.readFileSync(p, 'utf8');
  const main = html.match(/<main[^>]*>([\s\S]*?)<\/main>/)?.[1] ?? '';
  const texte = main.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ');
  const mots = texte.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
  console.log(String(mots).padStart(5), p.replace(dist, '').replace('/index.html', '/') );
}
