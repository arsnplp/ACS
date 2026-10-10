/**
 * SOURCE UNIQUE DE VÉRITÉ pour le NAP (Nom, Adresse, Téléphone).
 * Toute donnée entre {{ }} doit être complétée par le client (voir TODO-CLIENT.md).
 * Ne jamais inventer une valeur : laisser le placeholder visible.
 */
export const entreprise = {
  nomCommercial: 'ACS Multiservices',
  denominationSociale: 'ACS MULTISERVICES',
  formeJuridique: 'SAS au capital de 100 €',
  president: 'Seydou Traoré',
  siren: '100 730 068',
  sirenCompact: '100730068',
  tva: 'FR05100730068', // calculé depuis le SIREN — à confirmer avec le client
  immatriculation: 'Registre national des entreprises (RNE), activité artisanale',
  naf: '95.24Z — Réparation de meubles et d’équipements du foyer',
  dateCreation: '2026-03-25',
  dateCreationTexte: '25 mars 2026',
  adresse: {
    numero: '{{NUMÉRO}}',
    rue: 'avenue Youri Gagarine',
    codePostal: '93230',
    ville: 'Romainville',
    departement: 'Seine-Saint-Denis',
    region: 'Île-de-France',
    pays: 'FR',
  },
  email: 'rosco-75@hotmail.com', // provisoire — prévoir contact@{{domaine}}
  telephone: '{{TÉLÉPHONE}}',
  telephoneHref: '', // ex. "+33612345678" — vide tant que non fourni
  horaires: '{{HORAIRES}}',
  assurance: {
    assureur: '{{ASSUREUR}}',
    police: '{{N° POLICE}}',
    zone: '{{ZONE COUVERTE}}',
  },
  mediateur: {
    nom: '{{MÉDIATEUR — NOM}}',
    coordonnees: '{{MÉDIATEUR — ADRESSE / SITE}}',
  },
  hebergeur: {
    nom: '{{HÉBERGEUR — NOM}}',
    adresse: '{{HÉBERGEUR — ADRESSE}}',
    telephone: '{{HÉBERGEUR — TÉLÉPHONE}}',
  },
  delaiReponse: '{{DÉLAI DE RÉPONSE}}',
  devisGratuit: null as boolean | null, // null = non confirmé → libellé « Demander un devis »
  sameAs: [
    '{{URL FICHE GOOGLE BUSINESS PROFILE}}',
    '{{URL PAGE FACEBOOK / INSTAGRAM}}',
  ],
  geo: { latitude: 48.884, longitude: 2.435 }, // centre de Romainville — à affiner avec l'adresse exacte
};
/** Valeur si renseignée, sinon chaîne vide (les placeholders ne sont jamais affichés au public). */
/** Vrai si une valeur est un placeholder non complété. */
export const estPlaceholder = (v: string) => /\{\{.*\}\}/.test(v);
/** Valeur si renseignée, sinon chaîne vide (les placeholders ne sont jamais affichés au public). */
export const ou = (v: string, defaut = '') => (estPlaceholder(v) ? defaut : v);
/** Adresse postale sans le numéro tant qu'il n'est pas fourni. */
export const adresseLigne = `${ou(entreprise.adresse.numero)} ${entreprise.adresse.rue}, ${entreprise.adresse.codePostal} ${entreprise.adresse.ville}`.trim();
/** Délai de réponse en toutes lettres (« sous 48 h » ou « rapidement »). */
export const delaiTexte = estPlaceholder(entreprise.delaiReponse) ? 'rapidement' : `sous ${entreprise.delaiReponse}`;

/** Libellé du bouton principal : « Devis gratuit » uniquement si confirmé. */
export const libelleDevis = entreprise.devisGratuit ? 'Devis gratuit' : 'Demander un devis';
