# CRUD Problem Analysis After Backend Was Started

## Current conclusion

The backend is now reachable, so the main problem is **not** "backend is offline" anymore.

The real issues are:

1. Some frontend routes do not match the backend routes.
2. Several admin pages are still mock UI and do not execute real CRUD.
3. Write operations require authentication, so create/update/delete will return `401` unless login is working and the token is present.

## What I tested

I checked these backend endpoints from local:

- `GET /api/products` -> `200`
- `GET /api/categories` -> `200`
- `GET /api/news` -> `200`
- `GET /api/works` -> `200`
- `GET /api/banners` -> `200`
- `GET /api/expertise` -> `200`

I also checked some frontend-expected routes:

- `GET /api/auth/me` -> `404`
- `GET /api/expertises` -> `404`
- `GET /api/hero_banners` -> `404`

I tested write access too:

- `POST /api/categories` -> `401`
- `PUT /api/categories/1` -> `401`
- `DELETE /api/categories/1` -> `401`

So the backend is alive, but protected CRUD needs auth.

## Problem 1: Route mismatch between frontend and backend

### 1. Expertises

Frontend:

- `app/pages/expertises/index.vue`
- uses `useCollection('expertises')`

Backend that responds:

- `/api/expertise`

Problem:

- Frontend calls `expertises`
- Backend exposes `expertise`

Effect:

- This page will fail to load data even though the backend is running.

### 2. Banners

Frontend page:

- `app/pages/banners/index.vue`

Backend that responds:

- `/api/banners`

Problem:

- The page is still hard-coded and does not call the backend.
- Earlier assumption about `hero_banners` came from the database naming, but the actual reachable API route is `banners`.

Effect:

- Backend has data, but the page is not using it yet.

### 3. Auth current-user endpoint

Frontend expects:

- `/api/auth/me`

File:

- `app/stores/auth.ts`

Problem:

- `GET /api/auth/me` returns `404`

Important note:

- I searched this frontend and `fetchUser()` is not currently used anywhere.
- So this mismatch is real, but it may not be the main reason CRUD fails right now.

## Problem 2: Several pages are still UI mockups

These pages are not fully wired to backend CRUD yet.

### 1. News page

File:

- `app/pages/news/index.vue`

Problems:

- Uses `dummyData`
- `saveForm()` only closes the modal
- Delete is not connected to API
- File upload is only local preview

Effect:

- News CRUD is still fake UI.

### 2. Banners page

File:

- `app/pages/banners/index.vue`

Problems:

- Uses hard-coded `const banners = [...]`
- Add, edit, delete buttons are not connected

Effect:

- Banner CRUD is not implemented in the frontend page.

### 3. Works page

File:

- `app/pages/works/index.vue`

Problems:

- Uses hard-coded `const works = [...]`
- No composable/API wiring for add/edit/delete

Effect:

- Works CRUD is still mock UI.

### 4. Inbox page

File:

- `app/pages/inbox/index.vue`

Problems:

- Uses hard-coded `messages`
- `markAsRead()` only changes local state
- Delete is not connected

Effect:

- Inbox is also still mock UI.

### 5. Expertises page

File:

- `app/pages/expertises/index.vue`

Problems:

- Only fetch is attempted
- Add/edit/delete buttons are not wired
- Current fetch route is wrong: `expertises` vs backend `expertise`

Effect:

- This page is both incomplete and pointed to the wrong endpoint.

### 6. Categories page

File:

- `app/pages/categories/index.vue`

Problems:

- Create is wired
- Delete is wired
- Edit button exists but update is not wired

Related composable:

- `app/composables/useCategories.ts`

Note:

- `updateCategory(...)` already exists in the composable, but the page never uses it.

Effect:

- Categories CRUD is only partially complete.

## Problem 3: Auth is required for write operations

The backend returns `401 Unauthorized` for create/update/delete when no token is sent.

That means CRUD will only work if:

1. login succeeds,
2. frontend stores the access token,
3. `Authorization: Bearer <token>` is attached,
4. the user is allowed to perform the action.

The frontend already tries to send the bearer token in:

- `app/composables/useApi.ts`

So if CRUD still fails after login, the next place to inspect is the login/token flow.

## CORS check

I also checked CORS for `http://localhost:3000` -> `http://localhost:5000`.

Result:

- Preflight `OPTIONS` responds successfully
- `Access-Control-Allow-Origin` is `*`
- allowed methods include `GET, HEAD, PUT, PATCH, POST, DELETE`

So CORS does not look like the main blocker here.

## What is already okay

These parts look healthy enough from the API side:

- backend is reachable on `localhost:5000`
- `products`, `categories`, `news`, `works`, `banners` endpoints respond
- write routes are protected properly with `401` when unauthenticated

## Most likely real reason you "still can't do CRUD"

The strongest causes now are:

1. You are trying CRUD on pages that are still mock UI.
2. Some frontend endpoints do not match backend routes.
3. If you are testing create/update/delete, you may not be authenticated yet.

## Priority fixes

If we want this project to actually work, the best order is:

1. Fix endpoint mismatches
   - `expertises` -> `expertise`
   - check whether any other collection names differ from backend naming
2. Finish the incomplete pages
   - news
   - banners
   - works
   - inbox
   - expertises
   - category edit
3. Verify login flow end-to-end
   - make sure login returns token
   - make sure token is stored in cookie
   - make sure protected requests include bearer token

## Final answer

Now that your backend is running, the problem is mostly in the **frontend integration layer**, not in `tsconfig.json`.

The backend is reachable, but:

- some frontend routes are wrong,
- several CRUD pages are still only mockups,
- and write actions require authentication.
