import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { PRESS_SCALE, SIZES, SPACING, ThemeStore } from '../../../shared'
import { Glass } from '../../../shared/GlassCard'
import { PressableScale } from '../../../shared/PressableScale'
import { Typography } from '../../../shared/Typography'

type Props = {
    title: string
    /** Без обработчика круг «←» не рисуется — шаг, с которого уходить некуда */
    onBack?: () => void
}

const BACK_SIZE = 38

// Шапка шага внутри вкладки: стеклянная «←» и заголовок (dc.html:66–71).
// Отличие от InternalPagesHeader — возврат приходит пропом: шаги заправки
// живут в одном роуте, системного router.back() у них нет.
export const StepHeader = memo(({ title, onBack }: Props) => {
    const COLORS = ThemeStore.useCOLORS()

    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: SPACING.MD * SIZES.PX,
            paddingBottom: SPACING.MD * SIZES.PX,
            // Высота держится и без круга «←», чтобы контент не прыгал
            // при переходе между шагами одного роута.
            minHeight: (BACK_SIZE + SPACING.MD) * SIZES.PX,
        },
        back: {
            width: BACK_SIZE * SIZES.PX,
            height: BACK_SIZE * SIZES.PX,
            alignItems: 'center',
            justifyContent: 'center',
        },
    })

    return (
        <View style={styles.container}>
            {onBack && (
                <PressableScale onPress={onBack} scaleTo={PRESS_SCALE.BACK}>
                    <Glass
                        level="secondary"
                        radius={(BACK_SIZE / 2) * SIZES.PX}
                    >
                        <View style={styles.back}>
                            <Typography
                                type="num16"
                                customColor={COLORS.TEXT.Primary}
                            >
                                ←
                            </Typography>
                        </View>
                    </Glass>
                </PressableScale>
            )}
            <Typography type="num18">{title}</Typography>
        </View>
    )
})
