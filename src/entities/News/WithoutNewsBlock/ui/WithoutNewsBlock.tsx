import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { NewsGif } from '../../../../shared/NewsGif'
import { CustomText } from '../../../../shared/CustomText'

type Props = {}

export const WithoutNewsBlock = memo((props: Props) => {
    return (
        <View style={styles.container}>
            <NewsGif />
            <CustomText textAlign="center" fz={17} fw="300">
                НОВОСТЕЙ ПОКА НЕТ
            </CustomText>
        </View>
    )
})

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
})
