import { TEST_PHONES } from '../../constants/TEST_PHONES'

/** Номер принадлежит тестировщику — вход по смс-коду в обход callcheck */
export const isTestPhone = (phone: string): boolean =>
    TEST_PHONES.includes(phone.replace(/\D/g, ''))
