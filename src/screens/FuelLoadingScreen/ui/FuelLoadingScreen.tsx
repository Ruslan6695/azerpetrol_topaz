import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { InternalPagesLayout } from '../../../layouts/InternalPagesLayout'
import { FuelLoading } from '../../../proccesses/FuelLoading'
import { SIZES } from '../../../shared'

type Props = {}

// hideHeader: заголовок у каждого из трёх шагов свой, а роут один —
// его даёт StepHeader внутри шага, а не InternalPagesHeader по pathname.
// Отступ сверху из-за этого приходится дать самим: /fuelLoading лежит вне
// группы (main), SafeAreaView его не оборачивает, а инсет добавлял хедер.
export const FuelLoadingScreen = memo((props: Props) => {
    const insets = useSafeAreaInsets()

    const styles = StyleSheet.create({
        content: {
            paddingTop: insets.top + 10 * SIZES.PX,
        },
    })

    return (
        <InternalPagesLayout hideHeader>
            <View style={styles.content}>
                <FuelLoading />
            </View>
        </InternalPagesLayout>
    )
})
