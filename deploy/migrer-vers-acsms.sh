#!/usr/bin/env bash
# Bascule du site de acs.nairox.fr vers acsms.fr (à lancer en root sur le VPS).
# Pré-requis : les enregistrements DNS A de acsms.fr et www.acsms.fr pointent vers 217.65.144.174
# (vérifier avec : dig +short acsms.fr @1.1.1.1).
# Usage : bash /opt/acs/deploy/migrer-vers-acsms.sh
set -euo pipefail

NEW="acsms.fr"; OLD="acs.nairox.fr"
NEWROOT="/var/www/$NEW/html"; OLDROOT="/var/www/$OLD/html"

echo "== 0. DNS"
ip=$(dig +short "$NEW" @1.1.1.1 | tail -1 || true)
[ "$ip" = "217.65.144.174" ] || { echo "DNS de $NEW → '$ip' (attendu 217.65.144.174). Corrigez le DNS puis relancez."; exit 1; }

echo "== 1. Dossier web et copie des fichiers actuels"
mkdir -p "$NEWROOT"
rsync -a "$OLDROOT/" "$NEWROOT/"
chown -R deploy:deploy "/var/www/$NEW"

echo "== 2. Nginx pour $NEW"
cd /opt/acs && git pull --ff-only
cp "/opt/acs/deploy/nginx-$NEW.conf" "/etc/nginx/sites-available/$NEW"
ln -sf "/etc/nginx/sites-available/$NEW" "/etc/nginx/sites-enabled/$NEW"
nginx -t && systemctl reload nginx

echo "== 3. HTTPS pour $NEW et www.$NEW"
certbot --nginx -d "$NEW" -d "www.$NEW" --non-interactive --agree-tos --redirect -m "${CERTBOT_EMAIL:-rosco-75@hotmail.com}"
# HTTP/2 sur le bloc 443 créé par certbot
sed -i 's/listen 443 ssl;/listen 443 ssl http2;/; s/listen \[::\]:443 ssl;/listen [::]:443 ssl http2;/' "/etc/nginx/sites-available/$NEW" || true

echo "== 4. Ancien domaine $OLD → redirection 301 vers $NEW"
sed -i 's|try_files $uri $uri/ $uri.html =404;|return 301 https://'"$NEW"'$request_uri;|' "/etc/nginx/sites-available/$OLD"
nginx -t && systemctl reload nginx

echo "== 5. Rebuild avec la nouvelle URL canonique"
cd /opt/acs && npm ci && PUBLIC_SITE_URL="https://$NEW" npm run build
rsync -az --delete dist/ "$NEWROOT/"
chown -R deploy:deploy "/var/www/$NEW"

echo
echo "Terminé. Vérifications :"
for u in "https://$NEW/" "https://www.$NEW/" "https://$OLD/services/plomberie/" "http://$NEW/"; do
  printf "  %-45s " "$u"; curl -s -o /dev/null -w "%{http_code} → %{redirect_url}\n" "$u"
done
echo
echo "Il reste à : (1) vérifier que GitHub Actions déploie bien vers $NEWROOT (workflow déjà mis à jour),"
echo "(2) déclarer https://$NEW/ dans Google Search Console et y soumettre https://$NEW/sitemap-index.xml,"
echo "(3) mettre à jour l'URL du site sur la fiche Google Business Profile."
