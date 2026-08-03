// Тексты блоков главной, разобранные по `**` и разложенные по ключу-маршруту.
// Ключ — значение ESCREENS из поля link, поэтому запись частичная:
// бэкенд присылает тексты не для всех блоков.
export type THomeTexts = Record<
    string,
    { small_text: string; big_text: string } | undefined
>
