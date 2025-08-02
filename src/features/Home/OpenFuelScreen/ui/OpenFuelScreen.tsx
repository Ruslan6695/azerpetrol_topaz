import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import FuelSvg from '../assets/fuel.svg'
import { ESCREENS, SIZES } from '../../../../shared'
import { CustomText } from '../../../../shared/CustomText'
import { MPLayout } from '../../../../shared/MpLayout'
import { HomeMainBlock } from '../../../../entities/HomeMainBlock'
import { CustomTouchableOpacity } from '../../../../shared/CustomTouchableOpacity'
type Props = {
    big_text: string
    small_text: string
}

export const OpenFuelScreen = memo(({ big_text, small_text }: Props) => {
    return (
        <HomeMainBlock
            link={ESCREENS.FUEL}
            bgColor="#AF91FA"
            mainText={{ color: '#7C61BE', text: big_text, fz: 40 }}
            title="НАЛИТЬ ТОПЛИВО"
            icon={<FuelSvg height={80 * SIZES.PX} width={100 * SIZES.PX} />}
            desciptionText={small_text}
        />
    )
})

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#AF91FA',
        flex: 1.2,
        borderRadius: 20 * SIZES.PX,
        padding: SIZES.PX * 10,
    },
    bottom: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
})
