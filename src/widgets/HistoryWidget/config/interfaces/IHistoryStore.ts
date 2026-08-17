export interface IHistoryStore {
    /** Счётчик долистываний до конца экрана. Растёт на каждое событие */
    loadMoreTick: number
    requestLoadMore: () => void
}
