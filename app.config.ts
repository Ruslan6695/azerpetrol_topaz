import { ExpoConfig } from '@expo/config'

const config: ExpoConfig = {
    name: 'Азерпетрол',
    slug: 'azerpetrol',
    version: '1.3.3',
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

        versionCode: 23,
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
            projectId: 'a3d75821-e7ca-4d01-88f1-c483c7abd763',
        },
    },
}

export default config
