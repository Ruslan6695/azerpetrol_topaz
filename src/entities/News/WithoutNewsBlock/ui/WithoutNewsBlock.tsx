import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { NewsGif } from '../../../../shared/NewsGif'
import { Typography } from '../../../../shared/Typography'

type Props = {}

export const WithoutNewsBlock = memo((props: Props) => {
    return (
        <View style={styles.container}>
            <NewsGif />
            <Typography textAlign="center">Новостей пока нет</Typography>
        </View>
    )
})

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
})
