import { memo } from 'react'
import { HomeMainBlock } from '../../../../entities/HomeMainBlock'
import BonusesSvg from '../assets/bonuses.svg'
import BonusesDarkSvg from '../assets/bonuses_dark.svg'
import { ESCREENS, SIZES, ThemeStore } from '../../../../shared'
type Props = {
    big_text: string
    small_text: string
}

export const OpenPromotionAndBonusesScreen = memo(
    ({ big_text, small_text }: Props) => {
        const colorTheme = ThemeStore.useTheme()

        return (
            <HomeMainBlock
                link={ESCREENS.PROMOTIONS_AND_BONUSES}
                bgColor="rgba(106, 96, 206, 0.8) 0%"
                desciptionText={small_text}
                mainText={big_text}
                title="Акции и бонусы"
                icon={
                    colorTheme === 'light' ? (
                        <BonusesSvg
                            height={56 * SIZES.PX}
                            width={56 * SIZES.PX}
                        />
                    ) : (
                        <BonusesDarkSvg
                            height={56 * SIZES.PX}
                            width={56 * SIZES.PX}
                        />
                    )
                }
            />
        )
    }
)
