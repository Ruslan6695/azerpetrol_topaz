import React from 'react'
import { HomeMainBlock } from '../../../../entities/HomeMainBlock'
import { ESCREENS, SIZES, ThemeStore } from '../../../../shared'
import PricesSvg from '../assets/prices.svg'
import PricesDarkSvg from '../assets/prices_dark.svg'
type Props = {
    big_text: string
    small_text: string
}

export const OpenFuelPricesScreen = ({ big_text, small_text }: Props) => {
    const colorTheme = ThemeStore.useTheme()

    return (
        <HomeMainBlock
            link={ESCREENS.FUEL_PRICES}
            bgColor="rgba(187, 136, 76, 0.8)"
            desciptionText={small_text}
            icon={
                colorTheme === 'light' ? (
                    <PricesSvg height={56 * SIZES.PX} width={56 * SIZES.PX} />
                ) : (
                    <PricesDarkSvg
                        height={56 * SIZES.PX}
                        width={56 * SIZES.PX}
                    />
                )
            }
            title={big_text}
            mainText={''}
        />
    )
}
