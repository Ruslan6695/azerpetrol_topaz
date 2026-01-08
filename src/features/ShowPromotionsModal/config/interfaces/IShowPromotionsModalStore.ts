import { IPromotionsAndBonusesItem } from '../../../../entities/PromotionsAndBonuses/PromotionsAndBonusesItem'
import { IShowPromotionsModalData } from './IShowPromotionsModalData'

export interface IShowPromotionsModalStore extends IShowPromotionsModalData {
    setPromotions: (promotions: IPromotionsAndBonusesItem[]) => void
    isOpened: boolean
    toggleIsOpened:() => void
}
