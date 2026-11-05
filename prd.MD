# Product Requirements Document (PRD)
**Project Name:** [PastiBertumbuh]  
**Document Version:** 1.0  
**Date:** 6 September 2026  
**Author:** [PT.Pasti Solusi Teknologi]  
**Status:** In Review / Draft  

---

## 1. Ringkasan Eksekutif (Executive Summary)
**Tujuan Produk:**  
Membangun platform SaaS (Software as a Service) manajemen acara dan undangan digital berbasis web yang berfokus pada kemudahan pengguna dan efisiensi. Platform ini memungkinkan pengguna membuat undangan interaktif dengan *dashboard* yang intuitif (seperti Memoris.id) dan dilengkapi fitur automasi pencatatan RSVP via WhatsApp bot menggunakan n8n.

**Masalah yang Diselesaikan:**  
- Pengguna (tuan rumah) membutuhkan cara cepat dan elegan untuk membuat dan menyebarkan undangan digital tanpa keahlian *coding*.
- Proses pencatatan RSVP manual sering kali merepotkan; sistem ini mengotomatiskan pencatatan kehadiran tamu, baik melalui web maupun pesan WhatsApp.
- Kebutuhan infrastruktur yang *cost-effective* di fase awal (MVP) tanpa mengorbankan skalabilitas dan keamanan data.

---

## 2. Target Pengguna (User Persona)
1. **Host/Pemilik Acara (User):** Individu, pasangan, atau *Event/Wedding Organizer* yang ingin membuat, mendistribusikan undangan digital, dan memantau kehadiran tamu.
2. **Tamu (Guest):** Penerima undangan (via tautan atau WhatsApp) yang akan melihat informasi detail acara dan memberikan konfirmasi kehadiran (RSVP).
3. **Super Admin:** Pemilik platform SaaS yang mengelola transaksi pengguna, pembaruan *template*, dan metrik performa sistem.

---

## 3. Metrik Kesuksesan (Success Metrics)
- **User Acquisition:** 1000 pendaftar baru dalam 3 bulan pertama rilis.
- **Activation Rate:** 60% pengguna baru berhasil membuat dan mempublikasikan minimal 1 acara.
- **Automation Success Rate:** 95% pesan RSVP via WhatsApp berhasil diproses oleh n8n dan masuk ke *database* tanpa *error*.
- **System Uptime:** 99.9% kelancaran akses pada *dashboard* utama dan halaman undangan tamu.

---

## 4. Ruang Lingkup & Fitur Inti (Scope & Features)

### 4.1. Modul Autentikasi & Akun
- Registrasi dan Login (Email & Password).
- Integrasi SSO (Google OAuth).
- Manajemen Profil, Reset Password, dan Verifikasi Email.

### 4.2. Dashboard Pengguna (Core SaaS App)
*Antarmuka utama bagi pengguna setelah login.*
- **Overview & Analitik:** Dasbor ringkasan menampilkan total tamu, statistik RSVP (Hadir/Tidak), dan ucapan yang masuk secara *real-time*.
- **Manajemen Acara (CRUD):** Kemampuan membuat multi-acara dalam satu akun (tergantung paket langganan).
- **Editor Undangan (Website Builder):**
  - Pemilihan *Template* / Tema visual.
  - Form input dinamis (Nama mempelai/penyelenggara, Tanggal, Waktu, Lokasi, Link Google Maps).
  - Manajemen Galeri (Unggah Foto/Video).
  - Pengaturan *Background Music*.
- **Manajemen Tamu (Guest Book):**
  - *Generate* tautan unik / QR Code per tamu.
  - Tabel RSVP interaktif dengan fitur ekspor ke CSV.

### 4.3. Automasi & Integrasi Bot WhatsApp (via n8n)
- **Webhook Integration:** Menerima dan memproses *webhook* dari WhatsApp API secara *real-time*.
- **Data Extraction & Pencatatan:** Bot merespons *chat* tamu, mengekstrak data kehadiran (misal: "Hadir, 2 orang"), dan mengirimkan data tersebut ke API *backend*.
- **Sinkronisasi Database:** *Workflow* n8n mem-POST data ke Supabase, mengubah status RSVP di *dashboard* pengguna secara instan tanpa intervensi manual.
- **Auto-Reply System:** Bot mengirimkan konfirmasi otomatis berupa detail lokasi, QR code *check-in*, atau ucapan terima kasih.

### 4.4. Fitur Monetisasi (Subscription/Billing)
- Pembatasan fitur (Freemium, Basic, Pro) berdasarkan kuota tamu, akses *template* premium, atau fitur WhatsApp Bot.
- Integrasi *Payment Gateway* lokal (Misal: Midtrans, Xendit, atau Tripay) untuk otomatisasi *upgrade* paket.

---

## 5. Alur Pengguna (User Flow)

### 5.1. Alur Utama (Host)
1. **Onboarding:** Mendarat di Landing Page (Scalev) -> Registrasi/Beli Paket -> Diarahkan ke Sub-domain Dashboard (Vercel).
2. **Pembuatan Proyek:** Klik "Buat Undangan" -> Pilih Tema -> Lengkapi Form Data -> *Preview*.
3. **Distribusi:** *Generate* link unik dari *dashboard* -> Bagikan ke tamu.

### 5.2. Alur RSVP via Web (Guest)
1. Tamu membuka tautan undangan.
2. Membaca informasi acara dan mengisi Form RSVP di halaman web.
3. Data tersimpan di *database*, status di *dashboard* Host otomatis terbarui.

### 5.3. Alur RSVP via WhatsApp Bot n8n (Guest)
1. **Trigger:** Tamu membalas pesan WhatsApp undangan (misal: "Saya akan hadir").
2. **Pemrosesan (n8n):** Webhook menangkap pesan masuk -> n8n memfilter dan memformat data JSON.
3. **Pencatatan:** n8n melakukan pemanggilan API ke Supabase untuk memperbarui baris data tamu yang bersangkutan.
4. **Output:** Status RSVP di *dashboard* Host berubah menjadi "Hadir", dan n8n memicu bot untuk membalas pesan WhatsApp ke tamu.

---

## 6. Kebutuhan Non-Fungsional & Infrastruktur

### 6.1. Tech Stack Frontend & Hosting
- **Landing Page & Sales Funnel:** **Scalev** (Fokus murni pada konversi, *marketing*, dan *checkout* langganan utama dengan *custom domain*, misal `domainkamu.com`).
- **Dashboard SaaS & Halaman Undangan:** **Next.js** atau **React.js**.
- **Frontend App Hosting:** **Vercel** atau **Netlify**. (Aplikasi SaaS di-host di sub-domain, misal `app.domainkamu.com`).
- **UI/UX:** Desain komponen menggunakan Figma. Halaman tamu wajib *Mobile-First*, responsif, dan ringan.

### 6.2. Tech Stack Backend, Database, & Auth
- **BaaS (Backend-as-a-Service):** **Supabase** (Primary Backend).
  - *Database:* PostgreSQL (Menyimpan data *User*, *Event*, *Guests*, *Transactions*).
  - *Auth:* Supabase Auth terintegrasi langsung dengan tabel *Users*.
  - *Storage:* Supabase Storage untuk menampung galeri foto undangan.
  - *API:* Menggunakan fitur *auto-generated* REST/GraphQL API dari Supabase untuk diakses oleh Next.js dan n8n.

### 6.3. Infrastruktur Automasi (n8n)
- **Deployment:** n8n *Self-hosted* di VPS (misal: DigitalOcean / Hetzner) untuk menekan biaya bulanan, atau menggunakan n8n Cloud.
- **Integrasi Pihak Ketiga:** API WhatsApp (Cloud API resmi dari Meta atau penyedia *unofficial* seperti WAAW/Baileys).

### 6.4. Keamanan & Performa
- **Row Level Security (RLS):** Dikonfigurasi ketat di Supabase agar *Host* hanya bisa mengakses dan mengubah data *Event* serta *Guest* miliknya sendiri.
- **Image Optimization:** Implementasi kompresi gambar (via Next/Image) untuk meminimalkan *bandwidth* dan mempercepat *loading* undangan tamu.
- **Rate Limiting:** Proteksi *endpoint* dari *spam* pengisian RSVP.

---

## 7. Rencana Rilis (Release Timeline)

| Fase | Deskripsi Pekerjaan | Estimasi Waktu |
|---|---|---|
| **Phase 1 (MVP Foundation)** | Setup Supabase (Auth, DB Schema), Setup Vercel & Next.js, Desain Dashboard UI Basic, 3 Template Undangan. | Minggu 1-3 |
| **Phase 2 (Core Features)** | Form Builder Acara, Manajemen Tamu, Web RSVP, Upload Galeri ke Supabase Storage. | Minggu 4-6 |
| **Phase 3 (Automation)** | Setup n8n, Integrasi WhatsApp API, *Workflow* otomatisasi sinkronisasi RSVP n8n <-> Supabase. | Minggu 7-8 |
| **Phase 4 (Monetization & LP)** | Setup Landing Page di Scalev, Integrasi Payment Gateway lokal, Pembatasan *Tier* Langganan. | Minggu 9-10 |
| **Phase 5 (Launch)** | Internal Testing, Bug Fixing, Security Check (RLS Supabase), Soft Launching. | Minggu 11-12 |

---

## 8. Out of Scope (Di Luar Lingkup Versi 1.0)
*Fitur berikut ditunda untuk pengembangan di masa depan (V2):*
- Aplikasi *Native Mobile* (Android/iOS).
- Peta lokasi 3D interaktif atau *Live Streaming* dalam aplikasi.
- *Custom* domain khusus untuk masing-masing *Host* (misal: `pernikahanbudi.com`).

GID: 1213776006