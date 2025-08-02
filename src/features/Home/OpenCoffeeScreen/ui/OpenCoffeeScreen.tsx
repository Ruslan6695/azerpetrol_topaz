import { memo } from 'react'
import { HomeMainBlock } from '../../../../entities/HomeMainBlock'
import CoffeSvg from '../assets/coffee.svg'
import { COLORS, ESCREENS, SIZES } from '../../../../shared'
import { StyleSheet, View } from 'react-native'
import { CustomText } from '../../../../shared/CustomText'
type Props = {
    big_text: string
    small_text: string
}

export const OpenCoffeeScreen = memo(({ big_text, small_text }: Props) => {
    return (
        <HomeMainBlock
            link={ESCREENS.COFFEE}
            bgColor="rgba(187, 136, 76, 0.8)"
            desciptionText={small_text}
            icon={<CoffeSvg height={85 * SIZES.PX} width={100 * SIZES.PX} />}
            title="КУПИТЬ КОФЕ"
            mainText={{
                color: '#815828',
                text: big_text,
                fz: 20,
            }}
        />
    )
})
