import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { COLORS, SIZES } from '../../../shared'
import { CustomText } from '../../../shared/CustomText'
import { MPLayout } from '../../../shared/MpLayout'

type Props = {
    title: string
    info: string
}

export const FuelLoadingEndInfoItem = memo(({ title, info }: Props) => {
    return (
        <View style={styles.container}>
            <CustomText fz={17} fw="300">
                {title.toUpperCase()}:
            </CustomText>
            <MPLayout mt={10}>
                <CustomText fz={18} fw="500">
                    {info}
                </CustomText>
            </MPLayout>
        </View>
    )
})

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: COLORS.GRAY_3,
        width: '100%',
        justifyContent: 'space-between',
        padding: SIZES.PX * 10,
        borderRadius: SIZES.PX * 10,
        marginVertical: SIZES.PX * 5,
    },
})
