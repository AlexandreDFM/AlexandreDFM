# Branches : dev → staging → main

```
feature/xxx ──PR (squash)──▶ dev ──fast-forward──▶ staging ──fast-forward──▶ main
                              │                       │                        │
                          CI seulement          CI + image :<sha>        même image re-taguée
                                                + déploiement staging    + déploiement production
```

| Branche | Rôle | Déploie | Comment on y écrit |
| --- | --- | --- | --- |
| `feature/*`, `fix/*` | Une modification | Non | Commits libres |
| `dev` | Intégration | Non (CI seulement) | PR en *squash* depuis une branche feature |
| `staging` | Test sur https://staging.alexandredfm.fr | Oui (`staging`) | **Fast-forward depuis `dev`, jamais de commit direct** |
| `main` | Production https://alexandredfm.fr (et README du profil GitHub, c'est la branche par défaut) | Oui (`production`) | **Fast-forward depuis `staging`, jamais de commit direct** |

## Au quotidien

```bash
git switch dev && git pull
git switch -c feature/ma-modif
# ... commits ...
git push -u origin feature/ma-modif
gh pr create --base dev --fill          # CI, puis "Squash and merge"
```

## Promouvoir

```bash
git fetch origin
git push origin origin/dev:staging      # vers le test : build de l'image + déploiement staging
# vérifier https://staging.alexandredfm.fr
git push origin origin/staging:main     # vers la prod : même image, déploiement production
```

Si un push est refusé (`non-fast-forward`), c'est qu'un commit a été fait directement sur la branche cible. Il faut le rapatrier dans `dev`, au lieu de fusionner dans le mauvais sens.

## Hotfix

```bash
git switch -c hotfix/xxx origin/main
# ... correctif ...
gh pr create --base main --fill         # CI, puis "Squash and merge" : build + déploiement production
git fetch origin
git push origin origin/main:staging     # report en fast-forward
git push origin origin/main:dev
```

## État des branches

```bash
git fetch origin
git rev-parse origin/dev origin/staging origin/main     # même SHA = tout est promu
git log --oneline origin/staging..origin/dev            # ce qui attend d'aller en staging
git log --oneline origin/main..origin/staging           # ce qui attend d'aller en prod
```

## Mise en place (une fois)

`ops/github-setup.sh <étape>` affiche les commandes, et `--apply` les exécute.

1. `pages` : désactive GitHub Pages (son build échouait à chaque push). Déjà fait.
2. `environments` : crée `staging` et `production` avec leur politique de branche. Ajouter ensuite les Secrets et Variables (k8s/README.md), **avant** l'étape suivante, sinon le premier déploiement échoue.
3. `resync`, depuis la branche qui contient tout (elle contient déjà `origin/main`, `origin/staging` et `origin/dev`) : avance `dev` puis `staging` en fast-forward, ce qui déploie staging. Une fois https://staging.alexandredfm.fr vérifié : `git push origin origin/staging:main`. Ne pas pousser `main` en premier : ses anciens workflows redéploieraient l'ancien code.
4. Supprimer les anciennes ressources Kubernetes (k8s/README.md, étape 7).
5. `branches` : archive `pages` dans le tag `archive/pages-2024`, supprime `pages` et l'ancienne branche de PR déjà fusionnée.
6. `rulesets` : protège `main`, `staging` et `dev`.
7. `cleanup` : supprime les anciens environnements (y compris `copilot`) et secrets, une fois les deux environnements déployés avec succès.
