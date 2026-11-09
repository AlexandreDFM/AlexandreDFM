# AlexandreDFM — portfolio

Next.js 15 (App Router, standalone output), HeroUI, Tailwind CSS 4, en français et en anglais. Le contenu (projets, blog, galerie) vient de Directus (dépôt `my-api`), interrogé **uniquement côté serveur**.

## Démarrage

Prérequis : Node 22 et pnpm (la version est fixée par `packageManager`, `corepack enable` suffit).

```bash
cd portfolio
corepack enable
pnpm install
cp env/.env.frontend.template .env.local      # puis renseigner DIRECTUS_URL et DIRECTUS_WEBSITE_TOKEN
pnpm dev                                      # http://localhost:3000
```

### Avec Docker (Directus, Postgres et Redis en local)

```bash
cd portfolio
for f in database directus frontend; do cp env/.env.$f.template env/.env.$f; done
# renseigner les valeurs, puis :
docker compose up -d
```

| Service | URL |
| --- | --- |
| Frontend (hot reload) | http://localhost:3000 |
| Directus | http://localhost:8055 |

Les fichiers uploadés dans le Directus local sont dans `backend/uploads/`.

## Scripts

| Commande | Rôle |
| --- | --- |
| `pnpm dev` | Serveur de développement |
| `pnpm build` / `pnpm start` | Build de production / serveur |
| `pnpm lint` | ESLint (flat config) |
| `pnpm typecheck` | TypeScript |
| `pnpm test` | Tests (Vitest) : négociation de la langue, proxy d'assets Directus |
| `pnpm check` | Les trois précédents |
| `pnpm format` | Prettier |

## Configuration (lue au démarrage du serveur)

| Variable | Exemple | Rôle |
| --- | --- | --- |
| `SITE_URL` | `https://alexandredfm.fr` | URL publique (canonical, sitemap, Open Graph) |
| `SITE_NOINDEX` | `true` sur staging | `noindex` sur toutes les pages, `robots.txt` fermé |
| `DIRECTUS_URL` | `https://my-api.alexandredfm.fr` | API Directus |
| `DIRECTUS_WEBSITE_TOKEN` | secret | Token de l'utilisateur Directus « website », en lecture seule |
| `GOOGLE_SITE_VERIFICATION` | optionnel | Balise de la Search Console |

Aucune variable `NEXT_PUBLIC_*` : la même image Docker sert en staging et en production.

## Structure

| Dossier | Contenu |
| --- | --- |
| `app/[locale]/` | Pages (fr, en) et admin (`/admin`, connexion avec un compte Directus qui a accès à l'app) |
| `app/api/` | Routes serveur : lecture et écriture Directus, proxy des images (`util/directus-asset.ts`) |
| `middleware.ts` | Redirection de langue, rafraîchissement de la session admin, `noindex` |
| `util/` | Config, client Directus, i18n, métadonnées SEO, nettoyage HTML |
| `components/` | Composants d'interface |
| `styles/globals.css` | Thème (variables clair/sombre, jeton `muted`), animations |

## Déploiement

Kubernetes (k3s) via GitHub Actions, avec les branches `dev` → `staging` → `main` :
- [../k8s/README.md](../k8s/README.md) : mise en place, Secrets et Variables, exploitation ;
- [../ops/BRANCHES.md](../ops/BRANCHES.md) : flux des branches et promotion.
