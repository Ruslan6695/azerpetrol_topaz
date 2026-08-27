import { ExpoConfig } from '@expo/config'

const config: ExpoConfig = {
    // Имя iOS-проекта и таргета Xcode Expo выводит из `name`, выбрасывая
    // не-ASCII символы; начинаться с цифры оно не может — '21 Век' давало
    // таргет '21' и падало на «Could not find target '21' in project.pbxproj».
    // Видимое имя приложения на iOS задано ниже через CFBundleDisplayName.
    name: 'Vek21',
    slug: 'azerpetrol',
    version: '1.3.5',
    scheme: 'azerpetrol',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'automatic',
    splash: {
        image: './assets/splash.png',
        resizeMode: 'cover',
        backgroundColor: '#000000',
    },
    ios: {
        icon: {
            light: './assets/ios-light.png',
            dark: './assets/ios-dark.png',
            tinted: './assets/ios-tinted.png',
        },
        supportsTablet: true,
        bundleIdentifier: 'com.azscontrol.azerpetrol',
        infoPlist: {
            CFBundleDisplayName: '21 Век',
            CFBundleName: '21 Век',
            ITSAppUsesNonExemptEncryption: false,
            NSCameraUsageDescription:
                'This application uses a camera to read the QR code of the gas station address.',
            NSContactsUsageDescription:
                'This application sends contacts to the server without saving there to check if the contact is available for fuel transfer.',
            NSLocationWhenInUseUsageDescription:
                'This application uses the location to determine which gas station the user is at.',
            NSLocationAlwaysUsageDescription:
                'This application uses the location to determine which gas station the user is at.',
            NSLocationAlwaysAndWhenInUseUsageDescription:
                'This application uses the location to determine which gas station the user is at.',
        },
    },
    android: {
        googleServicesFile: './google-services.json',
        adaptiveIcon: {
            foregroundImage: './assets/adaptive-icon.png',
            backgroundColor: '#FFFFFF',
        },

        versionCode: 25,
        package: 'com.vek21.azerpetrol',
    },
    web: {
        favicon: './assets/favicon.png',
    },
    plugins: [
        'expo-router',
        'expo-font',
        [
            'expo-splash-screen',
            {
                backgroundColor: '#ECEDEE',
                image: './assets/splash-icon-dark.png',
                resizeMode: 'contain',
                dark: {
                    image: './assets/splash-icon-light.png',
                    backgroundColor: '#151718',
                },
                imageWidth: 150,
            },
        ],
        [
            'expo-notifications',
            {
                enableBackgroundRemoteNotifications: true,
            },
        ],
    ],
    experiments: {
        typedRoutes: true,
    },
    newArchEnabled: true,
    extra: {
        router: {
            origin: false,
        },
        eas: {
            projectId: '42b57d86-777b-4e4d-9cf2-f5cfe01c06b7',
        },
    },
}

export default config
