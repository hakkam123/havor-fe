# Netlify Deploy Fix Notes

## Penyebab deploy gagal
Deploy gagal bukan karena build Nuxt/Vite, tetapi karena Netlify Secrets Scanning mendeteksi false positive pada build output. Log menunjukkan build sudah selesai ("Build complete"), lalu deploy diblokir oleh Secrets Scanning.

## Public environment variables yang aman di frontend
Berikut ini aman dan memang perlu untuk frontend:

- NUXT_PUBLIC_API_BASE
- NUXT_PUBLIC_SITE_URL
- VITE_API_BASE_URL

Contoh nilai public URL:

- https://tplnext.com/havor
- https://havorsmarta.netlify.app

## Environment variable backend yang tidak boleh ada di frontend
Jangan pernah menaruh ini di Netlify frontend:

- OBJECT_STORAGE_ACCESS_KEY_ID
- OBJECT_STORAGE_SECRET_ACCESS_KEY
- GMAIL_APP_PASSWORD
- DB_PASSWORD
- JWT_SECRET

## Catatan untuk testing (E2E)
File test menggunakan env berikut hanya untuk testing lokal/CI, bukan untuk production Netlify:

- E2E_ADMIN_PASSWORD
- QA_ADMIN_PASSWORD

Tidak ada value hardcoded di repo. Jangan set env ini di Netlify frontend production.

## Langkah manual di Netlify Dashboard
1. Buka Site configuration.
2. Masuk ke Environment variables.
3. Pastikan hanya public URL env yang ada di frontend.
4. Pastikan public URL env tidak ditandai sebagai secret/sensitive.
5. Tambahkan atau pastikan value berikut:
   - SECRETS_SCAN_OMIT_KEYS=VITE_API_BASE_URL,NUXT_PUBLIC_API_BASE,NUXT_PUBLIC_SITE_URL
   - SECRETS_SCAN_OMIT_PATHS=dist/**,.netlify/functions-internal/**
   - SECRETS_SCAN_SMART_DETECTION_OMIT_VALUES=https://tplnext.com/havor,https://havorsmarta.netlify.app
6. Trigger deploy ulang dengan Clear cache and deploy site.

Catatan: jangan simpan SECRETS_SCAN_* di netlify.toml karena Netlify bisa menganggapnya sebagai secret env var dan memblokir deploy saat value-nya ditemukan di repo.

## Opsi terakhir jika masih gagal
Jika masih terjadi false positive, matikan smart detection saja (bukan seluruh secret scanning):

- SECRETS_SCAN_SMART_DETECTION_ENABLED=false

Jangan gunakan SECRETS_SCAN_ENABLED=false kecuali benar-benar darurat karena itu mematikan seluruh secrets scanning.
