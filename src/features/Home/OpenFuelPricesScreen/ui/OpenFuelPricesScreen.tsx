import { memo } from 'react'
import { HomeMainBlock } from '../../../../entities/HomeMainBlock'
import { ESCREENS, SIZES } from '../../../../shared'
import { Image } from 'react-native'

type Props = {
    big_text: string
    small_text: string
}

export const OpenFuelPricesScreen = memo(({ big_text, small_text }: Props) => {
    return (
        <HomeMainBlock
            link={ESCREENS.FUEL_PRICES}
            bgColor="rgba(51, 52, 134, 0.8)"
            mainText={{
                color: 'rgba(15, 15, 58, 0.8)',
                text: big_text,
                fz: 22,
            }}
            desciptionText={small_text}
            title="ЦЕНЫ НА ТОПЛИВО"
            icon={<Image source={require('../assets/discount.png')} />}
        />
    )
})
