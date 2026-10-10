import { entreprise, adresseLigne, estPlaceholder, ou } from '@/data/entreprise';
import { villes } from '@/data/villes';

export const SITE_URL = (import.meta.env.SITE || 'https://acsms.fr').replace(/\/$/, '');
export const abs = (path: string) => `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
export const ORG_ID = `${SITE_URL}/#organisation`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

const telephone = entreprise.telephoneHref || (estPlaceholder(entreprise.telephone) ? undefined : entreprise.telephone);

/** Nœud LocalBusiness commun à toutes les pages (NAP identique partout). */
export const organisationNode = () => ({
  '@type': ['HomeAndConstructionBusiness', 'LocalBusiness'],
  '@id': ORG_ID,
  additionalType: ['https://schema.org/Electrician', 'https://schema.org/Plumber'],
  name: entreprise.nomCommercial,
  legalName: entreprise.denominationSociale,
  url: `${SITE_URL}/`,
  logo: abs('/images/logo-acs-multiservices.png'),
  image: abs('/images/og-default.jpg'),
  ...(telephone ? { telephone } : {}),
  email: entreprise.email,
  founder: { '@type': 'Person', name: entreprise.president },
  foundingDate: entreprise.dateCreation,
  vatID: entreprise.tva,
  taxID: entreprise.sirenCompact,
  address: {
    '@type': 'PostalAddress',
    streetAddress: `${ou(entreprise.adresse.numero)} ${entreprise.adresse.rue}`.trim(),
    postalCode: entreprise.adresse.codePostal,
    addressLocality: entreprise.adresse.ville,
    addressRegion: entreprise.adresse.region,
    addressCountry: entreprise.adresse.pays,
  },
  geo: { '@type': 'GeoCoordinates', latitude: entreprise.geo.latitude, longitude: entreprise.geo.longitude },
  ...(estPlaceholder(entreprise.horaires) ? {} : { openingHours: entreprise.horaires }),
  areaServed: villes.map((v) => ({ '@type': 'City', name: v.nom, postalCode: v.codePostal })),
  ...(entreprise.sameAs.some((u) => !estPlaceholder(u)) ? { sameAs: entreprise.sameAs.filter((u) => !estPlaceholder(u)) } : {}),
});

export const websiteNode = () => ({
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: `${SITE_URL}/`,
  name: entreprise.nomCommercial,
  inLanguage: 'fr-FR',
  publisher: { '@id': ORG_ID },
});

export interface Crumb { nom: string; url: string }

export const breadcrumbNode = (items: Crumb[]) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: c.nom,
    item: abs(c.url),
  })),
});

export interface FaqItem { question: string; reponse: string }

export const faqNode = (items: FaqItem[]) => ({
  '@type': 'FAQPage',
  mainEntity: items.map((f) => ({
    '@type': 'Question',
    name: f.question,
    acceptedAnswer: { '@type': 'Answer', text: f.reponse },
  })),
});

export const serviceNode = (opts: { nom: string; serviceType: string; url: string; description: string; areaServed?: string[] }) => ({
  '@type': 'Service',
  '@id': `${abs(opts.url)}#service`,
  name: opts.nom,
  serviceType: opts.serviceType,
  description: opts.description,
  url: abs(opts.url),
  provider: { '@id': ORG_ID },
  areaServed: (opts.areaServed ?? villes.map((v) => v.nom)).map((n) => ({ '@type': 'City', name: n })),
});

export { adresseLigne };
