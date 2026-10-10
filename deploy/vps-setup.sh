#!/usr/bin/env bash
# Installation initiale du VPS pour acsms.fr (Ubuntu/Debian, à lancer en root).
# Usage : bash vps-setup.sh
set -euo pipefail

DOMAIN="acsms.fr"
WEBROOT="/var/www/$DOMAIN/html"
REPO="https://github.com/arsnplp/ACS.git"

echo "== 1. Paquets"
apt-get update
apt-get install -y nginx certbot python3-certbot-nginx git rsync curl ufw

echo "== 2. Node.js 22 (pour construire le site sur le VPS si besoin)"
if ! command -v node >/dev/null || [ "$(node -v | cut -c2-3)" -lt 20 ]; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y nodejs
fi

echo "== 3. Utilisateur deploy (reçoit les fichiers envoyés par GitHub Actions)"
id -u deploy >/dev/null 2>&1 || adduser --disabled-password --gecos "" deploy
mkdir -p "$WEBROOT" /home/deploy/.ssh
chown -R deploy:deploy "/var/www/$DOMAIN" /home/deploy/.ssh
chmod 700 /home/deploy/.ssh

echo "== 4. Clé SSH dédiée au déploiement"
if [ ! -f /home/deploy/.ssh/github_deploy ]; then
  sudo -u deploy ssh-keygen -t ed25519 -N "" -C "github-actions-acs" -f /home/deploy/.ssh/github_deploy
  cat /home/deploy/.ssh/github_deploy.pub >> /home/deploy/.ssh/authorized_keys
  chmod 600 /home/deploy/.ssh/authorized_keys
  chown deploy:deploy /home/deploy/.ssh/authorized_keys
fi

echo "== 5. Premier déploiement : clone + build sur le VPS"
if [ ! -d /opt/acs ]; then
  git clone "$REPO" /opt/acs
fi
cd /opt/acs
git pull --ff-only
npm ci
PUBLIC_SITE_URL="https://$DOMAIN" npm run build
rsync -az --delete dist/ "$WEBROOT/"
chown -R deploy:deploy "/var/www/$DOMAIN"

echo "== 6. Nginx"
cp /opt/acs/deploy/nginx-$DOMAIN.conf /etc/nginx/sites-available/$DOMAIN
ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/$DOMAIN
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

echo "== 7. Pare-feu"
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

echo "== 8. HTTPS (Let's Encrypt)"
certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" --non-interactive --agree-tos --redirect -m "${CERTBOT_EMAIL:-rosco-75@hotmail.com}"
systemctl enable --now certbot.timer 2>/dev/null || true

echo
echo "================================================================"
echo "Terminé. Le site est en ligne sur https://$DOMAIN"
echo
echo "Clé PRIVÉE à copier dans GitHub → Settings → Secrets → Actions → VPS_SSH_KEY :"
echo "----------------------------------------------------------------"
cat /home/deploy/.ssh/github_deploy
echo "----------------------------------------------------------------"
echo "Autres secrets : VPS_HOST=217.65.144.174   VPS_USER=deploy"
echo "================================================================"
