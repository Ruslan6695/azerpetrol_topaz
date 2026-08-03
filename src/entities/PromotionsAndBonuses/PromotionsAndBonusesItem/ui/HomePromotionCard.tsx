import { memo } from 'react'
import { resolveIconName } from '../../../../shared/Icons'
import { PromoRow } from '../../../../shared/PromoRow'
import { IPromotionsAndBonusesItem } from '../config/interfaces/IPromotionsAndBonusesItem'
import { PromotionImageCard } from './PromotionImageCard'

interface IProps extends IPromotionsAndBonusesItem {
    onPress: () => void
}

// Акция на главной в одном из двух видов макета. Вид приходит с бэка полем
// view_type; пока его нет — картинка, если есть img, иначе текстовая строка.
export const HomePromotionCard = memo(
    ({ img, header, label, view_type, icon, onPress }: IProps) => {
        const viewType = view_type ?? (img ? 'image' : 'text')

        if (viewType === 'text') {
            return (
                <PromoRow
                    // Иконка задаётся бэком; фолбэк — процент из макета.
                    icon={resolveIconName(icon, 'home_bonuses')}
                    label={label ?? 'Акция'}
                    title={header}
                    onPress={onPress}
                />
            )
        }

        return (
            <PromotionImageCard
                img={img}
                header={header}
                label={label}
                onPress={onPress}
            />
        )
    }
)
