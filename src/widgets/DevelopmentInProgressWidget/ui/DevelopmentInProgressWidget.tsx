import React from 'react'
import { DevelopmentInProgressGif } from '../../../shared/DevelopmentInProgressGif'
import { StyleSheet, View } from 'react-native'
import { CustomText } from '../../../shared/CustomText'
import { SIZES } from '../../../shared'

type Props = {}

export const DevelopmentInProgressWidget = (props: Props) => {
    return (
        <View style={styles.container}>
            <DevelopmentInProgressGif width={230} height={230} />
            <CustomText
                fw="300"
                textAlign="center"
                marginsPaddings={{ mt: 20 }}
                fz={17}
            >
                ДАННЫЙ РАЗДЕЛ ЕЩЕ В РАЗРАБОТКЕ
            </CustomText>
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
