import { memo } from 'react'
import { IHistoryDetailsBuyOnCashItem } from '../../../../entities/History/HistoryDetailsBuyOnCashItem/config/interfaces/IHistoryDetailsBuyOnCashItem'
import { ScrollView, StyleSheet, View } from 'react-native'
import { SIZES, divideNumber } from '../../../../shared'
import { HistoryDetailsBuyOnCashItem } from '../../../../entities/History/HistoryDetailsBuyOnCashItem'
import { randomUUID } from 'expo-crypto'
import { CustomText } from '../../../../shared/CustomText'

type Props = {
    products: IHistoryDetailsBuyOnCashItem[]
    total: number
}

export const OpenHistoryDetailsBuyOnCash = memo(
    ({ products, total }: Props) => {
        return (
            <View style={styles.container}>
                <View style={styles.total}>
                    <CustomText fw="500" fz={18}>
                        ИТОГ:
                    </CustomText>
                    <CustomText fz={22} fw="600">
                        {divideNumber(total)} ₽
                    </CustomText>
                </View>
                {products.map((prod) => (
                    <HistoryDetailsBuyOnCashItem {...prod} key={randomUUID()} />
                ))}
            </View>
        )
    }
)

const styles = StyleSheet.create({
    container: {
        gap: SIZES.PX * 10,
    },
    total: {
        justifyContent: 'space-between',
        marginBottom: SIZES.PX * 20,
    },
})
