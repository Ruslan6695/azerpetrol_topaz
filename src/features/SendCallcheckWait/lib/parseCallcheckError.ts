export enum ECallcheckErrorKind {
    CaptchaFailed = 'captcha_failed',
    UserNotFound = 'user_not_found',
    UserExists = 'user_exists',
    SessionCreateFailed = 'session_create_failed',
    InitiateFailed = 'initiate_failed',
    Timeout = 'timeout',
    SessionNotFound = 'session_not_found',
    StatusUnavailable = 'status_unavailable',
    UserCreateFailed = 'user_create_failed',
    MissingFields = 'missing_fields',
    NoData = 'no_data',
    Network = 'network',
    Unknown = 'unknown',
}

const MESSAGE_TO_KIND: Array<{ match: RegExp; kind: ECallcheckErrorKind }> = [
    { match: /Капча не пройдена/i, kind: ECallcheckErrorKind.CaptchaFailed },
    {
        match: /Клиент не найден/i,
        kind: ECallcheckErrorKind.UserNotFound,
    },
    {
        match: /Пользователь уже зарегистрирован/i,
        kind: ECallcheckErrorKind.UserExists,
    },
    {
        match: /Не удалось создать (?:сессию|регистрационную сессию)/i,
        kind: ECallcheckErrorKind.SessionCreateFailed,
    },
    {
        match: /Не удалось инициировать звонок/i,
        kind: ECallcheckErrorKind.InitiateFailed,
    },
    {
        match: /Истекло время ожидания звонка/i,
        kind: ECallcheckErrorKind.Timeout,
    },
    {
        match: /Сессия (?:авторизации|регистрации) не найдена/i,
        kind: ECallcheckErrorKind.SessionNotFound,
    },
    {
        match: /Не удалось получить статус звонка/i,
        kind: ECallcheckErrorKind.StatusUnavailable,
    },
    {
        match: /Не удалось создать пользователя/i,
        kind: ECallcheckErrorKind.UserCreateFailed,
    },
    {
        match: /нужно заполнить все поля/i,
        kind: ECallcheckErrorKind.MissingFields,
    },
    { match: /Нет данных/i, kind: ECallcheckErrorKind.NoData },
]

export const parseCallcheckError = (error: any): ECallcheckErrorKind => {
    if (!error?.response) {
        return ECallcheckErrorKind.Network
    }
    const body = error?.response?.data
    const text = typeof body === 'string' ? body : ''
    for (const { match, kind } of MESSAGE_TO_KIND) {
        if (match.test(text)) return kind
    }
    return ECallcheckErrorKind.Unknown
}

export const getCallcheckErrorText = (kind: ECallcheckErrorKind): string => {
    switch (kind) {
        case ECallcheckErrorKind.CaptchaFailed:
            return 'Капча не пройдена'
        case ECallcheckErrorKind.UserNotFound:
            return 'Клиент не найден, попробуйте зарегистрироваться'
        case ECallcheckErrorKind.UserExists:
            return 'Пользователь уже зарегистрирован, попробуйте авторизоваться'
        case ECallcheckErrorKind.SessionCreateFailed:
            return 'Не удалось создать сессию, попробуйте ещё раз'
        case ECallcheckErrorKind.InitiateFailed:
            return 'Не удалось инициировать звонок, попробуйте позже'
        case ECallcheckErrorKind.Timeout:
            return 'Истекло время ожидания звонка'
        case ECallcheckErrorKind.SessionNotFound:
            return 'Сессия истекла, начните заново'
        case ECallcheckErrorKind.UserCreateFailed:
            return 'Не удалось создать пользователя, попробуйте позже'
        case ECallcheckErrorKind.MissingFields:
            return 'Заполните все поля'
        case ECallcheckErrorKind.NoData:
            return 'Не переданы обязательные данные'
        case ECallcheckErrorKind.Network:
            return 'Нет соединения с сервером'
        default:
            return 'Произошла ошибка, попробуйте ещё раз'
    }
}
