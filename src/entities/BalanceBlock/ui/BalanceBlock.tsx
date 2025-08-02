import { memo, useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import { COLORS, ESCREENS, SIZES, divideNumber } from '../../../shared'
import { CustomText } from '../../../shared/CustomText'
import { CustomButton } from '../../../shared/CustomButton'
import { useRouter } from 'expo-router'

type Props = {
    balance: number
}

export const BalanceBlock = memo(({ balance }: Props) => {
    const router = useRouter()

    const handlePressOnPay = useCallback(() => {
        router.navigate(ESCREENS.PAY_BALANCE)
    }, [])
    return (
        <>
            <View style={styles.container}>
                <CustomText marginsPaddings={{ mb: 10 }} fw="300" fz={18}>
                    Ваш баланс:
                </CustomText>
                <View style={styles.balance}>
                    <CustomText fw="600" fz={35}>
                        {divideNumber(balance)} ₽
                    </CustomText>
                </View>
            </View>
            <CustomButton
                onPress={handlePressOnPay}
                styled={{
                    type: 'SUCCES',
                    width: { type: 'absolute', value: '100%' },
                    marginsPaddings: { mt: 5 },
                    height: { type: 'px', value: 60 },
                    fz: 20,
                }}
            >
                ПОПОЛНИТЬ
            </CustomButton>
        </>
    )
})

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.GRAY_2,
        width: '100%',
        borderRadius: SIZES.PX * 20,

        paddingHorizontal: SIZES.PX * 15,
        paddingVertical: SIZES.PX * 15,
    },
    balance: {
        alignItems: 'flex-end',
    },
})
