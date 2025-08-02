import { memo } from 'react'
import { NewsGif } from '../../../../shared/NewsGif'
import { CustomText } from '../../../../shared/CustomText'
import { StyleSheet, View } from 'react-native'
import { SIZES } from '../../../../shared'

type Props = {}

export const WithoutPromotionsAndBonusesBlock = memo((props: Props) => {
    return (
        <View style={styles.container}>
            <NewsGif />
            <CustomText
                style={{ maxWidth: SIZES.WIDTH(0.8) }}
                textAlign="center"
                fz={17}
                fw="300"
            >
                АКТИВНЫХ АКЦИЙ НА ДАННЫЙ МОМЕНТ НЕТ
            </CustomText>
        </View>
    )
})

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
})
