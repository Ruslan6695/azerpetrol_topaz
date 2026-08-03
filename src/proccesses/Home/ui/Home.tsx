import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { AppStore, SIZES, SPACING } from '../../../shared'
import { HomeMainWidget } from '../../../widgets/Home/HomeMainWidget'
import { NewsWidget } from '../../../widgets/News/NewsWidget'

type Props = {}

export const Home = memo((props: Props) => {
    const isTokenRefreshed = AppStore.useIsTokenRefreshed()

    const styles = StyleSheet.create({
        container: {
            gap: SPACING.MD * SIZES.PX,
        },
    })

    return (
        <View style={styles.container}>
            <HomeMainWidget />
            {isTokenRefreshed && <NewsWidget variant="carousel" />}
        </View>
    )
})
