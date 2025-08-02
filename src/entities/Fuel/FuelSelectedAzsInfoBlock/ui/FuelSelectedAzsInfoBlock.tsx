import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { COLORS, SIZES } from '../../../../shared'
import { CustomText } from '../../../../shared/CustomText'

type Props = {
    azsName: string
}

export const FuelSelectedAzsInfoBlock = memo(({ azsName }: Props) => {
    return (
        <View style={styles.azsContainer}>
            <CustomText>Выбрана азc:</CustomText>
            <CustomText fw="600" fz={20}>
                {azsName}
            </CustomText>
        </View>
    )
})

const styles = StyleSheet.create({
    azsContainer: {
        backgroundColor: COLORS.GRAY_3,
        width: '100%',
        padding: 10 * SIZES.PX,
        marginBottom: SIZES.PX * 10,
        borderRadius: SIZES.PX * 15,
    },
})
