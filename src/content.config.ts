import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const serviceSlugs = [
  'meubles-sur-mesure',
  'reparation-meubles',
  'montage-meubles',
  'renovation-interieure',
  'electricite',
  'plomberie',
] as const;

const photo = z.object({
  src: z.string(), // chemin relatif à /images/realisations/ sans extension
  alt: z.string(),
  width: z.number().default(1200),
  height: z.number().default(800),
});

const realisations = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/realisations' }),
  schema: z.object({
    titre: z.string(),
    titreSeo: z.string().max(60).optional(), // <title> court (50–60 car.) ; sinon dérivé du titre
    service: z.enum(serviceSlugs),
    ville: z.string(), // slug de ville
    date: z.coerce.date(),
    resume: z.string().max(160),
    avant: photo,
    apres: photo,
    /** Description textuelle des deux états (alternative au comparateur) */
    descriptionAvant: z.string(),
    descriptionApres: z.string(),
    brouillon: z.boolean().default(true),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    titre: z.string(),
    titreSeo: z.string().max(60).optional(),
    description: z.string().max(155),
    date: z.coerce.date(),
    miseAJour: z.coerce.date().optional(),
    service: z.enum(serviceSlugs),
    articleConnexe: z.string().optional(), // slug d'un autre article
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    brouillon: z.boolean().default(false),
  }),
});

export const collections = { realisations, blog };
