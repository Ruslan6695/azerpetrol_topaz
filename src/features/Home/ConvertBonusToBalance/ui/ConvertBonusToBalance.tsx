import { memo, useCallback, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { SIZES, ThemeStore, UserStore, useSendFetch } from '../../../../shared'
import { Icon } from '../../../../shared/Icons'
import { PressableScale } from '../../../../shared/PressableScale'
import { showToast } from '../../../../shared/ToastComponent'
import { PRESS_SCALE } from '../../../../shared/common/config/constants/PRESS_SCALE'
import { convertBonusToBalanceApi } from '../api/convertBonusToBalanceApi'
import { ConvertBonusModal } from './ConvertBonusModal'

type Props = {}

// Круглая кнопка у бонусов в карточке баланса: открывает перевод бонусов
// на основной счёт. Курс 1 B = 1 ₽.
export const ConvertBonusToBalance = memo((props: Props) => {
    const COLORS = ThemeStore.useCOLORS()
    const bonusBalance = UserStore.useBonus_balance()
    const setBalance = UserStore.useSetBalance()

    const [isOpened, setIsOpened] = useState(false)
    const [amount, setAmount] = useState(0)

    const { sendFetch, isSendFetchLoading } = useSendFetch({
        apiCallback: convertBonusToBalanceApi.convert,
        errorText: 'Не удалось перевести бонусы',
    })

    const styles = StyleSheet.create({
        button: {
            width: 30 * SIZES.PX,
            height: 30 * SIZES.PX,
            borderRadius: 15 * SIZES.PX,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: COLORS.GLASS.Primary,
            borderWidth: 1,
            borderColor: COLORS.GLASS.Border,
        },
    })

    // По макету поле открывается уже заполненным всей суммой бонусов.
    const handleOpen = useCallback(() => {
        setAmount(bonusBalance)
        setIsOpened(true)
    }, [bonusBalance])

    const handleClose = useCallback(() => setIsOpened(false), [])

    const handleConfirm = useCallback(() => {
        sendFetch({
            args: { sum: amount },
            afterDataCallback(data) {
                setBalance({
                    balance: data.balance,
                    bonus_balance: data.bonus_balance,
                })
                setIsOpened(false)
                showToast({
                    type: 'success',
                    text: 'Бонусы переведены на счёт',
                })
            },
        })
    }, [amount, sendFetch, setBalance])

    // Переводить нечего — кнопки нет вовсе.
    if (bonusBalance <= 0) {
        return null
    }

    return (
        <View>
            <PressableScale
                onPress={handleOpen}
                scaleTo={PRESS_SCALE.TAB}
                style={styles.button}
            >
                <Icon name="convert" size={16} color={COLORS.ACCENT.Primary} />
            </PressableScale>

            <ConvertBonusModal
                isOpened={isOpened}
                max={bonusBalance}
                amount={amount}
                isLoading={isSendFetchLoading}
                onChangeAmount={setAmount}
                onConfirm={handleConfirm}
                onClose={handleClose}
            />
        </View>
    )
})
