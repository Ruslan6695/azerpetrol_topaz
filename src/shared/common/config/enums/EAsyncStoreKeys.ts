export enum EAsyncStoreKeys {
    NAME = 'name',
    TOKEN = 'token',
    CONTACTS = 'contacts',
    PUSH_NOTIFICATION = 'pushNotification',
    PUSH_TOKEN_ON_SERVER = 'pushTokenOnServer', // нужен для сравнения пуша токена, если они не совпадают чтобы обновлять
    CAMERA_PERMISSION = 'cameraPermission',
    CONTACTS_PERMISSION = 'conttacts_permission',
}
