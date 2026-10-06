export type ServiceSlug =
  | 'meubles-sur-mesure'
  | 'reparation-meubles'
  | 'montage-meubles'
  | 'renovation-interieure'
  | 'electricite'
  | 'plomberie';

export interface Service {
  slug: ServiceSlug;
  /** Nom court (menu, listes) */
  nom: string;
  /** Nom long (H2 hubs, ancres) */
  nomLong: string;
  /** Verbe/expression pour les ancres « {service} à {Ville} » */
  ancreVille: string;
  /** Mot-clé principal SEO */
  motCle: string;
  description: string;
  image: string;
  imageAlt: string;
  /** Services complémentaires (logique métier) */
  complementaires: ServiceSlug[];
  /** Pictogramme SVG (path) décoratif */
  icone: string;
  phare?: boolean;
  /** Type de service pour JSON-LD */
  serviceType: string;
  /** Paire avant/après affichée sur la page service (fichiers /images/avant-apres/{slug}-avant|apres.jpg) */
  avantApres?: AvantApres;
}

export interface AvantApres {
  titre: string;
  altAvant: string;
  altApres: string;
  descriptionAvant: string;
  descriptionApres: string;
  width: number;
  height: number;
}

export const services: Service[] = [
  {
    slug: 'meubles-sur-mesure',
    nom: 'Meubles sur mesure',
    nomLong: 'Création de meubles sur mesure',
    ancreVille: 'Meuble sur mesure',
    motCle: 'meuble sur mesure Seine-Saint-Denis',
    description:
      'Dressing, bibliothèque, placard sous escalier, meuble TV : conception et fabrication à vos dimensions, en atelier puis pose chez vous.',
    image: 'service-meubles-sur-mesure',
    imageAlt: 'Dressing sur mesure installé dans une chambre',
    complementaires: ['reparation-meubles', 'montage-meubles', 'renovation-interieure'],
    icone: 'M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6M9 11h6',
    phare: true,
    serviceType: 'Fabrication de meubles sur mesure',
    avantApres: {
      titre: 'Un meuble TV sur mesure qui occupe tout le mur',
      altAvant: 'Pan de mur vide d’un salon avec parquet clair et deux prises électriques',
      altApres: 'Meuble TV sur mesure blanc et bois sur toute la largeur du mur, étagères rétroéclairées et plantes',
      descriptionAvant: 'Un mur nu entre deux fenêtres, deux prises au ras du sol, aucun rangement.',
      descriptionApres: 'Un ensemble bas à portes blanches, un plan en chêne, des étagères murales éclairées et l’écran intégré au centre.',
      width: 1536,
      height: 1024,
    },
  },
  {
    slug: 'reparation-meubles',
    nom: 'Réparation de meubles',
    nomLong: 'Réparation et restauration de meubles',
    ancreVille: 'Réparation de meubles',
    motCle: 'réparation meuble Romainville',
    description:
      'Charnière cassée, tiroir bloqué, pied desserré, meuble ancien à restaurer : nous réparons plutôt que remplacer.',
    image: 'service-reparation',
    imageAlt: 'Restauration d’une commode en bois',
    complementaires: ['meubles-sur-mesure', 'montage-meubles', 'renovation-interieure'],
    icone: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z',
    serviceType: 'Réparation et restauration de meubles',
    avantApres: {
      titre: 'Un buffet en chêne remis à neuf',
      altAvant: 'Buffet ancien en chêne avec vernis écaillé, portes rayées et poignées ternies',
      altApres: 'Le même buffet restauré, bois poncé et huilé, poignées noires rénovées',
      descriptionAvant: 'Vernis écaillé sur les portes, éclats sur les angles, teinte irrégulière après des années d’usage.',
      descriptionApres: 'Ponçage complet, bouchage des éclats, finition huilée uniforme et poignées remises en état : le meuble retrouve sa place au salon.',
      width: 1536,
      height: 1024,
    },
  },
  {
    slug: 'montage-meubles',
    nom: 'Montage de meubles',
    nomLong: 'Montage de meubles',
    ancreVille: 'Montage de meubles',
    motCle: 'montage meuble Seine-Saint-Denis',
    description:
      'Montage de meubles en kit (IKEA et autres), cuisines, armoires, lits : assemblage propre et fixation murale sécurisée.',
    image: 'service-montage',
    imageAlt: 'Montage d’une armoire dans un appartement',
    complementaires: ['meubles-sur-mesure', 'reparation-meubles', 'renovation-interieure'],
    icone: 'M4 4h16v16H4zM4 12h16M12 4v16',
    serviceType: 'Montage de meubles',
    avantApres: {
      titre: 'Une armoire en kit montée dans une chambre',
      altAvant: 'Panneaux d’armoire en kit posés contre le mur d’une chambre, sachets de vis et notice au sol',
      altApres: 'Armoire blanche à quatre portes montée et fixée au mur, miroir central et tiroirs',
      descriptionAvant: 'Des panneaux appuyés au mur, les sachets de quincaillerie et la notice étalés sur le tapis.',
      descriptionApres: 'L’armoire assemblée, portes réglées, miroir posé, fixée au mur pour éviter tout basculement.',
      width: 1536,
      height: 1024,
    },
  },
  {
    slug: 'renovation-interieure',
    nom: 'Rénovation intérieure',
    nomLong: 'Rénovation intérieure',
    ancreVille: 'Rénovation intérieure',
    motCle: 'rénovation appartement 93',
    description:
      'Peinture, pose de parquet, rafraîchissement complet d’une pièce ou d’un logement : un seul interlocuteur du début à la fin.',
    image: 'service-renovation',
    imageAlt: 'Pièce en cours de rénovation',
    complementaires: ['electricite', 'plomberie', 'montage-meubles'],
    icone: 'M2 22l4-4M6 18l10-10 4 4-10 10zM14 6l4 4M17 3l4 4',
    serviceType: 'Rénovation intérieure',
    avantApres: {
      titre: 'Un séjour rénové du sol au plafond',
      altAvant: 'Pièce en chantier avec murs décroûtés, plafond ouvert, escabeau et plaques de plâtre',
      altApres: 'Séjour rénové avec mur vert sauge, plafond lisse, spots encastrés et parquet neuf',
      descriptionAvant: 'Enduits arrachés, saignées ouvertes, plaques de plâtre en attente et plafond à reprendre.',
      descriptionApres: 'Murs lissés et peints, plafond neuf avec spots, parquet posé, plinthes et portes repeintes.',
      width: 1536,
      height: 1024,
    },
  },
  {
    slug: 'electricite',
    nom: 'Électricité',
    nomLong: 'Électricité',
    ancreVille: 'Électricien',
    motCle: 'électricien Romainville',
    description:
      'Mise aux normes, remplacement de tableau électrique, ajout de prises et d’éclairages, dépannage : travaux conformes à la norme NF C 15-100.',
    image: 'service-electricite',
    imageAlt: 'Installation d’un tableau électrique',
    complementaires: ['renovation-interieure', 'plomberie'],
    icone: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
    serviceType: 'Travaux d’électricité',
    avantApres: {
      titre: 'Une installation électrique remise aux normes',
      altAvant: 'Mur en chantier avec anciens câbles apparents et vieux tableau électrique',
      altApres: 'Même mur avec gaines neuves alignées, boîtiers d’encastrement et tableau électrique neuf',
      descriptionAvant: 'Câbles anciens qui pendent, boîtiers hors d’usage, tableau vétuste sans protection différentielle.',
      descriptionApres: 'Gaines neuves tirées dans des saignées rectilignes, boîtiers d’encastrement posés, tableau remplacé conformément à la NF C 15-100.',
      width: 1448,
      height: 1086,
    },
  },
  {
    slug: 'plomberie',
    nom: 'Plomberie',
    nomLong: 'Plomberie',
    ancreVille: 'Plombier',
    motCle: 'plombier Romainville',
    description:
      'Fuite d’eau, robinet à remplacer, WC qui fuit, chauffe-eau, débouchage : intervention de plomberie rapide et propre.',
    image: 'service-plomberie',
    imageAlt: 'Remplacement d’un robinet de cuisine',
    complementaires: ['renovation-interieure', 'electricite'],
    icone: 'M12 2.7c-3 4-6 7.3-6 11a6 6 0 0 0 12 0c0-3.7-3-7-6-11z',
    serviceType: 'Travaux de plomberie',
    avantApres: {
      titre: 'Un dessous d’évier remis en ordre',
      altAvant: 'Dessous d’évier avant intervention',
      altApres: 'Dessous d’évier de cuisine avec siphon et évacuations neuves, arrivées d’eau repérées',
      descriptionAvant: 'Photo du dessous d’évier avant intervention à fournir.',
      descriptionApres: 'Évacuations neuves en PVC blanc, siphon remplacé, raccords eau chaude et eau froide repérés en rouge et bleu.',
      width: 1448,
      height: 1086,
    },
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);
export const serviceUrl = (slug: string) => `/services/${slug}/`;
