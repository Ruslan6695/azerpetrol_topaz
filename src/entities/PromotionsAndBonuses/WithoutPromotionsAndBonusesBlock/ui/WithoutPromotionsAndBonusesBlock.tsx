import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { SIZES } from '../../../../shared'
import { NewsGif } from '../../../../shared/NewsGif'
import { Typography } from '../../../../shared/Typography'

type Props = {}

export const WithoutPromotionsAndBonusesBlock = memo((props: Props) => {
    return (
        <View style={styles.container}>
            <NewsGif />
            <Typography
                style={{ maxWidth: SIZES.WIDTH(0.8) }}
                textAlign="center"
            >
                Активных акций пока нет
            </Typography>
        </View>
    )
})

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
})
