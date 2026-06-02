# Frontend Implementation Notes

## 1. Ringkasan update frontend

Frontend diperbarui agar lebih siap untuk indexing Google, lebih baik untuk PageSpeed/Lighthouse, dan memiliki form publik yang benar-benar melakukan `fetch` ke endpoint backend yang disiapkan. Backend, database, dan Gmail tidak dikerjakan pada task ini.

## 2. File yang dibuat

- `.env.example`
- `FRONTEND_IMPLEMENTATION_NOTES.md`
- `app/plugins/section-reveal.server.ts`
- `app/services/api.ts`
- `app/services/careerService.ts`
- `app/services/contactService.ts`
- `public/sitemap.xml`

## 3. File yang diubah

- `nuxt.config.ts`
- `public/robots.txt`
- `tailwind.config.js`
- `app/assets/css/tailwind.css`
- `app/layouts/public.vue`
- `app/pages/index.vue`
- `app/pages/careers/index.vue`
- `app/pages/careers/[slug].vue`
- `app/components/CorporatePageHero.vue`
- `app/components/HeroSection.vue`
- `app/components/LandingHeroCarousel.vue`
- `app/components/MediaCard.vue`
- `app/components/PublicDetailHero.vue`
- `app/components/PublicFooter.vue`
- `app/components/PublicImageCta.vue`
- `app/components/PublicNavbar.vue`

## 4. Fungsi setiap file yang diubah

- `nuxt.config.ts`: mengaktifkan SSR, menambahkan meta dasar, memakai local font, dan default canonical site URL production.
- `public/robots.txt`: mengizinkan crawling dan menambahkan referensi sitemap.
- `tailwind.config.js` dan `app/assets/css/tailwind.css`: mengganti font publik ke local `Plus Jakarta Sans` untuk mengurangi dependency Google Fonts.
- `app/layouts/public.vue`: menambahkan structured data `Organization` schema.org.
- `app/pages/index.vue`: mengganti Contact CTA menjadi form submit fetch.
- `app/pages/careers/index.vue`: menambahkan form Careers dengan validasi, upload CV/portfolio, loading, success, dan error state.
- `app/pages/careers/[slug].vue`: mengarahkan Apply Now ke form Careers, bukan mailto.
- Komponen image publik: menambahkan `loading`, `decoding`, `fetchpriority`, atau dimensi logo untuk mengurangi blocking dan layout shift.

## 5. SEO improvement

- Tidak ada meta `noindex` yang ditambahkan untuk halaman publik.
- `usePageSeo` tetap menangani title, meta description, canonical, Open Graph, Twitter card, dan robots `index,follow`.
- SSR diaktifkan agar HTML dan meta lebih crawler-friendly.
- `sitemap.xml` dibuat untuk halaman publik utama.
- `robots.txt` mengarah ke sitemap production.
- Structured data `Organization` ditambahkan pada public layout.
- `NUXT_PUBLIC_SITE_URL` dibaca dari environment Netlify.

## 6. PageSpeed optimization

- External Google Fonts di public head diganti dengan local font file.
- Hero image diberi `fetchpriority="high"` dan `loading="eager"`.
- Image non-hero diberi `loading="lazy"` dan `decoding="async"`.
- Logo navbar/footer diberi dimensi eksplisit.
- SSR dan route-level Nuxt chunking tetap aktif untuk membantu crawler dan bundle loading.

## 7. Form Careers

Field:
- Nama lengkap
- Email
- Nomor telepon
- Alamat
- Posisi yang dilamar
- Pendidikan terakhir
- Pengalaman singkat
- LinkedIn / portfolio URL
- Pesan / cover letter singkat
- Upload Resume PDF

Validasi:
- Field wajib diisi.
- Email harus berformat valid.
- Resume wajib berupa PDF.
- Tombol disabled saat proses submit.
- Form tampil sebagai modal saat tombol Apply Now diklik.

Endpoint:
- `POST ${VITE_API_BASE_URL}/api/careers`

Success message:
- `Lamaran berhasil dikirim. Mohon tunggu sebentar, admin akan membalas melalui email.`

## 8. Form Contact Us

Field:
- Nama
- Email
- Subject
- Pesan

Validasi:
- Field wajib diisi.
- Email harus berformat valid.
- Tombol disabled saat proses submit.

Endpoint:
- `POST ${VITE_API_BASE_URL}/api/contact`

Success message:
- `Pesan berhasil dikirim. Mohon tunggu sebentar, admin akan membalas melalui email.`

## 9. Environment variables

Minimal:

```env
VITE_API_BASE_URL=http://localhost:3000
```

Production nanti:

```env
VITE_API_BASE_URL=https://your-backend-domain.com
NUXT_PUBLIC_SITE_URL=https://your-frontend-domain.com
```

## 10. Cara menjalankan frontend local

```bash
npm install
npm run dev
```

Default Nuxt local biasanya tersedia di `http://localhost:3000`.

## 11. Cara test form Careers

1. Buka `/careers`.
2. Submit form kosong dan pastikan muncul validasi field wajib.
3. Isi email invalid dan pastikan muncul validasi email.
4. Isi semua field valid.
5. Submit dan cek request menuju `${VITE_API_BASE_URL}/api/careers`.
6. Jika backend belum tersedia, form akan menampilkan error ramah.

## 12. Cara test form Contact Us

1. Buka `/`.
2. Scroll ke section Contact.
3. Submit form kosong dan pastikan muncul validasi field wajib.
4. Isi email invalid dan pastikan muncul validasi email.
5. Isi semua field valid.
6. Submit dan cek request menuju `${VITE_API_BASE_URL}/api/contact`.
7. Jika backend belum tersedia, form akan menampilkan error ramah.

## 13. Cara setup environment variable di Netlify

1. Buka Netlify dashboard.
2. Pilih site Havor.
3. Buka `Site configuration` atau `Build & deploy`.
4. Masuk ke `Environment variables`.
5. Tambahkan `VITE_API_BASE_URL` dengan URL backend production nanti.
6. Tambahkan atau pastikan `NUXT_PUBLIC_SITE_URL` berisi URL frontend production.
7. Redeploy site setelah env berubah.

## 14. Langkah manual Google Search Console

1. Buka Google Search Console.
2. Tambahkan property untuk URL frontend production.
3. Verifikasi ownership sesuai metode yang tersedia.
4. Submit sitemap dari URL frontend production.
5. Pastikan robots dapat diakses dari URL frontend production.

## 15. Langkah request indexing

1. Masuk ke Google Search Console.
2. Gunakan URL Inspection untuk halaman utama.
3. Klik `Request Indexing`.
4. Ulangi untuk halaman penting seperti `/about-us`, `/services`, `/projects`, `/products`, `/media-news`, dan `/careers`.

## 16. Catatan backend dan Gmail

Backend endpoint, database, dan konfigurasi Gmail belum dikerjakan pada task ini. Frontend sudah siap melakukan fetch ke endpoint yang diminta, dan akan menampilkan error ramah sampai backend tersedia.
