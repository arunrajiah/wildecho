#!/usr/bin/env bash
# Build the privacy page from PRIVACY.md and publish the site to the public server.
# nginx config lives in the wildecho-api repo: deploy/droplet/nginx-wildecho.conf.
set -euo pipefail
cd "$(dirname "$0")"
python3 build.py
rsync -az --delete --exclude build.py --exclude deploy.sh ./ root@wildecho.arunrajiah.com:/var/www/wildecho/
