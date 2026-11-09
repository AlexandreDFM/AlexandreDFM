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

`ops/github-setup.sh <étape>` affiche les commandes, et `--apply` les exécute. Ordre recommandé : **après** avoir créé les Secrets et Variables (k8s/README.md), sinon le premier déploiement échoue.

1. `resync` : aligne les trois branches (déclenche staging et production).
2. `pages` : désactive GitHub Pages (son build échoue à chaque push).
3. `branches` : archive `pages` dans le tag `archive/pages-2024`, supprime `pages` et l'ancienne branche de PR déjà fusionnée.
4. `environments` : crée `staging` et `production` avec leur politique de branche.
5. `rulesets` : protège `main`, `staging` et `dev`.
6. `cleanup` : supprime les anciens environnements (y compris `copilot`) et secrets, une fois les deux environnements déployés avec succès.
