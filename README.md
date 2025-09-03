# SIMRS Patient Mobile (Expo + Expo Router)

Aplikasi mobile untuk pasien SIMRS berbasis React Native (Expo) dengan Expo Router, Redux Toolkit, dan Axios.

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Backend Repository

Backend Laravel + Inertia.js untuk proyek ini tersedia di:

- Backend SIMRS: [gudangcoding/simrs-opensource](https://github.com/gudangcoding/simrs-opensource)

Pastikan backend berjalan dan dapat diakses dari perangkat/emulator. Atur base URL API di environment variable berikut:

```
EXPO_PUBLIC_API_BASE_URL=http://<HOST>:8000/api/patient
```

- Web/iOS simulator di mesin yang sama: `http://localhost:8000/api/patient`
- Android emulator: `http://10.0.2.2:8000/api/patient`
- Device fisik (Expo Go): `http://<IP_LAN>:8000/api/patient` (contoh `http://192.168.1.10:8000/api/patient`)

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
