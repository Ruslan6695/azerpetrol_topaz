export interface ITransferDraftStore {
    /** Телефон получателя без пробелов, как его отдаёт GlassInput */
    phone: string
    sum: number
    setPhone: (phone: string) => void
    setSum: (sum: number) => void
    reset: () => void
}
