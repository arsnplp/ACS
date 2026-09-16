export interface Ville {
  slug: string;
  nom: string;
  codePostal: string;
  /** Villes voisines (slugs) pour le maillage */
  voisines: string[];
  /** Ville prioritaire (page dédiée) ou secondaire (mention uniquement) */
  page: boolean;
  /** Complément « à Montreuil », « aux Lilas », « au Pré-Saint-Gervais » */
  prep: string;
}

export const villes: Ville[] = [
  { slug: 'romainville', nom: 'Romainville', codePostal: '93230', voisines: ['montreuil', 'noisy-le-sec', 'les-lilas'], page: true, prep: 'à Romainville' },
  { slug: 'montreuil', nom: 'Montreuil', codePostal: '93100', voisines: ['bagnolet', 'romainville', 'noisy-le-sec'], page: true, prep: 'à Montreuil' },
  { slug: 'bagnolet', nom: 'Bagnolet', codePostal: '93170', voisines: ['montreuil', 'les-lilas', 'romainville'], page: true, prep: 'à Bagnolet' },
  { slug: 'les-lilas', nom: 'Les Lilas', codePostal: '93260', voisines: ['romainville', 'bagnolet', 'pantin'], page: true, prep: 'aux Lilas' },
  { slug: 'noisy-le-sec', nom: 'Noisy-le-Sec', codePostal: '93130', voisines: ['romainville', 'montreuil', 'pantin'], page: true, prep: 'à Noisy-le-Sec' },
  { slug: 'pantin', nom: 'Pantin', codePostal: '93500', voisines: ['les-lilas', 'romainville', 'noisy-le-sec'], page: true, prep: 'à Pantin' },
  // Villes secondaires (sans page dédiée pour l'instant)
  { slug: 'bobigny', nom: 'Bobigny', codePostal: '93000', voisines: [], page: false, prep: 'à Bobigny' },
  { slug: 'bondy', nom: 'Bondy', codePostal: '93140', voisines: [], page: false, prep: 'à Bondy' },
  { slug: 'rosny-sous-bois', nom: 'Rosny-sous-Bois', codePostal: '93110', voisines: [], page: false, prep: 'à Rosny-sous-Bois' },
  { slug: 'le-pre-saint-gervais', nom: 'Le Pré-Saint-Gervais', codePostal: '93310', voisines: [], page: false, prep: 'au Pré-Saint-Gervais' },
  { slug: 'paris-19', nom: 'Paris 19e', codePostal: '75019', voisines: [], page: false, prep: 'dans le 19e arrondissement de Paris' },
  { slug: 'paris-20', nom: 'Paris 20e', codePostal: '75020', voisines: [], page: false, prep: 'dans le 20e arrondissement de Paris' },
];

export const villesPrioritaires = villes.filter((v) => v.page);
export const villesSecondaires = villes.filter((v) => !v.page);
export const getVille = (slug: string) => villes.find((v) => v.slug === slug);
export const villeUrl = (slug: string) => `/zone-intervention/${slug}/`;
