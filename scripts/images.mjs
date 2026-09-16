/**
 * Génère les déclinaisons d'images pour ImageSlot :
 *   /public/images/**\/{nom}.jpg  →  {nom}.avif, {nom}.webp, {nom}-800.jpg
 * Génère aussi og-default.jpg, le logo PNG et l'apple-touch-icon à partir de SVG
 * si les fichiers n'existent pas encore (placeholders remplaçables).
 * Usage : npm run images
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const racine = path.resolve('public/images');
fs.mkdirSync(racine, { recursive: true });

const svgOg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#0F3D6E"/>
  <rect x="0" y="600" width="1200" height="30" fill="#F5B800"/>
  <rect x="80" y="180" width="180" height="90" rx="10" fill="#F5B800"/>
  <text x="170" y="245" font-family="Arial, Helvetica, sans-serif" font-weight="800" font-size="60" text-anchor="middle" fill="#0A2A4D">ACS</text>
  <text x="290" y="245" font-family="Arial, Helvetica, sans-serif" font-weight="800" font-size="60" fill="#FFFFFF">Multiservices</text>
  <text x="80" y="340" font-family="Arial, Helvetica, sans-serif" font-size="34" fill="#FFFFFF">Meubles sur mesure · Réparation · Montage</text>
  <text x="80" y="390" font-family="Arial, Helvetica, sans-serif" font-size="34" fill="#FFFFFF">Rénovation · Électricité · Plomberie</text>
  <text x="80" y="480" font-family="Arial, Helvetica, sans-serif" font-size="30" fill="#F5B800">Artisan à Romainville · Seine-Saint-Denis · Est parisien</text>
</svg>`;
const svgLogo = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512">
  <rect width="512" height="512" rx="80" fill="#0F3D6E"/>
  <rect x="64" y="150" width="384" height="212" rx="28" fill="#F5B800"/>
  <text x="256" y="310" font-family="Arial, Helvetica, sans-serif" font-weight="800" font-size="150" text-anchor="middle" fill="#0A2A4D">ACS</text>
</svg>`;

const generer = async (svg, sortie, opts = {}) => {
  if (fs.existsSync(sortie)) return;
  const img = sharp(Buffer.from(svg));
  if (opts.resize) img.resize(opts.resize, opts.resize);
  await (sortie.endsWith('.png') ? img.png() : img.jpeg({ quality: 88 })).toFile(sortie);
  console.log('généré', path.relative(process.cwd(), sortie));
};
await generer(svgOg, path.join(racine, 'og-default.jpg'));
await generer(svgLogo, path.join(racine, 'logo-acs-multiservices.png'));
await generer(svgLogo, path.resolve('public/apple-touch-icon.png'), { resize: 180 });

const walk = (d) => fs.readdirSync(d).flatMap((f) => { const p = path.join(d, f); return fs.statSync(p).isDirectory() ? walk(p) : [p]; });
for (const fichier of walk(racine)) {
  if (!/\.(jpe?g|png)$/i.test(fichier) || /-800\.(jpe?g|png)$/i.test(fichier) || /og-default|logo-/.test(fichier)) continue;
  const base = fichier.replace(/\.(jpe?g|png)$/i, '');
  const ext = path.extname(fichier).slice(1);
  const meta = await sharp(fichier).metadata();
  const taches = [];
  const srcTime = fs.statSync(fichier).mtimeMs;
  const perime = (f) => !fs.existsSync(f) || fs.statSync(f).mtimeMs < srcTime;
  if (perime(`${base}.avif`)) taches.push(sharp(fichier).avif({ quality: 55 }).toFile(`${base}.avif`));
  if (perime(`${base}.webp`)) taches.push(sharp(fichier).webp({ quality: 78 }).toFile(`${base}.webp`));
  if (perime(`${base}-800.${ext}`) && (meta.width ?? 0) > 800) taches.push(sharp(fichier).resize(800).toFile(`${base}-800.${ext}`));
  if (taches.length) { await Promise.all(taches); console.log('déclinaisons', path.relative(process.cwd(), fichier)); }
}
console.log('Images : terminé.');
