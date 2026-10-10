# Site vitrine ACS Multiservices

Site statique multi-pages (Astro, `output: 'static'`) pour ACS MULTISERVICES, artisan multiservices à Romainville (93). Objectifs : demandes de devis locales, SEO local, accessibilité technique (navigation clavier, textes alternatifs, contrastes), performance.

## Installation

```bash
npm install
cp .env.example .env   # puis renseigner PUBLIC_SITE_URL et PUBLIC_FORM_WEBHOOK
npm run dev            # http://localhost:4321
```

Prérequis : Node.js 20 ou plus récent.

## Build et vérifications

```bash
npm run build
```

Le build enchaîne automatiquement :

1. `prebuild` → `scripts/images.mjs` : génère les déclinaisons AVIF / WebP / 800 px de chaque JPG de `public/images/`, ainsi que l'image Open Graph et le logo provisoires s'ils manquent.
2. `astro build` → pages HTML dans `dist/`, `sitemap-index.xml` (sans les pages noindex ni les réalisations en brouillon), page 404.
3. `postbuild` → `scripts/check-site.mjs` : un seul H1 par page, hiérarchie Hn, liens internes cassés, pages orphelines, liens entrants ≥ 3, title 50–60 et description 140–155, JSON-LD valide (et sans `aggregateRating`), images avec `alt`/`width`/`height`, sitemap cohérent, volumes de mots. Le build **échoue** en cas d'erreur bloquante.
4. `scripts/generate-docs.mjs` : régénère `SEO.md` et `MAILLAGE.md`.

Commandes séparées : `npm run check`, `npm run docs`, `npm run images`, `npm run preview`.

## Déploiement sur le VPS (acsms.fr)

Le site est hébergé sur le VPS `217.65.144.174` et servi par Nginx depuis `/var/www/acsms.fr/html` (l'ancienne adresse acs.nairox.fr redirige en 301).

- **Installation initiale** : `deploy/vps-setup.sh` (à lancer en root sur le VPS) installe Nginx, Certbot, Node.js, crée l'utilisateur `deploy` et sa clé SSH, clone le dépôt, construit le site, configure Nginx (`deploy/nginx-acs.nairox.fr.conf`), le pare-feu et le certificat HTTPS.
- **Mises à jour** : chaque `git push` sur `main` déclenche `.github/workflows/deploy.yml`, qui construit le site sur GitHub Actions et envoie `dist/` sur le VPS par rsync. Secrets GitHub nécessaires : `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY` (affichée à la fin du script d'installation), et `PUBLIC_FORM_WEBHOOK` (facultatif).
- **Déploiement manuel** depuis le VPS : `cd /opt/acs && git pull && npm ci && PUBLIC_SITE_URL=https://acsms.fr npm run build && rsync -az --delete dist/ /var/www/acsms.fr/html/`.

## Déploiement générique

Le dossier `dist/` est un site statique : il se déploie tel quel sur Netlify, Vercel, Cloudflare Pages, OVH ou tout hébergement de fichiers.

- Commande de build : `npm run build` ; dossier de publication : `dist`.
- Variables d'environnement à définir chez l'hébergeur : `PUBLIC_SITE_URL` (domaine final, avec `https://`), `PUBLIC_FORM_WEBHOOK` (URL du webhook n8n).
- Mettre à jour la ligne `Sitemap:` de `public/robots.txt` avec le domaine final.
- Redirections : le site utilise des URL avec slash final (`/services/plomberie/`). Configurer l'hébergeur pour rediriger `/services/plomberie` → `/services/plomberie/` (301) si nécessaire.
- Page 404 : `dist/404.html` (reconnue automatiquement par Netlify, Cloudflare Pages et Vercel ; sinon la déclarer dans la configuration du serveur).

## Formulaire de devis (n8n)

Le formulaire de `/devis/` envoie un `POST multipart/form-data` vers `PUBLIC_FORM_WEBHOOK` avec les champs : `nom`, `email`, `telephone`, `ville`, `autre_ville`, `service`, `description`, `photos` (0 à 5 fichiers, 10 Mo max), `recontact` (`email` / `appel`), `consentement`, `horodatage`, `duree_remplissage_s`, `page`, et le champ piège `site_web` (doit être vide).

Anti-spam sans CAPTCHA : champ honeypot + délai minimal de 4 s avant envoi (vérifié côté client) ; côté n8n, ignorer les envois où `site_web` n'est pas vide ou `duree_remplissage_s < 4`. Le webhook doit répondre avec un statut 2xx et autoriser CORS depuis le domaine du site.

## Structure du projet

```
src/
  data/entreprise.ts       NAP et informations légales (source unique de vérité, placeholders {{ }})
  data/services.ts         Les 6 services (slug, mots-clés, complémentarités, image, pictogramme)
  data/villes.ts           Villes prioritaires (page dédiée) et secondaires
  lib/seo.ts               Nœuds JSON-LD (LocalBusiness, WebSite, Service, BreadcrumbList, FAQPage)
  layouts/BaseLayout.astro Head SEO, JSON-LD @graph, skip link, header, fil d'Ariane, footer
  layouts/ServicePage.astro  Gabarit page service (réalisations liées, villes, FAQ, services complémentaires, CTA)
  layouts/VillePage.astro    Gabarit page ville
  components/              Header, Footer, ImageSlot, BeforeAfter, Faq, ContactOptions, cartes…
  content/realisations/    Fiches chantier (Markdown + frontmatter)
  content/blog/            Articles de conseils
  pages/                   Une page = une URL
  styles/global.css        Design system (tokens bleu / jaune, contrastes vérifiés)
public/
  fonts/                   Archivo et Source Sans 3 auto-hébergées (woff2)
  images/                  Photos (voir TODO-CLIENT.md pour les noms attendus)
scripts/                   images.mjs, check-site.mjs, generate-docs.mjs, wordcount.mjs
```

Documents : `TODO-CLIENT.md` (informations et photos manquantes), `SEO.md` (récapitulatif par page), `MAILLAGE.md` (liens entrants / sortants).

## Ajouter une réalisation

1. Créer `src/content/realisations/mon-chantier.md` (le nom du fichier devient l'URL `/realisations/mon-chantier/`) :

```markdown
---
titre: "Bibliothèque sur mesure dans un salon à Montreuil"
titreSeo: "Bibliothèque sur mesure à Montreuil | ACS Multiservices"   # facultatif, 50–60 caractères
service: meubles-sur-mesure     # meubles-sur-mesure | reparation-meubles | montage-meubles | renovation-interieure | electricite | plomberie
ville: montreuil                # slug de src/data/villes.ts
date: 2026-10-12
resume: "Une phrase de 120 à 155 caractères (sert de meta description)."
avant:
  src: bibliotheque-montreuil-avant      # → public/images/realisations/bibliotheque-montreuil-avant.jpg
  alt: "Mur du salon vide avec des cartons de livres au sol"
apres:
  src: bibliotheque-montreuil-apres
  alt: "Bibliothèque blanche du sol au plafond autour de la porte"
descriptionAvant: "Description écrite de l’état avant (alternative au comparateur)."
descriptionApres: "Description écrite de l’état après."
brouillon: false                # true = non indexée, exclue du sitemap, bandeau « Exemple »
---
## Contexte
…
## Travaux réalisés
…
## Résultat
…
```

2. Déposer les deux photos (1200×800 JPG) dans `public/images/realisations/`, puis `npm run build` (les déclinaisons AVIF/WebP sont générées).

La fiche apparaît automatiquement dans la galerie, sur la page du service, sur la page de la ville, sur l'accueil (3 dernières) et dans le plan du site.

## Ajouter un article

Créer `src/content/blog/mon-article.md` :

```markdown
---
titre: "Titre complet de l’article"
titreSeo: "Titre court 50–60 caractères | ACS Multiservices"
description: "140 à 155 caractères."
date: 2026-11-03
service: electricite            # service principal lié
articleConnexe: fuite-sous-evier-bons-reflexes   # slug d’un autre article
image: blog-mon-article         # → public/images/blog/blog-mon-article.jpg (1200×630), facultatif
imageAlt: "Description de l’image"
brouillon: false
---
Deux paragraphes d’introduction, puis des titres `##` (H2). Ne pas utiliser `#` (le H1 est généré). Le sommaire cliquable est construit à partir des H2. Lier le service en contexte : [électricien à Romainville](/services/electricite/).
```

Cible : 1 200 à 1 800 mots, 5 à 8 H2, aucun prix chiffré sans validation.

## Ajouter une ville

1. Ajouter l'entrée dans `src/data/villes.ts` avec `page: true` et ses voisines.
2. Créer `src/pages/zone-intervention/ma-ville.astro` sur le modèle de `romainville.astro` (gabarit `VillePage`), avec un contenu réellement local.

Les liens depuis le footer, le hub zone, les pages service et l'accueil se mettent à jour automatiquement.

## Modifier les informations de l'entreprise

Tout le NAP (nom, adresse, téléphone, email, horaires, assurance, médiateur, hébergeur) est dans `src/data/entreprise.ts` et se propage au footer, à la page devis, aux mentions légales et au JSON-LD. Mettre `devisGratuit: true` pour afficher « Devis gratuit » à la place de « Demander un devis ».

## Accessibilité technique : points à conserver

- Le formulaire et l'email restent au même niveau que l'appel (`ContactOptions.astro`).
- Jamais de texte jaune sur fond clair ; utiliser les classes `.btn--jaune` (texte bleu foncé) ou les sections `.section--bleu`.
- Conserver le lien d'évitement, les `aria-label` des `nav`, les `label` de formulaire et les messages d'erreur textuels.

## Publication automatique du blog

Depuis le **10 octobre 2026**, le blog se publie seul : **2 articles par semaine, le mardi et le vendredi matin**.

- **La routine Claude** (rédaction) tourne dans le cloud, clone ce dépôt, prend le premier sujet `pending` de
  `src/data/blog-calendrier.json`, écrit `src/content/blog/<slug>.md`, lance `npm run build` (le check post-build doit
  passer), pousse sur `main`, puis vérifie que `https://acsms.fr/blog/<slug>/` répond. Elle se voit, se met en pause ou
  se modifie ici : **https://claude.ai/code/routines**
- **Le calendrier éditorial** : `src/data/blog-calendrier.json`. Pour imposer un sujet, l'ajouter en tête du tableau
  `sujets` ; pour en interdire un, passer son `status` à `skipped`. Quand il reste moins de 4 sujets, la routine en ajoute.
- **La mise en ligne** : le push sur `main` déclenche le workflow GitHub `deploy.yml` (build + rsync vers le VPS), comme
  pour toute modification. Conséquence : chaque article part en production sans relecture ; pour le relire avant, mettre la
  routine en pause ou passer le sujet en `skipped`.
- **Règles imposées à la routine** : mêmes règles que le site (aucun prix en euros, aucune statistique, aucun label, avis ou
  délai chiffré inventé ; NAP uniquement depuis `src/data/entreprise.ts` ; liens internes uniquement vers des pages
  existantes ; 1 200 à 1 800 mots ; pas de champ `image` tant qu'aucune photo n'est fournie).
