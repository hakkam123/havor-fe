# Tahap 1: Build image
FROM node:20-alpine AS builder

WORKDIR /app

# Menyalin file konfigurasi package
COPY package*.json ./

# Install seluruh dependency termasuk devDependencies untuk keperluan proses build
RUN npm ci

# Menyalin seluruh kode sumber
COPY . .

# Menjalankan proses build aplikasi Nuxt
# Hasil build secara default akan berada di dalam folder ".output"
RUN npm run build

# Tahap 2: Production image yang lebih ringan
FROM node:20-alpine

WORKDIR /app

# Menyalin hasil build dari tahap "builder"
COPY --from=builder /app/.output ./.output

# Menentukan port yang akan diekspos (Nuxt default ke 3000)
EXPOSE 3000

# Menentukan Environment Variables untuk production
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

# Menggunakan user 'node' non-root demi keamanan
USER node

# Menjalankan server aplikasi Nuxt yang sudah di-build
CMD ["node", ".output/server/index.mjs"]
