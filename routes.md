# API Routes

This file documents the backend endpoints and example outputs so the frontend can fetch data consistently.

## Base URL

For local development, the API is typically served from:

```text
http://localhost:5000
```

If you deploy the backend, replace this with your production API URL.

## Frontend Fetch Pattern

For public data:

```js
const response = await fetch(`${API_URL}/api/news`);
const data = await response.json();
```

For protected routes:

```js
const response = await fetch(`${API_URL}/api/categories`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
  },
  body: formData,
});
```

For routes that upload files, use `FormData` and do not set `Content-Type` manually.

## Auth Routes

### POST `/api/auth/login`

Request body:

```json
{
  "email": "admin@example.com",
  "password": "your-password"
}
```

Example output:

```json
{
  "id": 1,
  "username": "Admin",
  "email": "admin@example.com",
  "accessToken": "eyJhbGciOi...",
  "refreshToken": "eyJhbGciOi..."
}
```

### POST `/api/auth/refresh`

Request body:

```json
{
  "refreshToken": "eyJhbGciOi..."
}
```

Example output:

```json
{
  "accessToken": "eyJhbGciOi...",
  "refreshToken": "eyJhbGciOi..."
}
```

## Banner Routes

### GET `/api/banners`

Returns all banners.

Example output:

```json
[
  {
    "id": 1,
    "page_name": "home",
    "title": "Build Better Digital Products",
    "subtitle": "Design, development, and automation",
    "media_url": "/uploads/banners/home-banner.jpg",
    "media_type": "image"
  }
]
```

### GET `/api/banners/:page`

Example output:

```json
{
  "id": 1,
  "page_name": "home",
  "title": "Build Better Digital Products",
  "subtitle": "Design, development, and automation",
  "media_url": "/uploads/banners/home-banner.jpg",
  "media_type": "image"
}
```

### POST `/api/banners`

Protected. Send `multipart/form-data`.

Fields:

```text
page_name
title
subtitle
media_type
media_url (optional if file is uploaded)
```

Example output:

```json
{
  "id": 2,
  "page_name": "about",
  "title": "About Us",
  "subtitle": "Who we are",
  "media_url": "/uploads/banners/about-banner.jpg",
  "media_type": "image"
}
```

### DELETE `/api/banners/:id`

Example output:

```json
{
  "message": "Banner removed"
}
```

## Category Routes

### GET `/api/categories`

Example output:

```json
[
  {
    "id": 1,
    "name": "Web Development"
  }
]
```

### POST `/api/categories`

Protected.

Request body:

```json
{
  "name": "UI/UX Design"
}
```

Example output:

```json
{
  "id": 2,
  "name": "UI/UX Design"
}
```

### PUT `/api/categories/:id`

Example output:

```json
{
  "id": "2",
  "name": "Brand Design"
}
```

### DELETE `/api/categories/:id`

Example output:

```json
{
  "message": "Category removed"
}
```

## Expertise Routes

### GET `/api/expertise`

Example output:

```json
[
  {
    "id": 1,
    "name": "Frontend Development",
    "description": "React, responsive UI, and modern interfaces",
    "icon_url": "/uploads/expertise/frontend.svg"
  }
]
```

### POST `/api/expertise`

Protected. Send `multipart/form-data` with `icon_url` file.

Example output:

```json
{
  "id": 3,
  "name": "DevOps",
  "description": "Deployment, automation, and cloud workflows",
  "icon_url": "/uploads/expertise/devops.svg"
}
```

### PUT `/api/expertise/:id`

Example output:

```json
{
  "id": "3",
  "name": "DevOps",
  "description": "Deployment, automation, and cloud workflows",
  "icon_url": "/uploads/expertise/devops.svg"
}
```

### DELETE `/api/expertise/:id`

Example output:

```json
{
  "message": "Expertise removed"
}
```

## Client Routes

### GET `/api/clients`

Example output:

```json
[
  {
    "id": 1,
    "name": "StarkCorp",
    "logo_url": "/uploads/clients/starkcorp.svg",
    "external_link": "https://starkcorp.example"
  }
]
```

### POST `/api/clients`

Protected. Send `multipart/form-data` with `logo_url` file.

Example output:

```json
{
  "id": 2,
  "name": "Vortex Systems",
  "logo_url": "/uploads/clients/vortex-systems.png",
  "external_link": "https://vortex.example"
}
```

### PUT `/api/clients/:id`

Example output:

```json
{
  "id": "2",
  "name": "Vortex Systems",
  "logo_url": "/uploads/clients/vortex-systems.png",
  "external_link": "https://vortex.example"
}
```

### DELETE `/api/clients/:id`

Example output:

```json
{
  "message": "Client removed"
}
```

## Product Routes

### GET `/api/products`

Returns products with `category_name`.

Example output:

```json
[
  {
    "id": 1,
    "name": "Mobile App Dashboard",
    "description": "A dashboard for monitoring operations",
    "image_url": "/uploads/products/dashboard.png",
    "external_link": "https://example.com/demo",
    "categoryId": 1,
    "category_name": "Web Development"
  }
]
```

### POST `/api/products`

Protected. Send `multipart/form-data` with `image_url` file.

Example output:

```json
{
  "id": 2,
  "name": "Landing Page Kit",
  "description": "Reusable marketing sections",
  "image_url": "/uploads/products/landing-page.png",
  "external_link": "https://example.com/kit",
  "categoryId": 1
}
```

### PUT `/api/products/:id`

Example output:

```json
{
  "id": "2",
  "name": "Landing Page Kit",
  "description": "Reusable marketing sections",
  "image_url": "/uploads/products/landing-page.png",
  "categoryId": 1
}
```

### DELETE `/api/products/:id`

Example output:

```json
{
  "message": "Product removed"
}
```

## Work Routes

### GET `/api/works`

Returns works with `category_name`.

Example output:

```json
[
  {
    "id": 1,
    "title": "Company Website Redesign",
    "description": "Full redesign and frontend rebuild",
    "client": "Havor Client",
    "year": 2025,
    "image_url": "/uploads/works/redesign.jpg",
    "categoryId": 1,
    "category_name": "Web Development"
  }
]
```

### POST `/api/works`

Protected. Send `multipart/form-data` with `image_url` file.

Example output:

```json
{
  "id": 2,
  "title": "POS System",
  "description": "Point-of-sale platform",
  "client": "Retail Partner",
  "year": 2026,
  "image_url": "/uploads/works/pos.png",
  "categoryId": 2
}
```

### PUT `/api/works/:id`

Example output:

```json
{
  "id": "2",
  "title": "POS System",
  "description": "Point-of-sale platform",
  "client": "Retail Partner",
  "year": 2026,
  "image_url": "/uploads/works/pos.png",
  "categoryId": 2
}
```

### DELETE `/api/works/:id`

Example output:

```json
{
  "message": "Work entry removed"
}
```

## News Routes

### GET `/api/news`

Example output:

```json
[
  {
    "id": 1,
    "title": "New Office Launch",
    "slug": "new-office-launch",
    "content": "We opened a new office...",
    "category": "Company",
    "is_published": 1,
    "image_url": "/uploads/news/office.jpg"
  }
]
```

### GET `/api/news/:slug`

Example output:

```json
{
  "id": 1,
  "title": "New Office Launch",
  "slug": "new-office-launch",
  "content": "We opened a new office...",
  "category": "Company",
  "is_published": 1,
  "image_url": "/uploads/news/office.jpg"
}
```

### POST `/api/news`

Protected. Send `multipart/form-data` with `image_url` file.

Example output:

```json
{
  "id": 2,
  "title": "Product Update",
  "slug": "product-update",
  "content": "We improved the dashboard...",
  "category": "Product",
  "is_published": true,
  "image_url": "/uploads/news/update.jpg"
}
```

### PUT `/api/news/:id`

Example output:

```json
{
  "id": "2",
  "title": "Product Update",
  "slug": "product-update",
  "content": "We improved the dashboard...",
  "category": "Product",
  "is_published": true,
  "image_url": "/uploads/news/update.jpg"
}
```

### DELETE `/api/news/:id`

Example output:

```json
{
  "message": "News removed"
}
```

## Contact Routes

### POST `/api/contact`

Public. Used by the frontend contact form.

Request body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Project Inquiry",
  "message": "I want to discuss a website project."
}
```

Example output:

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Project Inquiry",
  "message": "I want to discuss a website project."
}
```

### GET `/api/contact`

Protected. Returns all messages for admin.

Example output:

```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Project Inquiry",
    "message": "I want to discuss a website project.",
    "is_read": 0
  }
]
```

### PUT `/api/contact/:id/read`

Example output:

```json
{
  "message": "Message marked as read"
}
```

### DELETE `/api/contact/:id`

Example output:

```json
{
  "message": "Message removed"
}
```

## Notes For Frontend

- Public endpoints can be called directly from the browser.
- Protected endpoints need a valid `Authorization: Bearer <token>` header.
- File upload routes use `multipart/form-data` and `FormData` on the frontend.
- Image and file URLs are returned as relative paths like `/uploads/news/file.jpg`.
- The frontend should prepend the backend host before rendering uploaded assets.
