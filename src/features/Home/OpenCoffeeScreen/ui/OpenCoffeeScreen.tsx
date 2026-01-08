import { memo } from 'react'
import { HomeMainBlock } from '../../../../entities/HomeMainBlock'
import { ESCREENS, SIZES, ThemeStore } from '../../../../shared'
import CoffeSvg from '../assets/coffee.svg'
import CoffeeDarkSvg from '../assets/coffee_dark.svg'
type Props = {
    big_text: string
    small_text: string
}

export const OpenCoffeeScreen = memo(({ big_text, small_text }: Props) => {
    const colorTheme = ThemeStore.useTheme()
    return (
        <HomeMainBlock
            link={ESCREENS.COFFEE}
            bgColor="rgba(187, 136, 76, 0.8)"
            desciptionText={small_text}
            icon={
                colorTheme === 'light' ? (
                    <CoffeSvg height={56 * SIZES.PX} width={56 * SIZES.PX} />
                ) : (
                    <CoffeeDarkSvg
                        height={56 * SIZES.PX}
                        width={56 * SIZES.PX}
                    />
                )
            }
            title="Купить кофе"
            mainText={big_text}
        />
    )
})
