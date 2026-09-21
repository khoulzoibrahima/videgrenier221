# User Profile Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the authenticated profile flow, Senegal phone-format validation, Cloudinary avatar management, connected header, and seller-route protection.

**Architecture:** Firebase remains the identity provider. Spring Boot verifies Firebase tokens, owns profile validation and Cloudinary signatures, and stores profile data in PostgreSQL. Next.js holds the client session, uploads signed images directly to Cloudinary, and routes incomplete profiles through `/profile/setup`.

**Tech Stack:** Next.js 16, React 19, Firebase Auth 12, Spring Boot 4, PostgreSQL 17, Flyway, Cloudinary Java SDK `cloudinary-http5:2.4.0`, Vitest, Testing Library, JUnit/MockMvc.

**Spec:** `docs/superpowers/specs/2026-09-21-user-profile-design.md`

## Global Constraints

- Required profile fields are display name, Senegal WhatsApp number, and city/commune.
- Phone validation checks format only: exactly nine national digits, persisted as `+221XXXXXXXXX`; no OTP in the MVP.
- Avatar input accepts JPG, PNG, or WebP up to 2 MiB.
- Cloudinary secrets exist only in Spring environment variables.
- Incomplete profiles cannot enter seller routes.
- Every production change follows red-green-refactor and ends with a focused commit.

---

### Task 1: Persist complete profile data

**Files:**
- Create: `apps/api/src/main/resources/db/migration/V2__user_profiles.sql`
- Modify: `apps/api/src/main/java/sn/vg221/auth/CurrentUserResponse.java`
- Modify: `apps/api/src/main/java/sn/vg221/auth/CurrentUserService.java`
- Modify: `apps/api/src/test/java/sn/vg221/db/MigrationTest.java`
- Modify: `apps/api/src/test/java/sn/vg221/auth/AuthApiTest.java`

**Interfaces:**
- Produces: `CurrentUserResponse(..., String whatsappNumber, String city, String avatarPublicId, boolean profileComplete)`.
- Produces database columns: `google_avatar_url`, `whatsapp_number`, `city`, `avatar_public_id`, `profile_completed_at`.

- [ ] **Step 1: Write the migration and response-contract tests**

Add assertions that the new columns exist and that a first Google synchronization returns `profileComplete: false` while preserving the Google avatar separately.

```java
mvc.perform(get("/api/v1/me").header("Authorization", "Bearer valid-token"))
    .andExpect(status().isOk())
    .andExpect(jsonPath("$.profileComplete").value(false))
    .andExpect(jsonPath("$.googleAvatarUrl").value("https://google.test/awa.jpg"));
```

- [ ] **Step 2: Run the focused tests and confirm RED**

Run: `mvn -f apps/api/pom.xml test -Dtest=MigrationTest,AuthApiTest`

Expected: compilation or JSON assertion failure because the fields do not exist.

- [ ] **Step 3: Add the migration and expand the response**

```sql
alter table users add column google_avatar_url varchar(1000);
alter table users add column whatsapp_number varchar(13);
alter table users add column city varchar(100);
alter table users add column avatar_public_id varchar(300);
alter table users add column profile_completed_at timestamp with time zone;
update users set google_avatar_url = avatar_url where avatar_url is not null;
```

Update synchronization so Google refreshes `google_avatar_url`, but never overwrites a custom `avatar_url`. Derive `profileComplete` from `profile_completed_at is not null`.

- [ ] **Step 4: Run focused tests and confirm GREEN**

Run: `mvn -f apps/api/pom.xml test -Dtest=MigrationTest,AuthApiTest`

Expected: all selected tests pass.

- [ ] **Step 5: Commit**

```bash
git add apps/api/src/main/resources/db/migration/V2__user_profiles.sql apps/api/src/main/java/sn/vg221/auth apps/api/src/test
git commit -m "feat: persist user profile state"
```

### Task 2: Validate and update profiles

**Files:**
- Create: `apps/api/src/main/java/sn/vg221/profile/ProfileUpdateRequest.java`
- Create: `apps/api/src/main/java/sn/vg221/profile/SenegalPhoneNumber.java`
- Create: `apps/api/src/main/java/sn/vg221/profile/ProfileService.java`
- Create: `apps/api/src/main/java/sn/vg221/profile/ProfileController.java`
- Create: `apps/api/src/test/java/sn/vg221/profile/ProfileApiTest.java`

**Interfaces:**
- Consumes: authenticated `FirebaseIdentity` and expanded `CurrentUserResponse` from Task 1.
- Produces: `PUT /api/v1/me/profile` accepting `{displayName, whatsappNumber, city, avatarUrl?, avatarPublicId?}`.
- Produces: `SenegalPhoneNumber.normalize(String): String` returning `+221` plus nine digits or throwing `IllegalArgumentException`.

- [ ] **Step 1: Write failing phone and endpoint tests**

Cover `77 123 45 67`, `771234567`, `+221771234567`, too-short input, and foreign country codes. Assert the endpoint persists `+221771234567` and returns `profileComplete: true`.

```java
assertThat(SenegalPhoneNumber.normalize("77 123 45 67")).isEqualTo("+221771234567");
assertThatThrownBy(() -> SenegalPhoneNumber.normalize("+33612345678"))
    .isInstanceOf(IllegalArgumentException.class);
```

- [ ] **Step 2: Run tests and confirm RED**

Run: `mvn -f apps/api/pom.xml test -Dtest=ProfileApiTest`

Expected: FAIL because profile classes and endpoint are missing.

- [ ] **Step 3: Implement normalization and profile update**

Normalize by removing spaces, dots, dashes, and parentheses; strip a leading `+221` or `221`; then require `\d{9}`. Validate trimmed display name length `2..120` and city length `2..100`. Store `profile_completed_at` on a valid update and return the expanded current-user response.

- [ ] **Step 4: Run tests and confirm GREEN**

Run: `mvn -f apps/api/pom.xml test -Dtest=ProfileApiTest,AuthApiTest`

Expected: all selected tests pass.

- [ ] **Step 5: Commit**

```bash
git add apps/api/src/main/java/sn/vg221/profile apps/api/src/test/java/sn/vg221/profile
git commit -m "feat: add Senegal user profile API"
```

### Task 3: Sign and remove Cloudinary avatars

**Files:**
- Modify: `apps/api/pom.xml`
- Modify: `apps/api/src/main/resources/application.yml`
- Modify: `apps/api/.env.example`
- Create: `apps/api/src/main/java/sn/vg221/media/CloudinaryConfiguration.java`
- Create: `apps/api/src/main/java/sn/vg221/media/AvatarSignatureResponse.java`
- Create: `apps/api/src/main/java/sn/vg221/media/AvatarService.java`
- Create: `apps/api/src/main/java/sn/vg221/media/AvatarController.java`
- Create: `apps/api/src/test/java/sn/vg221/media/AvatarApiTest.java`

**Interfaces:**
- Consumes: authenticated Firebase UID.
- Produces: `POST /api/v1/me/avatar-signature` returning `{cloudName, apiKey, timestamp, signature, publicId, folder}`.
- Produces: `DELETE /api/v1/me/avatar` returning the updated current-user response.

- [ ] **Step 1: Write failing signature and deletion tests**

Assert unauthenticated calls return 401, `publicId` is bound to the Firebase UID, the signature excludes the API secret, and deletion restores `google_avatar_url`.

```java
mvc.perform(post("/api/v1/me/avatar-signature").header("Authorization", "Bearer valid-token"))
    .andExpect(status().isOk())
    .andExpect(jsonPath("$.folder").value("videgrenier221/users/google-awa"))
    .andExpect(jsonPath("$.publicId").value("avatar"))
    .andExpect(jsonPath("$.apiSecret").doesNotExist());
```

- [ ] **Step 2: Run tests and confirm RED**

Run: `mvn -f apps/api/pom.xml test -Dtest=AvatarApiTest`

Expected: FAIL because the endpoints do not exist.

- [ ] **Step 3: Add Cloudinary SDK and configuration**

Add `com.cloudinary:cloudinary-http5:2.4.0`. Bind `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`. Use `Cloudinary.apiSignRequest` with `timestamp`, `public_id`, `folder`, `overwrite=true`, and `transformation=c_fill,g_face,w_512,h_512,q_auto,f_auto`.

- [ ] **Step 4: Implement signature and deletion behavior**

The server selects every signed parameter. Profile updates accept an uploaded avatar only when its returned public ID equals `videgrenier221/users/{authenticatedUid}/avatar` and its HTTPS URL belongs to the configured Cloudinary cloud. Deletion loads `avatar_public_id` from the authenticated user, calls `cloudinary.uploader().destroy`, then restores `avatar_url = google_avatar_url` and clears `avatar_public_id`.

- [ ] **Step 5: Run tests and confirm GREEN**

Run: `mvn -f apps/api/pom.xml test -Dtest=AvatarApiTest,ProfileApiTest`

Expected: all selected tests pass.

- [ ] **Step 6: Commit**

```bash
git add apps/api/pom.xml apps/api/.env.example apps/api/src/main/resources/application.yml apps/api/src/main/java/sn/vg221/media apps/api/src/test/java/sn/vg221/media
git commit -m "feat: secure Cloudinary avatar operations"
```

### Task 4: Provide a global authenticated session

**Files:**
- Modify: `apps/web/lib/firebase.ts`
- Create: `apps/web/lib/api.ts`
- Create: `apps/web/lib/session.tsx`
- Create: `apps/web/lib/session.test.tsx`
- Modify: `apps/web/app/layout.tsx`
- Modify: `apps/web/app/login/page.tsx`
- Modify: `apps/web/app/login/page.test.tsx`

**Interfaces:**
- Consumes: `GET /api/v1/me` response from Task 1.
- Produces: `SessionProvider` and `useSession()` returning `{status, firebaseUser, profile, refreshProfile, signOut}`.
- Produces: `authenticatedFetch(path, init)` that adds the current Firebase ID token.

- [ ] **Step 1: Write failing session tests**

Test the three states: loading placeholder, disconnected login action, connected profile. Test that first login routes incomplete users to `/profile/setup` and complete users to their intended destination.

```tsx
expect(result.current.status).toBe("loading");
await waitFor(() => expect(result.current.profile?.profileComplete).toBe(false));
```

- [ ] **Step 2: Run tests and confirm RED**

Run: `cd apps/web && node_modules/.bin/vitest run lib/session.test.tsx app/login/page.test.tsx`

Expected: FAIL because the provider and hook are missing.

- [ ] **Step 3: Implement token-aware API client and provider**

Use Firebase `onAuthStateChanged`. Fetch `/api/v1/me` only after a user exists. Keep the loading state until both Firebase and Spring resolve. Make `signInWithGoogle` return the Firebase user rather than directly calling the API, and let the provider own profile synchronization.

- [ ] **Step 4: Wrap the app and update login routing**

Wrap `layout.tsx` children in `SessionProvider`. After popup success, call `refreshProfile`; route to `/profile/setup` when incomplete, otherwise route to the sanitized `next` query parameter or `/`.

- [ ] **Step 5: Run tests and confirm GREEN**

Run: `cd apps/web && node_modules/.bin/vitest run lib/session.test.tsx app/login/page.test.tsx`

Expected: all selected tests pass.

- [ ] **Step 6: Commit**

```bash
git add apps/web/lib apps/web/app/layout.tsx apps/web/app/login
git commit -m "feat: add global Firebase session"
```

### Task 5: Build profile setup and avatar upload

**Files:**
- Create: `apps/web/lib/profile.ts`
- Create: `apps/web/app/profile/setup/page.tsx`
- Create: `apps/web/app/profile/setup/page.test.tsx`
- Create: `apps/web/app/profile/page.tsx`
- Create: `apps/web/components/avatar-editor.tsx`
- Create: `apps/web/components/avatar-editor.test.tsx`
- Modify: `apps/web/app/globals.css`
- Modify: `apps/web/.env.example`

**Interfaces:**
- Consumes: `authenticatedFetch`, `useSession`, profile-update endpoint, and avatar-signature endpoint.
- Produces: `validateAvatar(file): string | null` and `uploadAvatar(file, signature): Promise<{secureUrl, publicId}>`.

- [ ] **Step 1: Write failing form and file-validation tests**

Test required fields, normalization feedback, JPG/PNG/WebP acceptance, rejection above `2 * 1024 * 1024`, preview, successful upload, and preservation of form fields when upload fails.

```tsx
const oversized = new File([new Uint8Array(2 * 1024 * 1024 + 1)], "awa.png", {type: "image/png"});
expect(validateAvatar(oversized)).toBe("Choisissez une photo de moins de 2 Mo.");
```

- [ ] **Step 2: Run tests and confirm RED**

Run: `cd apps/web && node_modules/.bin/vitest run app/profile/setup/page.test.tsx components/avatar-editor.test.tsx`

Expected: FAIL because pages and avatar editor are missing.

- [ ] **Step 3: Implement avatar client**

Request a signature from Spring, construct `FormData` with exactly the signed parameters, upload to `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, and return `secure_url` plus `public_id`. Never read an API secret in the browser.

- [ ] **Step 4: Implement setup and edit forms**

Use accessible labels and simple French copy. Prefix the phone input visually with `+221`. Submit the profile only after an optional avatar upload succeeds. On success call `refreshProfile()` and route to sanitized `next` or `/`.

- [ ] **Step 5: Add responsive styles**

Use a single-column mobile form, 56 px minimum action height, visible validation messages, and a circular 112 px avatar preview. Reuse existing brand colors and typefaces.

- [ ] **Step 6: Run tests and confirm GREEN**

Run: `cd apps/web && node_modules/.bin/vitest run app/profile/setup/page.test.tsx components/avatar-editor.test.tsx`

Expected: all selected tests pass.

- [ ] **Step 7: Commit**

```bash
git add apps/web/lib/profile.ts apps/web/app/profile apps/web/components apps/web/app/globals.css apps/web/.env.example
git commit -m "feat: add user profile setup"
```

### Task 6: Show connected identity and protect seller routes

**Files:**
- Create: `apps/web/components/site-header.tsx`
- Create: `apps/web/components/site-header.test.tsx`
- Create: `apps/web/components/require-complete-profile.tsx`
- Create: `apps/web/components/require-complete-profile.test.tsx`
- Modify: `apps/web/app/page.tsx`
- Modify: `apps/web/app/page.test.tsx`
- Create: `apps/web/app/sell/room/page.tsx`
- Modify: `apps/web/app/globals.css`

**Interfaces:**
- Consumes: `useSession()` from Task 4.
- Produces: shared `SiteHeader` and `RequireCompleteProfile`.
- Produces: temporary authenticated `/sell/room` shell ready for its own future feature spec.

- [ ] **Step 1: Write failing header and guard tests**

Assert disconnected state links to `/login`, connected state shows first name/avatar and actions « Mon profil »/« Déconnexion », and incomplete seller access redirects to `/profile/setup?next=/sell/room`.

```tsx
expect(screen.getByRole("link", {name: "Mon profil"})).toHaveAttribute("href", "/profile");
expect(replace).toHaveBeenCalledWith("/profile/setup?next=%2Fsell%2Froom");
```

- [ ] **Step 2: Run tests and confirm RED**

Run: `cd apps/web && node_modules/.bin/vitest run components/site-header.test.tsx components/require-complete-profile.test.tsx`

Expected: FAIL because shared components do not exist.

- [ ] **Step 3: Extract and implement the header**

Move existing brand, search, nav, and actions into `SiteHeader`. Render a neutral circular skeleton while loading. Render the profile menu only when connected, and call Firebase sign-out through the session provider.

- [ ] **Step 4: Implement the seller guard and room placeholder**

The guard waits for session resolution, sends disconnected users to `/login?next=/sell/room`, sends incomplete users to profile setup, and renders children only for complete profiles. The room page says « Photographier une pièce » and contains no upload functionality until the separate room-capture spec is approved.

- [ ] **Step 5: Run tests and confirm GREEN**

Run: `cd apps/web && node_modules/.bin/vitest run components/site-header.test.tsx components/require-complete-profile.test.tsx app/page.test.tsx`

Expected: all selected tests pass.

- [ ] **Step 6: Commit**

```bash
git add apps/web/components apps/web/app/page.tsx apps/web/app/page.test.tsx apps/web/app/sell/room apps/web/app/globals.css
git commit -m "feat: show connected profile and guard selling"
```

### Task 7: Verify the complete profile feature

**Files:**
- Modify only files required to fix failures found by the commands below.

**Interfaces:**
- Consumes all previous tasks.
- Produces a verified feature and a clean worktree.

- [ ] **Step 1: Run the full backend suite**

Run: `mvn -f apps/api/pom.xml test`

Expected: all backend tests pass with zero failures.

- [ ] **Step 2: Run all frontend checks**

Run: `cd apps/web && node_modules/.bin/vitest run && node_modules/.bin/eslint . && node_modules/.bin/next build`

Expected: tests pass, lint has zero warnings/errors, and production build succeeds.

- [ ] **Step 3: Verify locally with real services**

Start PostgreSQL with `docker compose up -d postgres`. Start Spring with Firebase and Cloudinary environment variables. Verify: Google login → setup redirect → valid profile save → connected header → avatar replacement → page reload retains profile → avatar deletion restores Google photo → `/sell/room` opens only for complete profiles.

- [ ] **Step 4: Check repository hygiene**

Run: `git diff --check && git status --short`

Expected: no whitespace errors and only intentional files are modified. Confirm no JSON service-account file or Cloudinary secret is tracked.

- [ ] **Step 5: Commit verification fixes if needed**

```bash
git add <only-the-files-fixed-during-verification>
git commit -m "fix: complete profile flow verification"
```
