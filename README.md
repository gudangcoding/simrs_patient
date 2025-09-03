# SIMRS Patient Mobile (Expo + Expo Router)

Aplikasi mobile pasien untuk SIMRS menggunakan React Native (Expo), Expo Router, Redux Toolkit, dan Axios.

## Backend Repository

Gunakan backend Laravel + Inertia.js (wajib berjalan agar app mobile berfungsi):

- Backend: https://github.com/gudangcoding/simrs-opensource

Ikuti panduan pada repo backend untuk instalasi dan menjalankan server (contoh: `php artisan serve` pada port 8000).

## Prasyarat

- Node.js 18+ dan npm 9+
- Android Studio (emulator Android) / Xcode (iOS Simulator) atau Expo Go pada perangkat
- Backend SIMRS berjalan dan dapat diakses dari device/emulator

## Instalasi Project Mobile

1) Masuk ke folder project

```bash
cd D:\KURSUS\ANDROID JS\simrs_patient
```

2) Install dependencies

```bash
npm install
```

3) Konfigurasi Base URL API

Aplikasi membaca base URL dari `EXPO_PUBLIC_API_BASE_URL`.

- Web / iOS Simulator: `http://localhost:8000/api/patient`
- Android Emulator: `http://10.0.2.2:8000/api/patient`
- Device fisik (Expo Go): `http://<IP_LAN>:8000/api/patient` (contoh `http://192.168.1.10:8000/api/patient`)

Set environment di Windows (PowerShell):

```powershell
setx EXPO_PUBLIC_API_BASE_URL "http://localhost:8000/api/patient"
```

Tutup dan buka ulang terminal. Alternatif, buat file `.env` di root:

```
EXPO_PUBLIC_API_BASE_URL=http://localhost:8000/api/patient
```

4) Jalankan aplikasi

```bash
npx expo start -c
```

- Tekan `a` untuk Android, `i` untuk iOS, atau scan QR di Expo Go.
- Untuk Web, tekan `w`. Disarankan pengujian utama di device/emulator.

## Fitur

- Onboarding 3 slide (Skip, link Register/Login)
- Autentikasi (Register, Login), token disimpan dengan SecureStore
- Tabs: Dashboard, Appointments (list, refresh, cancel, booking), Notifications, Profile (logout)
- Booking appointment: pilih tanggal, department (opsional), dokter tersedia, time slot, keluhan

## Struktur Folder

```
app/
  _layout.tsx
  index.tsx
  onboarding.tsx
  login.tsx
  register.tsx
  (tabs)/
    _layout.tsx
    index.tsx
    appointments.tsx
    notifications.tsx
    profile.tsx
  appointments/book.tsx
src/
  lib/
    api/client.ts
    store/
      index.ts
      slices/
        authSlice.ts
```

## Troubleshooting

- Layar blank saat API dipanggil:
  - Pastikan `EXPO_PUBLIC_API_BASE_URL` benar untuk target (Web/Emulator/Device)
  - Android Emulator gunakan `http://10.0.2.2:8000` (bukan localhost)
  - Device fisik gunakan IP LAN backend
  - Konfigurasi CORS di backend untuk origin Expo (terutama Web)
- Bersihkan cache: `npx expo start -c`

## Lisensi

Mengikuti lisensi proyek dan ketentuan pada repository backend.
