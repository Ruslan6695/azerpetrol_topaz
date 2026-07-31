// Шаг авторизации, который виджет публикует наружу, чтобы экран решил,
// показывать ли шапку с вордмарком. Общий для LoginWidget и RegistrationWidget.
export type TAuthStep = 'form' | 'captcha' | 'confirm'
