import { memo } from 'react'
import { HomeMainBlock } from '../../../../entities/HomeMainBlock'
import BonusesSvg from '../assets/bonuses.svg'
import { ESCREENS, SIZES } from '../../../../shared'
type Props = {
    big_text: string
    small_text: string
}

export const OpenPromotionAndBonusesScreen = memo(
    ({ big_text, small_text }: Props) => {
        return (
            <HomeMainBlock
                link={ESCREENS.PROMOTIONS_AND_BONUSES}
                bgColor="rgba(106, 96, 206, 0.8) 0%"
                desciptionText={small_text}
                mainText={{
                    color: '#624D9F',
                    text: big_text,
                    fz: 22,
                }}
                title="АКЦИИ и БОНУСЫ"
                icon={
                    <BonusesSvg height={90 * SIZES.PX} width={SIZES.PX * 100} />
                }
            />
        )
    }
)
