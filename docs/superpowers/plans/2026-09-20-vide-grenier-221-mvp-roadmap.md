# VideGrenier221 MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Livrer une application web mobile-first permettant de transformer les photos d'une pièce ou d'un objet en fiches validées par le vendeur, publiées dans une boutique partageable et contactable via WhatsApp.

**Architecture:** Monorepo comportant une interface Next.js App Router et une API Spring Boot organisée en modules métier. Firebase authentifie les comptes Google ; l'API vérifie les jetons et conserve boutiques, articles, réservations et événements dans PostgreSQL. Les images transitent par des URL signées vers un stockage S3, tandis qu'un worker asynchrone appelle un fournisseur de vision derrière une interface remplaçable.

**Tech Stack:** Next.js App Router, TypeScript, Tailwind CSS, Vitest, Playwright, Java 17, Spring Boot, Maven, JUnit 5, Testcontainers, PostgreSQL, Flyway, Firebase Authentication, stockage compatible S3, OpenAPI.

**Spec:** `docs/superpowers/specs/2026-09-20-vide-grenier-221-design.md`

## Global Constraints

- L'interface est mobile-first, en français simple, et priorise Android.
- Le territoire fonctionnel couvre les 14 régions du Sénégal.
- La connexion du MVP utilise Google via Firebase Authentication.
- Aucun contenu produit par l'IA n'est publié sans validation explicite du vendeur.
- Le contact et la réservation utilisent WhatsApp ; aucun paiement ou livraison n'est intégré.
- La localisation publique est limitée à la ville et au quartier choisi.
- Une réservation confirmée expire après 24 heures.
- Les images publiques sont compressées et débarrassées de leurs métadonnées sensibles.
- Objectif de performance : première page utile en moins de 3 secondes sur un réseau mobile moyen, hors analyse IA.
- Objectif de disponibilité des pages publiques : 99,5 % par mois.

---

## Découpage et calendrier

| Phase | Semaines | Résultat démontrable |
|---|---:|---|
| 0. Socle et expérience visuelle | 1–2 | Landing responsive conforme aux maquettes, CI et environnements locaux |
| 1. Marketplace manuelle | 3–4 | Connexion Google, boutique, création manuelle d'articles et pages publiques |
| 2. Création assistée par IA | 5–6 | Import d'une pièce, détection multiple, génération et validation des fiches |
| 3. Réservation et confiance | 7–8 | WhatsApp, réservation 24 h, signalement, modération et statuts fiables |
| 4. Pilote et qualité | 9–10 | Mesure produit, performance, sécurité, accessibilité et pilote fermé |

Le calendrier suppose une équipe composée d'un développeur full stack senior, d'un designer à temps partiel et d'un appui ponctuel IA. Avec une seule personne à temps partiel, prévoir 14 à 18 semaines.

## Arborescence cible

```text
vide-grenier-senegal/
├── apps/
│   ├── web/
│   │   ├── app/                    # routes Next.js et layouts
│   │   ├── features/               # auth, shops, listings, analysis, reservations
│   │   ├── components/             # composants UI partagés
│   │   ├── lib/                    # client API, Firebase, analytics
│   │   └── tests/e2e/              # scénarios Playwright
│   └── api/
│       ├── src/main/java/sn/vg221/ # modules Spring Boot
│       ├── src/main/resources/db/  # migrations Flyway
│       └── src/test/java/sn/vg221/ # tests unitaires et intégration
├── packages/
│   └── contracts/                  # OpenAPI et types TypeScript générés
├── infra/
│   ├── compose.yaml                # PostgreSQL et stockage local
│   └── env/                        # exemples de configuration sans secrets
└── docs/
```

## Jalons de décision

- **Gate A — fin semaine 2 :** la landing et le prototype mobile sont validés visuellement.
- **Gate B — fin semaine 4 :** un vendeur publie manuellement une boutique et la partage.
- **Gate C — fin semaine 6 :** cinq objets détectés peuvent être corrigés et publiés en moins de dix minutes.
- **Gate D — fin semaine 8 :** réservations, signalements et suspensions empêchent les incohérences critiques.
- **Gate E — fin semaine 10 :** feu vert pilote uniquement si les tests de sécurité, performance et mesure passent.

---

### Task 1: Socle monorepo et contrôle qualité

**Files:**
- Create: `pnpm-workspace.yaml`
- Create: `package.json`
- Create: `apps/web/package.json`
- Create: `apps/api/pom.xml`
- Create: `infra/compose.yaml`
- Create: `.github/workflows/ci.yml`
- Create: `.env.example`

**Interfaces:**
- Produces: commandes racine `pnpm lint`, `pnpm test`, `pnpm test:e2e` et `pnpm api:test`.
- Produces: PostgreSQL local sur `localhost:5432` et stockage S3 local sur `localhost:9000`.

- [ ] **Step 1: Écrire les tests fumée du Web et de l'API**

Créer `apps/web/app/page.test.tsx` avec une assertion sur le titre `Vide Grenier 221`, et `apps/api/src/test/java/sn/vg221/ApplicationTest.java` avec `@SpringBootTest` vérifiant le chargement du contexte.

- [ ] **Step 2: Vérifier l'échec initial**

Run: `pnpm test && pnpm api:test`

Expected: échec car les applications et les commandes n'existent pas.

- [ ] **Step 3: Initialiser les applications et l'environnement local**

Configurer Next.js avec TypeScript, App Router, ESLint et Tailwind. Configurer Spring Boot avec Java 17, Web, Validation, Security, Data JPA, Flyway et PostgreSQL. Ajouter PostgreSQL et MinIO au fichier Compose sans inclure de secrets réels.

- [ ] **Step 4: Exécuter la chaîne complète**

Run: `docker compose -f infra/compose.yaml up -d`

Run: `pnpm lint && pnpm test && pnpm api:test`

Expected: toutes les commandes terminent avec le code 0.

- [ ] **Step 5: Commit**

```bash
git add pnpm-workspace.yaml package.json apps infra .github .env.example
git commit -m "chore: initialize VideGrenier221 monorepo"
```

### Task 2: Design system et landing page

**Files:**
- Create: `apps/web/app/globals.css`
- Create: `apps/web/app/layout.tsx`
- Create: `apps/web/app/page.tsx`
- Create: `apps/web/components/site-header.tsx`
- Create: `apps/web/components/hero.tsx`
- Create: `apps/web/components/how-it-works.tsx`
- Create: `apps/web/components/listing-card.tsx`
- Create: `apps/web/components/site-footer.tsx`
- Create: `apps/web/tests/e2e/landing.spec.ts`

**Interfaces:**
- Produces: `ListingCardProps { title: string; priceCfa: number; city: string; imageUrl: string; status: "AVAILABLE" | "RESERVED" | "SOLD" }`.
- Produces: routes CTA `/sell/room`, `/sell/item`, `/browse` et `/login`.

- [ ] **Step 1: Écrire le scénario mobile de la landing**

Le test Playwright ouvre la page en 390 × 844, vérifie le titre « Transformez vos objets en boutique en quelques minutes », les deux CTA, les trois étapes et l'absence de débordement horizontal.

- [ ] **Step 2: Vérifier que le scénario échoue**

Run: `pnpm --filter web test:e2e -- landing.spec.ts`

Expected: échec sur le titre absent.

- [ ] **Step 3: Implémenter la page selon la maquette 2**

Créer les tokens `--color-forest`, `--color-cream`, `--color-sun` et `--color-ink`. Construire un hero, les étapes, six annonces de démonstration et un pied de page, avec images optimisées, focus visibles et textes alternatifs.

- [ ] **Step 4: Vérifier desktop, mobile et accessibilité de base**

Run: `pnpm --filter web test && pnpm --filter web test:e2e -- landing.spec.ts`

Expected: PASS sur les deux tailles d'écran.

- [ ] **Step 5: Commit**

```bash
git add apps/web
git commit -m "feat: build responsive marketing landing page"
```

### Task 3: Contrats API, modèle de données et migrations

**Files:**
- Create: `packages/contracts/openapi.yaml`
- Create: `apps/api/src/main/resources/db/migration/V1__initial_schema.sql`
- Create: `apps/api/src/main/java/sn/vg221/user/User.java`
- Create: `apps/api/src/main/java/sn/vg221/shop/Shop.java`
- Create: `apps/api/src/main/java/sn/vg221/listing/Listing.java`
- Create: `apps/api/src/main/java/sn/vg221/reservation/Reservation.java`
- Create: `apps/api/src/main/java/sn/vg221/report/Report.java`
- Test: `apps/api/src/test/java/sn/vg221/db/MigrationTest.java`

**Interfaces:**
- Produces: statuts `DRAFT`, `AVAILABLE`, `RESERVED`, `SOLD`, `WITHDRAWN`.
- Produces: `GET/POST /api/v1/shops`, `GET/PATCH /api/v1/shops/{id}`, `POST/PATCH /api/v1/listings`, `POST /api/v1/reservations`.

- [ ] **Step 1: Écrire le test d'intégrité du schéma**

Avec Testcontainers PostgreSQL, migrer une base vide puis vérifier les tables `users`, `shops`, `listings`, `listing_images`, `reservations`, `analysis_jobs`, `reports` et `events`, ainsi que l'unicité des slugs et d'une réservation active par article.

- [ ] **Step 2: Vérifier l'échec sans migration**

Run: `pnpm api:test -- -Dtest=MigrationTest`

Expected: échec sur la table `shops` absente.

- [ ] **Step 3: Définir OpenAPI, migrations et entités**

Utiliser des UUID, des timestamps UTC, des montants FCFA entiers et une colonne de version optimiste sur les articles. Séparer `analysis_jobs.raw_result` du contenu vendeur conservé dans `listings`.

- [ ] **Step 4: Vérifier schéma et génération des types**

Run: `pnpm contracts:generate && pnpm api:test -- -Dtest=MigrationTest`

Expected: types TypeScript générés et test PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/contracts apps/api
git commit -m "feat: define marketplace contracts and data model"
```

### Task 4: Authentification Google et profil vendeur

**Files:**
- Create: `apps/web/lib/firebase.ts`
- Create: `apps/web/features/auth/google-sign-in.tsx`
- Create: `apps/web/features/auth/auth-provider.tsx`
- Create: `apps/api/src/main/java/sn/vg221/security/FirebaseTokenFilter.java`
- Create: `apps/api/src/main/java/sn/vg221/security/SecurityConfig.java`
- Create: `apps/api/src/main/java/sn/vg221/user/UserController.java`
- Test: `apps/api/src/test/java/sn/vg221/security/FirebaseTokenFilterTest.java`
- Test: `apps/web/features/auth/google-sign-in.test.tsx`

**Interfaces:**
- Consumes: jeton Firebase transmis dans `Authorization: Bearer <token>`.
- Produces: `GET /api/v1/me -> UserProfile` et principal serveur contenant `firebaseUid`.

- [ ] **Step 1: Écrire les tests d'accès**

Tester qu'une requête sans jeton reçoit 401, qu'un jeton invalide reçoit 401 et qu'un jeton valide crée ou actualise le profil puis reçoit 200. Tester que le bouton Web utilise une redirection sur mobile.

- [ ] **Step 2: Vérifier les échecs**

Run: `pnpm test --filter auth && pnpm api:test -- -Dtest=FirebaseTokenFilterTest`

Expected: FAIL car le fournisseur et le filtre n'existent pas.

- [ ] **Step 3: Implémenter le flux Google**

Initialiser Firebase uniquement à partir de variables `NEXT_PUBLIC_FIREBASE_*`. Vérifier le jeton côté API via Firebase Admin, limiter les routes d'écriture au rôle `SELLER` et laisser les pages publiques anonymes.

- [ ] **Step 4: Vérifier authentification et déconnexion**

Run: `pnpm test --filter auth && pnpm api:test -- -Dtest=FirebaseTokenFilterTest`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/web apps/api
git commit -m "feat: add Google authentication for sellers"
```

### Task 5: Boutique et articles manuels de bout en bout

**Files:**
- Create: `apps/api/src/main/java/sn/vg221/shop/ShopService.java`
- Create: `apps/api/src/main/java/sn/vg221/shop/ShopController.java`
- Create: `apps/api/src/main/java/sn/vg221/listing/ListingService.java`
- Create: `apps/api/src/main/java/sn/vg221/listing/ListingController.java`
- Create: `apps/web/app/dashboard/page.tsx`
- Create: `apps/web/app/shops/new/page.tsx`
- Create: `apps/web/app/sell/item/page.tsx`
- Create: `apps/web/app/b/[slug]/page.tsx`
- Create: `apps/web/app/item/[id]/page.tsx`
- Test: `apps/web/tests/e2e/manual-publishing.spec.ts`

**Interfaces:**
- Produces: `ShopService.create(ownerId, CreateShopCommand): Shop`.
- Produces: `ListingService.saveDraft(ownerId, SaveListingCommand): Listing`.
- Produces: `ListingService.publish(ownerId, listingId): Listing` avec validation du prix, des photos et du contrôle vendeur.

- [ ] **Step 1: Écrire le scénario publication manuelle**

Le scénario crée une boutique, ajoute un article, vérifie la prévisualisation, publie, ouvre `/b/{slug}` sans session et retrouve le titre, le prix, la ville et le statut.

- [ ] **Step 2: Vérifier l'échec initial**

Run: `pnpm --filter web test:e2e -- manual-publishing.spec.ts`

Expected: FAIL à la route `/shops/new`.

- [ ] **Step 3: Implémenter règles métier, formulaires et pages publiques**

Autoriser plusieurs boutiques par vendeur, garantir l'unicité du slug, exiger un prix avant publication, ne jamais exposer l'identifiant Google ou une adresse exacte, et refuser toute modification par un autre vendeur.

- [ ] **Step 4: Vérifier API et parcours complet**

Run: `pnpm api:test && pnpm --filter web test:e2e -- manual-publishing.spec.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/api apps/web
git commit -m "feat: publish manual shops and listings"
```

### Task 6: Téléversement sécurisé et traitement des images

**Files:**
- Create: `apps/api/src/main/java/sn/vg221/media/MediaService.java`
- Create: `apps/api/src/main/java/sn/vg221/media/MediaController.java`
- Create: `apps/api/src/main/java/sn/vg221/media/ImageProcessor.java`
- Create: `apps/web/features/upload/photo-uploader.tsx`
- Test: `apps/api/src/test/java/sn/vg221/media/MediaServiceTest.java`
- Test: `apps/web/features/upload/photo-uploader.test.tsx`

**Interfaces:**
- Produces: `POST /api/v1/media/upload-intents -> { mediaId, uploadUrl, expiresAt }`.
- Produces: `MediaService.finalizeUpload(ownerId, mediaId): MediaAsset` avec original privé, image WebP et miniature.

- [ ] **Step 1: Écrire les tests de validation média**

Tester JPEG/PNG/HEIC autorisés, taille maximale 12 Mo, refus d'un faux type MIME, suppression EXIF, génération de variantes et interdiction d'utiliser le média d'un autre compte.

- [ ] **Step 2: Vérifier les échecs**

Run: `pnpm api:test -- -Dtest=MediaServiceTest && pnpm test --filter photo-uploader`

Expected: FAIL car les services n'existent pas.

- [ ] **Step 3: Implémenter l'upload direct et la reprise**

Créer des URL signées de dix minutes, conserver les originaux en privé, publier uniquement les variantes nettoyées, afficher la progression par photo et permettre de relancer un transfert interrompu.

- [ ] **Step 4: Vérifier transformations et interface**

Run: `pnpm api:test -- -Dtest=MediaServiceTest && pnpm test --filter photo-uploader`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/api apps/web
git commit -m "feat: add secure resumable image uploads"
```

### Task 7: Analyse IA asynchrone et fiches brouillon

**Files:**
- Create: `apps/api/src/main/java/sn/vg221/analysis/VisionProvider.java`
- Create: `apps/api/src/main/java/sn/vg221/analysis/VisionDetection.java`
- Create: `apps/api/src/main/java/sn/vg221/analysis/AnalysisService.java`
- Create: `apps/api/src/main/java/sn/vg221/analysis/AnalysisWorker.java`
- Create: `apps/api/src/main/java/sn/vg221/analysis/ModerationPolicy.java`
- Create: `apps/web/app/sell/room/page.tsx`
- Create: `apps/web/app/analysis/[jobId]/page.tsx`
- Test: `apps/api/src/test/java/sn/vg221/analysis/AnalysisServiceTest.java`
- Test: `apps/web/tests/e2e/room-analysis.spec.ts`

**Interfaces:**
- Produces: `VisionProvider.detect(List<MediaAsset>): List<VisionDetection>`.
- Produces: `POST /api/v1/analyses -> AnalysisJob` et `GET /api/v1/analyses/{id}`.
- Produces: détection `{ label, confidence, boundingBox, suggestedCategory, suggestedPriceMinCfa, suggestedPriceMaxCfa, warnings }`.

- [ ] **Step 1: Écrire les tests avec un faux fournisseur déterministe**

À partir d'une pièce de test, retourner canapé, lampe et table. Vérifier que trois brouillons non publiés sont produits, qu'une détection peut être ignorée, qu'un objet manuel peut être ajouté et qu'une arme simulée est bloquée.

- [ ] **Step 2: Vérifier les échecs**

Run: `pnpm api:test -- -Dtest=AnalysisServiceTest && pnpm --filter web test:e2e -- room-analysis.spec.ts`

Expected: FAIL car l'analyse n'existe pas.

- [ ] **Step 3: Implémenter la file, la progression et l'éditeur**

Accepter une à cinq photos, exécuter hors requête HTTP, conserver le résultat brut séparément, exposer les états `QUEUED`, `PROCESSING`, `REVIEW_REQUIRED`, `COMPLETED`, `FAILED`, et reprendre un job échoué au maximum deux fois.

- [ ] **Step 4: Vérifier le parcours de la maquette 1**

Run: `pnpm api:test -- -Dtest=AnalysisServiceTest && pnpm --filter web test:e2e -- room-analysis.spec.ts`

Expected: PASS ; aucune fiche n'est publique avant le clic de validation.

- [ ] **Step 5: Commit**

```bash
git add apps/api apps/web
git commit -m "feat: generate reviewable listings from room photos"
```

### Task 8: Partage WhatsApp et réservation 24 heures

**Files:**
- Create: `apps/web/lib/whatsapp.ts`
- Create: `apps/web/components/share-actions.tsx`
- Create: `apps/api/src/main/java/sn/vg221/reservation/ReservationService.java`
- Create: `apps/api/src/main/java/sn/vg221/reservation/ReservationController.java`
- Create: `apps/api/src/main/java/sn/vg221/reservation/ReservationExpiryJob.java`
- Test: `apps/api/src/test/java/sn/vg221/reservation/ReservationServiceTest.java`
- Test: `apps/web/lib/whatsapp.test.ts`

**Interfaces:**
- Produces: `buildWhatsAppUrl({ phoneE164, title, publicUrl, intent }): string`.
- Produces: `ReservationService.request(listingId, buyerName, buyerPhone): Reservation`.
- Produces: `confirm(ownerId, reservationId)` et `reject(ownerId, reservationId)`.

- [ ] **Step 1: Écrire les tests de concurrence et d'expiration**

Tester le message encodé, la validation E.164, deux demandes concurrentes, l'obligation de confirmation vendeur, l'expiration à 24 heures et l'impossibilité de réserver un article vendu.

- [ ] **Step 2: Vérifier les échecs**

Run: `pnpm test --filter whatsapp && pnpm api:test -- -Dtest=ReservationServiceTest`

Expected: FAIL.

- [ ] **Step 3: Implémenter partage et cycle de réservation**

L'acheteur ne crée pas de compte. Collecter uniquement nom et téléphone, journaliser le consentement, envoyer le contexte de l'article dans WhatsApp et appliquer un verrou optimiste lors de la confirmation.

- [ ] **Step 4: Vérifier les transitions**

Run: `pnpm test --filter whatsapp && pnpm api:test -- -Dtest=ReservationServiceTest`

Expected: PASS pour `AVAILABLE -> RESERVED -> SOLD` et `RESERVED -> AVAILABLE` après expiration.

- [ ] **Step 5: Commit**

```bash
git add apps/api apps/web
git commit -m "feat: add WhatsApp sharing and expiring reservations"
```

### Task 9: Signalement, administration et audit

**Files:**
- Create: `apps/api/src/main/java/sn/vg221/report/ReportService.java`
- Create: `apps/api/src/main/java/sn/vg221/admin/AdminController.java`
- Create: `apps/api/src/main/java/sn/vg221/audit/AuditEvent.java`
- Create: `apps/web/app/admin/page.tsx`
- Create: `apps/web/components/report-dialog.tsx`
- Test: `apps/api/src/test/java/sn/vg221/admin/AdminAuthorizationTest.java`
- Test: `apps/web/tests/e2e/reporting.spec.ts`

**Interfaces:**
- Produces: `POST /api/v1/reports`, `GET /api/v1/admin/reports`, `POST /api/v1/admin/listings/{id}/suspend` et `POST /api/v1/admin/users/{id}/suspend`.

- [ ] **Step 1: Écrire les tests de rôle et d'audit**

Tester qu'un visiteur peut signaler avec un motif, qu'un vendeur ne peut pas accéder à l'administration, qu'un administrateur peut suspendre, et que chaque action sensible enregistre acteur, cible, raison et horodatage.

- [ ] **Step 2: Vérifier les échecs**

Run: `pnpm api:test -- -Dtest=AdminAuthorizationTest && pnpm --filter web test:e2e -- reporting.spec.ts`

Expected: FAIL.

- [ ] **Step 3: Implémenter la file de modération**

Trier par risque et ancienneté, masquer immédiatement une annonce suspendue, empêcher toute nouvelle publication par un compte suspendu et afficher un canal de recours/support.

- [ ] **Step 4: Vérifier le parcours de modération**

Run: `pnpm api:test -- -Dtest=AdminAuthorizationTest && pnpm --filter web test:e2e -- reporting.spec.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/api apps/web
git commit -m "feat: add reporting and moderation controls"
```

### Task 10: Mesure produit, performance et préparation du pilote

**Files:**
- Create: `apps/api/src/main/java/sn/vg221/event/ProductEventService.java`
- Create: `apps/web/lib/analytics.ts`
- Create: `apps/web/tests/e2e/pilot-funnel.spec.ts`
- Create: `apps/web/lighthouserc.json`
- Create: `docs/runbooks/pilot.md`
- Create: `docs/runbooks/incidents.md`

**Interfaces:**
- Produces: événements `SIGN_UP`, `SHOP_CREATED`, `ANALYSIS_STARTED`, `ANALYSIS_COMPLETED`, `LISTING_PUBLISHED`, `SHOP_SHARED`, `WHATSAPP_CLICKED`, `RESERVATION_REQUESTED`, `LISTING_SOLD`.
- Produces: métriques agrégées sans contenu de conversation WhatsApp.

- [ ] **Step 1: Écrire le test du tunnel pilote**

Le scénario crée un vendeur, publie cinq articles, partage une boutique, simule un clic WhatsApp et une réservation, puis vérifie qu'un événement unique existe pour chaque étape et qu'aucun numéro complet n'est envoyé à l'outil analytique.

- [ ] **Step 2: Vérifier l'échec initial**

Run: `pnpm --filter web test:e2e -- pilot-funnel.spec.ts`

Expected: FAIL sur les événements absents.

- [ ] **Step 3: Implémenter instrumentation et budgets qualité**

Ajouter déduplication des événements, corrélation par session, suivi du temps d'analyse et du coût IA, seuil Lighthouse mobile de 90 pour accessibilité et 80 pour performance, puis documenter sauvegarde, restauration, suspension et support pilote.

- [ ] **Step 4: Exécuter la gate finale**

Run: `pnpm lint && pnpm test && pnpm api:test && pnpm test:e2e && pnpm lighthouse`

Expected: toutes les suites passent ; aucune vulnérabilité critique ; budgets Lighthouse respectés.

- [ ] **Step 5: Commit**

```bash
git add apps packages docs
git commit -m "feat: instrument and harden the pilot funnel"
```

---

## Backlog explicitement post-MVP

- Paiement Wave, Orange Money ou carte.
- Livraison et suivi logistique.
- Messagerie interne temps réel.
- Comptes et abonnements professionnels.
- Wolof et autres langues.
- Estimation propriétaire fondée sur les ventes réelles.
- Application mobile native.

## Critères Go/No-Go du pilote

Le pilote fermé démarre avec 30 à 50 vendeurs uniquement si : l'activation atteint 40 %, cinq objets sont publiés en moins de dix minutes, 70 % des fiches IA demandent seulement des corrections légères, 60 % des boutiques sont partagées, moins de 5 % des articles vendus restent disponibles, et tous les contrôles critiques de confidentialité/modération sont opérationnels.

