#!/usr/bin/env bash
#
# One-time GitHub setup for the dev -> staging -> main flow (see ops/BRANCHES.md).
#
# Every step only PRINTS what it would do. Add --apply to run it:
#   ops/github-setup.sh <step> [--apply]
#
# Steps, in this order:
#   resync        make dev, staging and main point to the same commit (triggers deployments)
#   pages         disable GitHub Pages (source main:/docs no longer exists)
#   branches      archive the "pages" branch as a tag, delete the merged leftover branches
#   environments  create the "staging" and "production" environments with their branch policy
#   rulesets      protect main, staging and dev
#   cleanup       delete the old environments and the old deployment secrets
#
set -euo pipefail

REPO="${REPO:-AlexandreDFM/AlexandreDFM}"
CHECK="${CHECK:-Lint, typecheck, tests, build}"   # job name of .github/workflows/ci.yaml
step="${1:-}"
apply="${2:-}"

run() {
    if [ "$apply" = "--apply" ]; then
        echo "+ $*"
        "$@"
    else
        echo "[dry-run] $*"
    fi
}

case "$step" in
resync)
    # main only has merge commits that staging lacks; staging has all the code.
    run git fetch origin
    run git checkout main
    run git merge --ff-only origin/main
    run git merge --no-edit origin/staging -m "chore: resync staging into main"
    run git push origin main
    run git push origin main:staging     # fast-forward
    run git push origin main:dev         # fast-forward
    echo "Check: git rev-parse origin/dev origin/staging origin/main  -> 3 times the same SHA"
    ;;

pages)
    run gh api -X DELETE "repos/$REPO/pages"
    ;;

branches)
    run git fetch origin pages
    run git push origin "origin/pages:refs/tags/archive/pages-2024"
    run git push origin --delete pages copilot/sub-pr-4
    ;;

environments)
    for env in staging production; do
        branch=$([ "$env" = production ] && echo main || echo staging)
        run gh api -X PUT "repos/$REPO/environments/$env" --input - <<<'{"deployment_branch_policy":{"protected_branches":false,"custom_branch_policies":true}}'
        run gh api -X POST "repos/$REPO/environments/$env/deployment-branch-policies" -f "name=$branch" -f type=branch
    done
    cat <<EOF
Then add the Secrets and Variables of k8s/README.md, for example:
  gh secret set KUBE_CONFIG --env staging < <(NAMESPACE=alexandredfm-staging ./k8s/rbac/make-kubeconfig.sh https://<api>:6443)
  gh secret set DIRECTUS_WEBSITE_TOKEN --env staging
  gh variable set PUBLIC_SITE_URL --env staging --body https://staging.alexandredfm.fr
  gh variable set DIRECTUS_URL    --env staging --body https://my-api.alexandredfm.fr
  gh variable set SITE_NOINDEX    --env staging --body true
  (same for --env production with https://alexandredfm.fr and SITE_NOINDEX=false)
EOF
    ;;

rulesets)
    # main and staging: no deletion, no force-push, linear history (no merge commits),
    # CI green on the commit. Repository admins can bypass (fast-forward promotions).
    for branch in main staging; do
        payload=$(cat <<EOF
{
  "name": "protect-$branch",
  "target": "branch",
  "enforcement": "active",
  "conditions": { "ref_name": { "include": ["refs/heads/$branch"], "exclude": [] } },
  "bypass_actors": [ { "actor_id": 5, "actor_type": "RepositoryRole", "bypass_mode": "always" } ],
  "rules": [
    { "type": "deletion" },
    { "type": "non_fast_forward" },
    { "type": "required_linear_history" },
    { "type": "required_status_checks", "parameters": {
        "strict_required_status_checks_policy": false,
        "required_status_checks": [ { "context": "$CHECK" } ] } }
  ]
}
EOF
)
        run gh api -X POST "repos/$REPO/rulesets" --input - <<<"$payload"
    done
    # dev: changes through pull requests (squash), CI green
    payload=$(cat <<EOF
{
  "name": "protect-dev",
  "target": "branch",
  "enforcement": "active",
  "conditions": { "ref_name": { "include": ["refs/heads/dev"], "exclude": [] } },
  "bypass_actors": [ { "actor_id": 5, "actor_type": "RepositoryRole", "bypass_mode": "always" } ],
  "rules": [
    { "type": "deletion" },
    { "type": "non_fast_forward" },
    { "type": "pull_request", "parameters": {
        "required_approving_review_count": 0,
        "dismiss_stale_reviews_on_push": false,
        "require_code_owner_review": false,
        "require_last_push_approval": false,
        "required_review_thread_resolution": false,
        "allowed_merge_methods": ["squash"] } },
    { "type": "required_status_checks", "parameters": {
        "strict_required_status_checks_policy": false,
        "required_status_checks": [ { "context": "$CHECK" } ] } }
  ]
}
EOF
)
    run gh api -X POST "repos/$REPO/rulesets" --input - <<<"$payload"
    ;;

cleanup)
    # Only once the new workflows have deployed staging AND production successfully
    for env in alexandredfm-dev alexandredfm-prod alexandredfm-production alexandredfm-staging Production Preview github-pages copilot; do
        run gh api -X DELETE "repos/$REPO/environments/$env"
    done
    for secret in KUBERNETES_URL KUBERNETES_SECRET K8S_SECRETS_YAML_PROD K8S_SECRETS_YAML_STAGING; do
        run gh secret delete "$secret" -R "$REPO" || true
    done
    ;;

*)
    sed -n '3,16p' "$0" | sed 's/^# \{0,1\}//'
    exit 1
    ;;
esac
