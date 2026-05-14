# Guide de Déploiement Vercel pour HiveBets

Ce guide vous accompagnera dans le déploiement de votre application HiveBets sur Vercel.

## Prérequis

- Un [compte Vercel](https://vercel.com/signup) (le plan gratuit fonctionne parfaitement)
- Node.js installé sur votre ordinateur
- Votre projet HiveBets prêt à être déployé

## Étape 1 : Préparer Votre Projet

1. **Assurez-vous que toutes les dépendances sont installées :**
   ```bash
   npm install
   ```

2. **Testez votre build localement :**
   ```bash
   npm run build
   ```

3. **Assurez-vous que votre projet se construit sans erreurs**

## Étape 2 : Déployer sur Vercel

### Option A : Déployer via Vercel CLI (Recommandé)

1. **Installer Vercel CLI :**
   ```bash
   npm i -g vercel
   ```

2. **Se connecter à Vercel :**
   ```bash
   vercel login
   ```

3. **Déployer depuis votre répertoire de projet :**
   ```bash
   cd /chemin/vers/votre/projet
   vercel
   ```
   
   Suivez les instructions :
   - Configurer et déployer ? **Y**
   - Quel scope ? Sélectionnez votre compte
   - Lier à un projet existant ? **N**
   - Quel est le nom de votre projet ? `hivebets`
   - Dans quel répertoire se trouve votre code ? `./`
   
4. **Déployer en production :**
   ```bash
   vercel --prod
   ```

### Option B : Déployer via Glisser-Déposer

1. **Construisez votre projet :**
   ```bash
   npm run build
   ```

2. Allez sur [vercel.com/new](https://vercel.com/new)
3. Cliquez sur **"Browse"** ou glissez votre dossier de projet
4. Sélectionnez votre dossier de projet entier
5. Vercel détectera Next.js et déploiera automatiquement

### Option C : Déployer via l'Application Vercel Desktop

1. Téléchargez [Vercel Desktop](https://vercel.com/desktop)
2. Installez et connectez-vous
3. Glissez votre dossier de projet dans l'application
4. Cliquez sur **"Deploy"**

## Étape 3 : Configurer les Variables d'Environnement (si nécessaire)

Si votre projet utilise des variables d'environnement :

1. Allez dans votre projet sur le Tableau de Bord Vercel
2. Naviguez vers **Settings** → **Environment Variables**
3. Ajoutez vos variables :
   - Cliquez sur **"Add New"**
   - Entrez les paires clé-valeur
   - Sélectionnez les environnements (Production, Preview, Development)
   - Cliquez sur **"Save"**

Variables d'environnement courantes pour les applications Web3 :
```
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=votre_project_id
NEXT_PUBLIC_RPC_URL=votre_rpc_url
```

## Étape 4 : Domaine Personnalisé (Optionnel)

1. Allez dans votre projet sur Vercel
2. Naviguez vers **Settings** → **Domains**
3. Cliquez sur **"Add"**
4. Entrez votre domaine personnalisé
5. Suivez les instructions de configuration DNS

## Étape 5 : Déployer les Services Facilitateurs

Les services facilitateurs doivent être déployés séparément :

### Options de Déploiement du Facilitateur :

1. **Vercel CLI (Recommandé)**
   ```bash
   cd facilitator
   vercel --prod
   ```

2. **Railway.app**
   - Allez sur [railway.app](https://railway.app)
   - Cliquez sur "Deploy from Local"
   - Sélectionnez votre dossier facilitator
   - Ajoutez les variables d'environnement
   - Déployez

3. **Render.com**
   - Allez sur [render.com](https://render.com)
   - Nouveau Web Service
   - Téléchargez votre dossier facilitator
   - Configurez et déployez

4. **Heroku**
   ```bash
   cd facilitator
   heroku create hivebets-facilitator
   git init
   git add .
   git commit -m "Déployer facilitator"
   heroku git:remote -a hivebets-facilitator
   git push heroku main
   ```

## Redéployer les Mises à Jour

Pour redéployer après avoir effectué des modifications :

**Via CLI :**
```bash
vercel --prod
```

**Via le Tableau de Bord :**
1. Allez dans votre projet sur Vercel
2. Cliquez sur **"Redeploy"** depuis l'onglet Deployments

**Via Glisser-Déposer :**
- Glissez simplement à nouveau votre dossier de projet mis à jour

## Dépannage

### Erreurs de Build

Si vous obtenez des erreurs de build :

1. Vérifiez vos logs de build sur le tableau de bord Vercel
2. Assurez-vous que toutes les dépendances sont dans `package.json`
3. Vérifiez la compatibilité de la version Next.js
4. Vérifiez les erreurs TypeScript

### Les Variables d'Environnement ne Fonctionnent Pas

- Assurez-vous que les variables commencent par `NEXT_PUBLIC_` pour l'accès côté client
- Redéployez après avoir ajouté de nouvelles variables d'environnement
- Effacez le cache de build si nécessaire

### Le Déploiement Prend Trop de Temps

- Vérifiez si vous utilisez `--turbopack` dans le build (supprimez-le pour la production)
- Optimisez votre build en supprimant les dépendances inutilisées
- Envisagez d'utiliser `output: 'standalone'` dans `next.config.ts`

## Surveiller Votre Déploiement

1. **Analytics** : Activez Vercel Analytics dans les paramètres du projet
2. **Logs** : Consultez les logs en temps réel sur le tableau de bord Vercel
3. **Performance** : Utilisez Vercel Speed Insights

## Mettre à Jour Votre Déploiement

Pour mettre à jour votre déploiement avec de nouvelles modifications :

```bash
# Naviguez vers votre projet
cd /chemin/vers/votre/projet

# Déployez les mises à jour
vercel --prod
```

La nouvelle version sera en ligne en quelques minutes.

## Rollback (Retour Arrière)

Si vous devez faire un rollback :

1. Allez sur le Tableau de Bord Vercel
2. Naviguez vers **Deployments**
3. Trouvez le déploiement précédent fonctionnel
4. Cliquez sur le menu à trois points
5. Sélectionnez **"Promote to Production"**

## Liste de Vérification Production

Avant de mettre en ligne :

- [ ] Toutes les variables d'environnement configurées
- [ ] Domaine personnalisé configuré (si applicable)
- [ ] Certificat SSL actif (automatique avec Vercel)
- [ ] Suppression des console.logs et du code de débogage
- [ ] Test de toutes les fonctionnalités sur le déploiement preview
- [ ] Configuration CORS si utilisation d'APIs externes
- [ ] Configuration de la surveillance et du suivi des erreurs
- [ ] Vérification que la connexion wallet fonctionne
- [ ] Test sur plusieurs appareils/navigateurs

## Support

- [Documentation Vercel](https://vercel.com/docs)
- [Docs de Déploiement Next.js](https://nextjs.org/docs/deployment)
- [Discord Vercel](https://vercel.com/discord)

---

## Commande de Démarrage Rapide

La façon la plus rapide de déployer :

```bash
npm i -g vercel && vercel --prod
```

Bonne chance avec votre déploiement ! 🚀

