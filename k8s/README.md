# Déploiement Kubernetes du portfolio

Next.js (standalone) sur k3s, Traefik, derrière Cloudflare. Les images sont sur GHCR, le déploiement passe par GitHub Actions.

```
GitHub (staging/main) ──build.yaml──▶ ghcr.io/alexandredfm/alexandredfm:<sha>
                         │
                         └─deploy.yaml──▶ kubectl (compte github-deployer, limité au namespace)
                                              │
Visiteur ─▶ Cloudflare (SSL Full) ─▶ Traefik (IngressRoute, certificat par défaut) ─▶ Service ─▶ Pod web :3000
                                                                                    │
                                                                       Directus my-api (côté serveur)
```

## Fichiers

| Fichier | Rôle | Appliqué par |
| --- | --- | --- |
| `cluster/namespaces.yaml` | Namespaces `alexandredfm-production` et `alexandredfm-staging` | Admin, une fois |
| `cluster/traefik-config.example.yaml` | IP réelle des visiteurs derrière Cloudflare (Traefik k3s). **Partagé avec les autres apps** : à fusionner | Admin, optionnel |
| `rbac/deployer.yaml` | Compte `github-deployer` par namespace : sans suppression, sans exec, sans droits sur le cluster | Admin, une fois |
| `rbac/make-kubeconfig.sh` | Produit le secret `KUBE_CONFIG` de chaque environnement | Admin, une fois |
| `base/` | Deployment `alexandredfm-web` et Service, communs aux deux environnements | Workflow |
| `production/`, `staging/` | Kustomization, IngressRoute (et redirection www en prod) | Workflow |
| `*/secret.example.yaml` | Forme des objets créés par le workflow (exemple, sans valeurs) | — |
| `../.github/workflows/ci.yaml` | Lint, typecheck, tests, build, audit : sur PR et sur `dev` | — |
| `../.github/workflows/build.yaml` | Image `:<sha>` construite sur `staging`, promue (re-tag `latest`) sur `main`, puis appel de `deploy.yaml` | — |
| `../.github/workflows/deploy.yaml` | Workflow réutilisable (appelé par `build.yaml`) : config, secrets, `apply -k`, rollout, tests de fumée | — |
| `../.github/workflows/content-check.yaml` | Chaque matin : images de projets, avatar, fichiers Directus | — |

## Branches et environnements

| Branche | Workflow | Environnement GitHub | Namespace | URL |
| --- | --- | --- | --- | --- |
| `feature/*` → PR | CI | — | — | — |
| `dev` | CI | — | — | — |
| `staging` | CI + build + deploy | `staging` | `alexandredfm-staging` | https://staging.alexandredfm.fr |
| `main` | promotion de l'image + deploy | `production` | `alexandredfm-production` | https://alexandredfm.fr |

Promotion en fast-forward, sans merge commit : voir [../ops/BRANCHES.md](../ops/BRANCHES.md).

## GitHub : Secrets et Variables (par environnement)

**Secrets**

| Nom | staging | production | Contenu |
| --- | --- | --- | --- |
| `KUBE_CONFIG` | requis | requis | `NAMESPACE=alexandredfm-<env> ./k8s/rbac/make-kubeconfig.sh https://<api>:6443` |
| `DIRECTUS_WEBSITE_TOKEN` | requis | requis | Token statique de l'utilisateur Directus « website » (lecture des éléments publiés et de `directus_files` uniquement). En staging, il est créé et envoyé ici par `scripts/refresh-staging.sh` du dépôt my-api |
| `DIRECTUS_CHECK_TOKEN` | — | conseillé | Token en lecture seule pour `content-check.yaml` (peut être le même que ci-dessus) |
| `GHCR_PULL_TOKEN`, `GHCR_PULL_USER` | optionnel | optionnel | Seulement si le paquet GHCR est privé (PAT classique `read:packages`) |

**Variables**

| Nom | staging | production | Exemple |
| --- | --- | --- | --- |
| `PUBLIC_SITE_URL` | requis | requis | `https://staging.alexandredfm.fr` / `https://alexandredfm.fr` |
| `DIRECTUS_URL` | requis | requis | `https://my-api-staging.alexandredfm.fr` / `https://my-api.alexandredfm.fr` (le Directus de staging est une copie de la prod : dépôt my-api, `k8s/README.md`) |
| `SITE_NOINDEX` | `true` | `false` | `true` ajoute `X-Robots-Tag: noindex` sur toutes les pages |
| `GOOGLE_SITE_VERIFICATION` | — | optionnel | Code de la Search Console |
| `IMAGE_PLATFORMS` (variable du dépôt) | | | `linux/amd64` par défaut, `linux/amd64,linux/arm64` pour des nœuds ARM |

## Mise en place (une fois)

> L'ancien déploiement (`alexandredfm-deployment-<env>`, `alexandredfm-service-<env>`, `alexandredfm-ingress-<env>`) continue de tourner jusqu'à l'étape 7.

1. **Namespaces et comptes** (admin du cluster) :
   ```bash
   kubectl apply -f k8s/cluster/namespaces.yaml
   kubectl apply -f k8s/rbac/deployer.yaml
   ```
2. **KUBE_CONFIG** de chaque environnement :
   ```bash
   NAMESPACE=alexandredfm-staging    ./k8s/rbac/make-kubeconfig.sh https://<ip-ou-nom>:6443 | gh secret set KUBE_CONFIG --env staging
   NAMESPACE=alexandredfm-production ./k8s/rbac/make-kubeconfig.sh https://<ip-ou-nom>:6443 | gh secret set KUBE_CONFIG --env production
   ```
   ✔︎ `KUBECONFIG=<(… | base64 --decode) kubectl -n alexandredfm-staging auth can-i create deployments` → `yes`, et `auth can-i delete deployments` → `no`.
3. **TLS et Cloudflare** : pour l'instant, Traefik présente son certificat par défaut (`tls: {}` dans les IngressRoutes), et Cloudflare doit être en SSL **Full** (pas « Full (strict) », qui exige un certificat valide : erreur 526). Désactiver Rocket Loader et Email Address Obfuscation, qui cassent la CSP. Pour passer plus tard au certificat Origin, voir « Certificat Cloudflare Origin (plus tard) » ci-dessous.
4. **DNS** : l'enregistrement `staging` doit être **proxied** (nuage orange). Supprimer `www.staging`.
5. **GitHub** : environnements `staging` (branche autorisée : `staging`) et `production` (branche autorisée : `main`), avec les Secrets et Variables ci-dessus. `../ops/github-setup.sh environments` les crée.
6. **Paquet GHCR** : le rendre public (Package settings → Change visibility), ou définir `GHCR_PULL_TOKEN`.
7. **Premier déploiement, puis retrait de l'ancien.** Pousser sur `staging`, vérifier https://staging.alexandredfm.fr, puis, en admin :
   ```bash
   ns=alexandredfm-staging
   kubectl -n $ns delete ingressroute alexandredfm-ingress-staging
   kubectl -n $ns delete deployment alexandredfm-deployment-staging
   kubectl -n $ns delete service alexandredfm-service-staging
   kubectl -n $ns delete secret alexandredfm-secret-env-staging
   ```
   Même chose pour la production après la promotion vers `main` (`-production`). Les deux IngressRoutes déclarent le même hôte : supprimer l'ancienne **juste après** le premier déploiement réussi.
8. Supprimer les anciens secrets GitHub (`KUBERNETES_URL`, `KUBERNETES_SECRET`, `K8S_SECRETS_YAML_*`) et les anciens environnements (`../ops/github-setup.sh cleanup`).

## Certificat Cloudflare Origin (plus tard)

Avec le mode « Full », Cloudflare chiffre jusqu'au serveur mais ne vérifie pas le certificat. « Full (strict) » avec un certificat Origin ferme cette faille. Le dépôt my-api suit la même démarche, avec le même certificat.

1. Cloudflare → SSL/TLS → Origin Server → Create Certificate, pour `alexandredfm.fr` et `*.alexandredfm.fr` (15 ans par défaut). Garder la clé dans le gestionnaire de mots de passe.
2. Le mettre dans chaque namespace :
   ```bash
   for ns in alexandredfm-production alexandredfm-staging; do
     kubectl -n $ns create secret tls alexandredfm-tls --cert=origin.pem --key=origin-key.pem
   done
   ```
3. Dans `production/ingressroute.yaml` et `staging/ingressroute.yaml`, remplacer `tls: {}` par :
   ```yaml
   tls:
     secretName: alexandredfm-tls
   ```
   Le workflow vérifie alors que ce Secret existe avant de déployer.
4. Déployer (staging, puis prod), puis passer Cloudflare en **Full (strict)**.

## Exploitation

```bash
ns=alexandredfm-production
kubectl -n $ns get pods,svc,ingressroutes
kubectl -n $ns logs -l app.kubernetes.io/component=web -f
kubectl -n $ns rollout history deploy/alexandredfm-web
kubectl -n $ns rollout undo deploy/alexandredfm-web          # revenir à la version précédente
kubectl -n $ns get deploy alexandredfm-web -o jsonpath='{.spec.template.spec.containers[0].image}'   # SHA déployé
```

Redéployer sans changer de code (par exemple après avoir changé une Variable) : Actions → « Build and push the image » → Re-run (ou « Run workflow » sur la branche). L'image existe déjà, l'étape de build est sautée et le déploiement repart. Comme l'image ne change pas, le workflow redémarre le pod pour recharger la config.

## Dépannage

| Symptôme | Cause | Correction |
| --- | --- | --- |
| « Secret KUBE_CONFIG is missing » | Secret absent dans l'environnement GitHub | Étape 2 |
| « Secret alexandredfm-tls is missing » | IngressRoute passée au certificat Origin sans le Secret dans ce namespace | « Certificat Cloudflare Origin (plus tard) », étape 2 |
| `ImagePullBackOff` (401) | Paquet GHCR privé sans `GHCR_PULL_TOKEN` | Étape 6 |
| Erreur 526 Cloudflare | Mode Full (strict) avec le certificat par défaut de Traefik | Repasser en « Full », ou installer le certificat Origin |
| Le site sert l'ancienne version | Ancienne IngressRoute encore présente sur le même hôte | Étape 7 |
| Images de projets en 404 | Fichiers absents du volume Directus | `docs/STORAGE.md` du dépôt my-api |
| `invalid Kustomization … newTag` | Tag non mis entre guillemets (un SHA fait de chiffres est lu comme un nombre) | Le workflow met le tag entre guillemets ; garder le `sed` tel quel |
| Les visiteurs ont tous la même IP (limites par IP) | Traefik voit l'IP de Cloudflare | `cluster/traefik-config.example.yaml` |

## Vérifié sur un k3s local (OrbStack, Traefik)

- Le compte `github-deployer` peut créer et modifier deployments, services, secrets, configmaps, ingressroutes et middlewares. Il ne peut **pas** supprimer, ni faire `exec`, ni créer de namespace, ni agir dans l'autre namespace.
- Les blocs `run` de `deploy.yaml`, exécutés avec ce compte, aboutissent à un rollout réussi : pod non-root, système de fichiers en lecture seule.
- À travers Traefik (avec un certificat Origin factice) : health 200, CSP et HSTS présents, `X-Robots-Tag: noindex` sur staging, `/about` avec `Accept-Language: de` → `/fr/about`, traversée de chemin → 400, `www` → 301 vers l'apex.
- Redéployer le même SHA déclenche bien le `rollout restart`.
