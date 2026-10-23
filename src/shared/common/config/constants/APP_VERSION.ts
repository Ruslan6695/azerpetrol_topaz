import Constants from 'expo-constants'

// Версия сборки из app.config.ts (version). Сервер сравнивает её с
// минимальной версией из панели («Управление приложением»); раньше здесь
// была зашита '1.0.0', и сервер не мог отличить одну сборку от другой.
export const APP_VERSION = Constants.expoConfig?.version ?? '0.0.0'
