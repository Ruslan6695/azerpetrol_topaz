import React from 'react'
import { StyleSheet, View } from 'react-native'
import { SIZES } from '../../../../shared'
import { CustomText } from '../../../../shared/CustomText'
import Skeleton from '../../../../shared/Skeleton/ui/Skeletons'

type Props = {}

export const OpenHistoryDetailsBuyOnCashSkeleton = (props: Props) => {
    return (
        <View style={styles.container}>
            <View style={styles.total}>
                <Skeleton width={100} height={40} />
            </View>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((id) => (
                <Skeleton
                    height={50 * SIZES.PX}
                    key={id}
                    width={SIZES.WIDTH(0.9)}
                />
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        gap: SIZES.PX * 10,
    },
    total: {
        justifyContent: 'space-between',
        marginBottom: SIZES.PX * 20,
    },
})
