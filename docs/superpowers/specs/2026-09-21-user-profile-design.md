# Profil utilisateur — conception

## Objectif

Après une connexion Google, VideGrenier221 doit reconnaître l’utilisateur, lui demander une seule fois les informations indispensables, afficher son identité dans l’en-tête et empêcher la mise en vente tant que son profil n’est pas complet.

## Périmètre du MVP

Le profil contient :

- prénom et nom ;
- numéro WhatsApp sénégalais ;
- ville ou commune ;
- photo de profil facultative.

La photo Google est proposée par défaut. L’utilisateur peut importer, remplacer ou supprimer une photo personnelle. Les préférences, évaluations, adresses détaillées et documents d’identité sont hors périmètre.

## Parcours utilisateur

1. L’utilisateur se connecte avec Google.
2. Le frontend transmet le jeton Firebase à `GET /api/v1/me`.
3. Le backend crée l’utilisateur si nécessaire et renvoie son profil ainsi qu’un indicateur `profileComplete`.
4. Un nouveau compte ou un profil incomplet est dirigé vers `/profile/setup`.
5. Le formulaire demande le nom, WhatsApp et la ville/commune. La photo reste facultative.
6. Après validation, l’utilisateur revient à sa destination initiale, ou à l’accueil par défaut.
7. Un utilisateur complet voit son avatar et son prénom dans l’en-tête, avec « Mon profil » et « Déconnexion ».
8. Toute tentative d’accès au parcours vendeur avec un profil incomplet redirige vers `/profile/setup`.

## Frontend

Un fournisseur de session client écoute Firebase Auth et expose trois états explicites : chargement, déconnecté, connecté. Pour un utilisateur connecté, il charge le profil depuis Spring et expose `profileComplete`.

Les composants concernés sont :

- l’en-tête partagé, qui affiche connexion ou menu utilisateur ;
- `/profile/setup`, formulaire de première configuration ;
- `/profile`, modification ultérieure ;
- une protection réutilisable pour les routes vendeur ;
- un composant d’avatar avec aperçu, remplacement et suppression.

Pendant le chargement de la session, l’en-tête affiche un emplacement neutre afin d’éviter un bref retour visuel au bouton « Connexion ».

## Backend et données

La table `users` conserve les champs existants et reçoit :

- `whatsapp_number` ;
- `city` ;
- `avatar_public_id` pour permettre la suppression Cloudinary ;
- `profile_completed_at`.

`avatar_url` continue de contenir l’URL affichable. Le profil est complet uniquement si le nom, le numéro WhatsApp et la ville sont valides.

Endpoints prévus :

- `GET /api/v1/me` : synchronise l’identité Google et renvoie le profil ;
- `PUT /api/v1/me/profile` : valide et enregistre le profil ;
- `POST /api/v1/me/avatar-signature` : produit une signature Cloudinary courte durée ;
- `DELETE /api/v1/me/avatar` : supprime la photo personnelle et revient à la photo Google si disponible.

Tous les endpoints utilisent le jeton Firebase. Un utilisateur ne peut modifier que son propre profil.

## Stockage des images

Cloudinary stocke les avatars sous un identifiant contrôlé par le serveur, dans un dossier logique `videgrenier221/users/{firebaseUid}`. Le secret Cloudinary reste uniquement dans Spring.

Le navigateur accepte JPG, PNG et WebP, refuse les fichiers dépassant 2 Mo et prépare un aperçu carré. L’upload utilise une signature générée par Spring. Cloudinary assure la livraison optimisée ; l’URL sauvegardée utilise une transformation carrée adaptée aux avatars.

Lors d’un remplacement réussi, le backend enregistre le nouvel identifiant puis supprime l’ancienne ressource. En cas d’échec, l’ancien avatar reste actif.

## Validation et erreurs

Le nom est nettoyé et doit contenir au moins deux caractères. Le numéro WhatsApp accepte la saisie locale et est normalisé au format international `+221XXXXXXXXX`. La ville/commune est obligatoire mais reste du texte libre pour couvrir tout le Sénégal.

Le formulaire emploie des messages simples : « Entrez votre numéro WhatsApp », « Choisissez une photo de moins de 2 Mo » et « Impossible d’enregistrer. Réessayez. » Une erreur d’image ne doit jamais effacer les autres champs.

## Sécurité

- vérification Firebase obligatoire côté Spring ;
- signature Cloudinary créée uniquement pour l’utilisateur connecté ;
- type, taille, dossier et identifiant public imposés par le serveur ;
- aucune clé secrète Cloudinary dans le navigateur ;
- validation répétée côté backend, indépendamment du frontend ;
- suppression limitée au `avatar_public_id` appartenant à l’utilisateur.

## Tests et critères d’acceptation

- un visiteur voit « Connexion » ;
- un utilisateur connecté voit son prénom et son avatar sans rechargement manuel ;
- un nouveau compte est dirigé vers `/profile/setup` ;
- nom, WhatsApp et ville sont obligatoires ;
- le numéro est enregistré au format `+221` ;
- un avatar valide peut être ajouté, remplacé et supprimé ;
- un fichier invalide ou trop lourd est refusé ;
- un profil incomplet ne peut pas accéder au parcours vendeur ;
- un profil complet retrouve la destination demandée ;
- les endpoints refusent les requêtes sans jeton Firebase valide ;
- les tests frontend, backend, lint et builds passent.

## Configuration nécessaire

Un compte Cloudinary gratuit doit fournir au backend :

- `CLOUDINARY_CLOUD_NAME` ;
- `CLOUDINARY_API_KEY` ;
- `CLOUDINARY_API_SECRET`.

Ces valeurs restent dans un fichier local ignoré par Git et dans les secrets de l’environnement de production.
