#!/usr/bin/env bash
set -euo pipefail
prompt=${1:-"evolve the current chapter with a new spatial motif"}
printf 'Run Hermes in this repo with the repo-local world skill plus a coding skill.\nSuggested command:\n  hermes -s hermesvj2-world -s test-driven-development chat -C . -q "%s"\n' "$prompt"
