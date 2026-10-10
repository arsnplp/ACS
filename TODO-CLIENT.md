# TODO client — informations et photos à fournir

Tout ce qui apparaît entre `{{ }}` sur le site est un **placeholder visible** qui attend une vraie valeur. Rien n'a été inventé : ni années d'expérience, ni avis, ni tarifs, ni labels. Une fois les informations reçues, elles se remplacent en un seul endroit (voir la colonne « Où »).

## 1. Informations légales et de contact (bloquant avant mise en ligne)

| Information | Placeholder actuel | Où la renseigner |
|---|---|---|
| Numéro de rue du siège (avenue Youri Gagarine) | `{{NUMÉRO}}` | `src/data/entreprise.ts` → `adresse.numero` |
| Téléphone (affiché) et version internationale pour le lien `tel:` | `{{TÉLÉPHONE}}` / `telephoneHref` vide | `entreprise.telephone`, `entreprise.telephoneHref` (ex. `+33612345678`) |
| Horaires | `{{HORAIRES}}` | `entreprise.horaires` (format lisible, ex. « Lundi–vendredi 8h–19h, samedi 9h–13h ») |
| Email définitif (contact@domaine) — actuellement rosco-75@hotmail.com | — | `entreprise.email` |
| Délai de réponse annoncé | `{{DÉLAI DE RÉPONSE}}` | `entreprise.delaiReponse` (ex. « 48 h ouvrées ») |
| Devis gratuit : oui / non | `devisGratuit: null` | `entreprise.devisGratuit` → `true` change le bouton en « Devis gratuit » |
| Assureur, n° de police, zone couverte (obligatoire artisan) | `{{ASSUREUR}}` `{{N° POLICE}}` `{{ZONE COUVERTE}}` | `entreprise.assurance` |
| Médiateur de la consommation (obligatoire B2C) : nom + coordonnées | `{{MÉDIATEUR — …}}` | `entreprise.mediateur` |
| Hébergeur : nom, adresse, téléphone | `{{HÉBERGEUR — …}}` | `entreprise.hebergeur` |
| N° TVA intracommunautaire (calculé FR05100730068, à confirmer) | — | `entreprise.tva` |
| Fourchette de prix (facultatif, pour le JSON-LD `priceRange`, ex. « €€ ») | `{{FOURCHETTE DE PRIX}}` | `src/lib/seo.ts` |
| URL fiche Google Business Profile, réseaux sociaux | `{{URL FICHE GOOGLE…}}` | `entreprise.sameAs` |
| Coordonnées GPS exactes de l'atelier | approximatives (centre de Romainville) | `entreprise.geo` |
| Nom de domaine définitif | `https://acsms.fr` (fait le 10/10/2026) | `.env` → `PUBLIC_SITE_URL` + `public/robots.txt` (ligne Sitemap) |
| URL du webhook n8n | — | `.env` → `PUBLIC_FORM_WEBHOOK` |

## 2. Pages légales

| Information | Placeholder | Où |
|---|---|---|
| Date de mise à jour de la politique de confidentialité | `{{DATE DE MISE À JOUR}}` | `src/pages/politique-confidentialite.astro` |
| Hébergeur de l'instance n8n (destinataire des données) | `{{HÉBERGEUR N8N}}` | `src/pages/politique-confidentialite.astro` |
| Outil de mesure d'audience choisi (Plausible / Umami / aucun) | `{{OUTIL D’AUDIENCE…}}` | `src/pages/politique-confidentialite.astro` + script à ajouter dans `src/layouts/BaseLayout.astro` |
| Crédits conception et photos | `{{CRÉDIT CONCEPTION}}` `{{CRÉDIT PHOTOS}}` | `src/pages/mentions-legales.astro` |
| Logo définitif (PNG/SVG) | logotype texte provisoire, `logo-acs-multiservices.png` généré | `src/components/Logo.astro`, `public/images/logo-acs-multiservices.png`, `public/favicon.svg` |

## 3. Photos à fournir

Déposer les JPG dans `public/images/` (ou `public/images/realisations/`, `public/images/blog/`) avec **exactement** ces noms. Lancer ensuite `npm run images` : les versions AVIF, WebP et 800 px sont générées automatiquement. Tant qu'une photo manque, un cadre en pointillés l'indique sur la page avec le nom attendu.

| Fichier | Page | Dimensions | Alt suggéré |
|---|---|---|---|
| `hero-accueil.jpg` | Accueil | 1672×941 | Fournie (fond sans texte ; le titre, les pastilles et l'accroche sont en HTML). Source : `image/header.png` |
| `intro-accueil.jpg` | Accueil (section sous la bannière) | 1024×647 | Fournie. Source : `image/section1.jpg` |
| `hero-devis.jpg` | Devis (bannière en haut) | 1983×793 | Fournie. Source : `image/demandeDevis.png` |
| `hero-blog.jpg` | Blog (bannière en haut) | 2048×768 | Fournie. Source : `image/headerblog.png` |
| `romainville-a-propos.jpg` | À propos (en haut, à droite du texte) | 1000×750 | Fournie (vue aérienne de Romainville). Source : `image/romainville.jpg` |
| `carte-zone-intervention.jpg` | Zone d’intervention (carte) | 1536×1024 | Fournie. Source : `image/cartezoneinter.png` |
| `personnage-zone.png` | Zone d’intervention (en haut, à droite du texte) | 1312×1199 (PNG transparent) | Fournie. Source : `image/personage pour zone inter.png` |
| `hero-realisations.jpg` | Réalisations (bannière en haut) | 2048×768 | Fournie. Source : `image/header realisation.png` |
| `hero-{slug}.jpg` (6 fichiers : meubles-sur-mesure, reparation-meubles, montage-meubles, renovation-interieure, electricite, plomberie) | Pages services (bannière en haut) | 2048×768 | Fournies. Sources : `image/*.png` |
| `service-meubles-sur-mesure.jpg` | Hub services (vignette) | 1200×800 | Dressing sur mesure installé dans une chambre |
| `service-reparation.jpg` | Hub services (vignette) | 1200×800 | Restauration d’une commode en bois |
| `service-montage.jpg` | Hub services (vignette) | 1200×800 | Montage d’une armoire dans un appartement |
| `service-renovation.jpg` | Hub services (vignette) | 1200×800 | Pièce en cours de rénovation |
| `service-electricite.jpg` | Hub services (vignette) | 1200×800 | Installation d’un tableau électrique |
| `service-plomberie.jpg` | Hub services (vignette) | 1200×800 | Remplacement d’un robinet de cuisine |
| `portrait-seydou.jpg` | À propos (section « Où nous trouver ») | 800×1000 | Portrait de Seydou Traoré, fondateur d’ACS Multiservices |
| `og-default.jpg` | Partage réseaux | 1200×630 | — (version provisoire générée, à remplacer par une vraie photo avec le logo) |
| `blog/blog-meuble-sur-mesure-prix.jpg` | Article prix meuble | 1200×630 | Plan coté d’une bibliothèque sur mesure sur un établi |
| `blog/blog-reparer-ou-remplacer.jpg` | Article réparer/remplacer | 1200×630 | Meuble en cours de réparation |
| `blog/blog-fuite-sous-evier.jpg` | Article fuite | 1200×630 | Siphon et flexibles sous un évier |

### Réalisations (6 fiches exemples à remplacer)

Les 6 fiches dans `src/content/realisations/` sont **fictives** (`brouillon: true`, non indexées, exclues du sitemap, bandeau « Exemple »). Pour chaque vrai chantier : remplacer le texte, passer `brouillon: false`, et fournir 2 photos 1200×800 dans `public/images/realisations/` :

| Fiche exemple | Photos attendues |
|---|---|
| dressing-sur-mesure-romainville | `dressing-romainville-avant.jpg`, `dressing-romainville-apres.jpg` |
| restauration-commode-ancienne-montreuil | `commode-montreuil-avant.jpg`, `commode-montreuil-apres.jpg` |
| montage-cuisine-kit-pantin | `cuisine-pantin-avant.jpg`, `cuisine-pantin-apres.jpg` |
| renovation-studio-bagnolet | `studio-bagnolet-avant.jpg`, `studio-bagnolet-apres.jpg` |
| remplacement-tableau-electrique-les-lilas | `tableau-les-lilas-avant.jpg`, `tableau-les-lilas-apres.jpg` |
| remplacement-mitigeur-fuite-noisy-le-sec | `mitigeur-noisy-le-sec-avant.jpg`, `mitigeur-noisy-le-sec-apres.jpg` |

## 4. À valider avec le client

- Zone d'intervention exacte (villes prioritaires et secondaires dans `src/data/villes.ts`).
- Le nom de domaine, puis création de la fiche Google Business Profile avec **le même NAP** (nom, adresse, téléphone) que le site.
- Relecture des textes des pages service et ville (contenus rédigés sans chiffres inventés, mais à confirmer sur les pratiques réelles : visite à domicile, fabrication en modules, etc.).
