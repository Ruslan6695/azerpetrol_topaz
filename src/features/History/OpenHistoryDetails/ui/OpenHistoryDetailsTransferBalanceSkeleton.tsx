import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { SIZES } from '../../../../shared'
import Skeleton from '../../../../shared/Skeleton/ui/Skeletons'

type Props = {}

export const OpenHistoryDetailsTransferBalanceSkeleton = memo(
    (props: Props) => {
        return (
            <View style={styles.container}>
                <Skeleton
                    width={SIZES.WIDTH(1) - SIZES.PX * 40}
                    height={60 * SIZES.PX}
                />
                <Skeleton
                    width={SIZES.WIDTH(1) - SIZES.PX * 40}
                    height={60 * SIZES.PX}
                />
                <Skeleton
                    width={SIZES.WIDTH(1) - SIZES.PX * 40}
                    height={60 * SIZES.PX}
                />
            </View>
        )
    }
)

const styles = StyleSheet.create({
    container: {
        gap: SIZES.PX * 10,
        marginTop: SIZES.PX * 20,
    },
})
