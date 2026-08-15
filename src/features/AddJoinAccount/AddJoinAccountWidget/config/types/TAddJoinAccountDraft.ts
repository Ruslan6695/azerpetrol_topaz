// Что форма приглашения отдаёт наверх: номер обязателен, имя приходит
// только если пользователя выбрали в контактах.
export type TAddJoinAccountDraft = {
    name?: string
    phone: string
}
