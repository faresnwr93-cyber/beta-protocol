# PROTOCOLE Z : ORIGINS — Réclamation Bêta Fermé

Portail Next.js en français pour identifier un survivant par Discord, vérifier son autorisation et attribuer le rôle « Bêta fermé » avec le bot du serveur.

## Prérequis et installation

- Node.js 20.9 ou plus récent.
- Une application Discord, un bot installé sur le serveur, et en production une base Upstash Redis REST.

1. Copiez le fichier .env.example vers .env.local.
2. Les identifiants du serveur Protocol Z: Origins et du rôle PASS BETA sont déjà renseignés dans `.env.example`. Ajoutez les secrets de l'application et choisissez le critère d'accès.
3. Générez une clé NEXTAUTH_SECRET aléatoire d'au moins 32 caractères.
4. Installez les dépendances avec npm install.
5. Démarrez le site avec npm run dev, puis ouvrez http://localhost:3000.

Le fallback en mémoire ne fonctionne que pour un seul processus local. Configurez Redis avant tout déploiement pour partager les limites et l'état des réclamations entre instances.

## Créer l'application Discord

1. Dans le [Discord Developer Portal](https://discord.com/developers/applications), créez une application.
2. Sous **OAuth2 → General**, copiez l'Application ID et le Client Secret dans DISCORD_CLIENT_ID et DISCORD_CLIENT_SECRET.
3. Sous **OAuth2 → Redirects**, ajoutez exactement l'URL REDIRECT_URI. En local : http://localhost:3000/api/auth/discord/callback. En production : l'URL HTTPS de votre site suivie de /api/auth/discord/callback.
4. Sous **Bot**, créez ou réinitialisez le jeton et placez-le dans DISCORD_BOT_TOKEN. Gardez-le privé.
5. Utilisez l'identifiant OAuth et le bot de la même application Discord.
6. Les scopes nécessaires sont identify et guilds.join. Le site construit lui-même l'URL d'autorisation et le paramètre state.

## Ajouter et configurer le bot

1. Ajoutez le bot au serveur cible depuis **OAuth2 → URL Generator** ou **Installation**.
2. Accordez au bot la permission **Gérer les rôles**. Le rattachement automatique des membres passe par le scope OAuth2 `guilds.join` avec le jeton d'accès du joueur.
3. Dans les réglages du serveur, placez le rôle du bot **AU-DESSUS** de PASS BETA dans la hiérarchie.
4. Les identifiants du serveur Protocol Z: Origins et du rôle PASS BETA sont déjà renseignés dans `.env.example`. Le mode développeur Discord permet de copier les identifiants par clic droit. Renseignez REQUIRED_ROLE_ID si l'accès doit dépendre d'un rôle d'admission.
5. Pour la liste blanche, entrez les identifiants Discord dans AUTHORIZED_DISCORD_IDS, séparés par des virgules. La liste blanche **ou** le rôle prérequis suffit; si les deux sont configurés, l'un ou l'autre autorise la réclamation. Pour autoriser tout le monde, définissez explicitement ALLOW_PUBLIC_CLAIMS=true.
6. Configurez DISCORD_INVITE_URL, éventuellement RULES_URL, et au besoin le webhook privé DISCORD_LOG_WEBHOOK_URL.

Si aucune règle d'autorisation n'est configurée, le site refuse les réclamations, sauf si ALLOW_PUBLIC_CLAIMS=true est activé explicitement.

## Variables d'environnement

| Variable | Usage |
| --- | --- |
| DISCORD_CLIENT_ID / DISCORD_CLIENT_SECRET | Application OAuth Discord |
| DISCORD_BOT_TOKEN | Jeton privé du bot |
| DISCORD_GUILD_ID / BETA_ROLE_ID | Serveur Protocol Z: Origins et rôle PASS BETA à attribuer |
| REDIRECT_URI | Callback OAuth, identique au Developer Portal |
| AUTHORIZED_DISCORD_IDS | Liste blanche, facultative si un rôle prérequis est défini |
| REQUIRED_ROLE_ID | Rôle d'admission facultatif |
| ALLOW_PUBLIC_CLAIMS | Autorise tout le monde quand défini à true |
| NEXTAUTH_SECRET | Chiffrement des tickets OAuth et des résultats |
| UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN | Rate limiting et réclamation unique en production |
| DISCORD_LOG_WEBHOOK_URL | Journal privé des attributions (obligatoire en production) |
| DISCORD_INVITE_URL / RULES_URL | Liens affichés dans l'interface |

Créez une base Redis sur [Upstash](https://console.upstash.com/) et copiez son URL REST ainsi que son jeton standard dans les variables de production. Gardez tous les secrets côté serveur, sans préfixe NEXT_PUBLIC_.

## Déployer sur Vercel

1. Importez le projet dans Vercel.
2. Définissez les variables dans l'environnement Production.
3. Remplacez REDIRECT_URI par l'URL HTTPS de votre domaine et ajoutez exactement la même adresse dans OAuth2 → Redirects.
4. Ajoutez les deux variables Upstash afin que les limites et l'unicité soient partagées entre les fonctions serverless.
5. Lancez le déploiement; Vercel exécute la compilation Next.js.

## Déployer sur un VPS

1. Installez Node.js 20.9+ et configurez les variables d'environnement de production.
2. Exécutez npm install puis npm run build.
3. Lancez npm run start avec systemd, PM2 ou un gestionnaire équivalent.
4. Placez un reverse proxy HTTPS devant le site et utilisez son URL publique dans REDIRECT_URI et le Developer Portal.
5. Gardez Upstash en service, surtout si plusieurs processus hébergent le site.

## Sécurité et décisions

- Le retour OAuth vérifie un state aléatoire en temps constant. Les cookies de session sont HttpOnly et SameSite=Lax, puis Secure en production.
- Le jeton OAuth est chiffré dans un cookie temporaire inaccessible au JavaScript et effacé après décision.
- Le rate limiting est atomique et distribué dans Redis. En production, l'absence de Redis entraîne un refus sûr.
- Une réservation atomique et une marque durable par identifiant Discord empêchent les réclamations concurrentes et les secondes attributions.
- Le webhook privé de production reçoit le pseudo, l'identifiant Discord et l'heure. Le site ne renvoie pas les secrets ni les détails d'erreur Discord au navigateur.
- Un compte admissible absent du serveur est ajouté via le scope guilds.join. Le rôle Bêta Fermé et le rôle préalable sont contrôlés par le bot.

Références Discord : [ajouter un membre au serveur](https://discord.com/developers/docs/resources/guild#add-guild-member) · [attribuer un rôle](https://discord.com/developers/docs/resources/guild#add-guild-member-role).
