import React from 'react'
import { StyleSheet, View } from 'react-native'
import { SIZES } from '../../../shared'
import { DevelopmentInProgressGif } from '../../../shared/DevelopmentInProgressGif'
import { Typography } from '../../../shared/Typography'

type Props = {}

export const DevelopmentInProgressWidget = (props: Props) => {
    return (
        <View style={styles.container}>
            <DevelopmentInProgressGif width={230} height={230} />
            <Typography textAlign="center" marginsPaddings={{ mt: 20 }}>
                ДАННЫЙ РАЗДЕЛ ЕЩЕ В РАЗРАБОТКЕ
            </Typography>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        height: SIZES.HEIGHT(0.6),
    },
})
