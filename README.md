# KindSpace

Platform konseling sebaya untuk mahasiswa. Mahasiswa bisa membuat janji dengan konselor sebaya (boleh anonim), dan setiap janji otomatis tercatat dan diberi notifikasi lewat n8n.

## Fitur
- Daftar konselor sebaya dan pencarian berdasarkan topik
- Login tiga role: mahasiswa, konselor, dan admin
- Booking janji dengan kode booking, mode anonim atau terbuka
- Dashboard per role: mahasiswa melihat janjinya, konselor mengelola janji yang masuk, admin mengelola semuanya
- Mood check-in harian dengan grafik 7 hari
- Latihan napas 4-7-8 dan tombol bantuan darurat
- Maskot interaktif bernama Kindy
- Otomasi n8n: email konfirmasi dan pencatatan ke Google Sheets

## Teknologi
React, Vite, Tailwind CSS, Supabase (database, autentikasi, RLS), n8n (Docker), Google Sheets, Gmail, Vercel

## Menjalankan di lokal
1. `npm install`
2. Salin `.env.example` menjadi `.env`, lalu isi nilainya
3. `npm run dev`

## Catatan
KindSpace adalah teman cerita sebaya, bukan pengganti tenaga profesional. Dalam keadaan darurat, hubungi layanan darurat setempat.