import React from 'react'
import Skeleton from '../../../shared/Skeleton/ui/Skeletons'
import { SIZES } from '../../../shared'
import { StyleSheet, View } from 'react-native'

type Props = {}

export const HistoryWidgetSkeleton = (props: Props) => {
    return (
        <View style={styles.container}>
            <Skeleton
                margins={{ mb: 10 }}
                width={320 * SIZES.PX}
                height={45 * SIZES.PX}
            />
            <Skeleton
                width={SIZES.WIDTH(1) - 40 * SIZES.PX}
                height={230 * SIZES.PX}
            />
            <Skeleton
                margins={{ mt: 15 }}
                width={SIZES.WIDTH(1) - 40 * SIZES.PX}
                height={500 * SIZES.PX}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
})
