import { memo } from 'react'
import { StyleSheet } from 'react-native'
import { PRESS_SCALE, SIZES, ThemeStore, UserStore } from '../../../../shared'
import { Icon } from '../../../../shared/Icons'
import { PressableScale } from '../../../../shared/PressableScale'

type Props = {}

// Круглая кнопка у надстрочника «БАЛАНС»: прячет суммы за звёздочками.
// Само состояние живёт в UserStore, потому что скрытие действует сразу
// в двух местах — в карточке и в чипе шапки.
export const ToggleBalanceVisibility = memo((props: Props) => {
    const COLORS = ThemeStore.useCOLORS()
    const isBalanceHidden = UserStore.useIsBalanceHidden()
    const toggleBalanceHidden = UserStore.useToggleBalanceHidden()

    const styles = StyleSheet.create({
        button: {
            width: 26 * SIZES.PX,
            height: 26 * SIZES.PX,
            borderRadius: 13 * SIZES.PX,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: COLORS.GLASS.Primary,
            borderWidth: 1,
            borderColor: COLORS.GLASS.Border,
        },
    })

    return (
        <PressableScale
            onPress={toggleBalanceHidden}
            scaleTo={PRESS_SCALE.TAB}
            style={styles.button}
        >
            {/* Скрытый баланс подсвечен акцентом — состояние заметно,
                когда вместо сумм звёздочки */}
            <Icon
                name={isBalanceHidden ? 'eye_off' : 'eye'}
                size={14}
                color={
                    isBalanceHidden
                        ? COLORS.ACCENT.Primary
                        : COLORS.TEXT.Secondary
                }
            />
        </PressableScale>
    )
})
