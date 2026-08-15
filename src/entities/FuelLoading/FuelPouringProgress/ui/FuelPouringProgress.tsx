import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { SIZES, ThemeStore } from '../../../../shared'
import { ProgressRing } from '../../../../shared/ProgressRing'
import { Typography } from '../../../../shared/Typography'

type Props = {
    /** Уже налито, л */
    volume: number
    /** Заказано, л */
    target: number
    /** Заголовок состояния колонки: «Идёт налив…», «Ожидаем колонку…» */
    statusText: string
    /** Строка под заголовком: колонка, топливо, предупреждение */
    details: string
    /** Статус тревожный (налив приостановлен) — заголовок красным */
    alarming?: boolean
}

// Экран процесса налива (dc.html:574–583): кольцо 150 с литрами в центре,
// под ним статус и строка деталей. Зазор 18 своего токена в SPACING не имеет.
const GAP = 18

export const FuelPouringProgress = memo(
    ({ volume, target, statusText, details, alarming }: Props) => {
        const COLORS = ThemeStore.useCOLORS()

        const styles = StyleSheet.create({
            container: {
                alignItems: 'center',
                justifyContent: 'center',
                gap: GAP * SIZES.PX,
                paddingTop: 60 * SIZES.PX,
            },
            center: {
                alignItems: 'center',
            },
        })

        return (
            <View style={styles.container}>
                <ProgressRing progress={target ? volume / target : 0}>
                    <View style={styles.center}>
                        <Typography type="h3">
                            {`${volume.toFixed(1)} л`}
                        </Typography>
                        <Typography type="caption11" color="secondary">
                            {`из ${target.toFixed(1)} л`}
                        </Typography>
                    </View>
                </ProgressRing>

                <Typography
                    type="num20"
                    textAlign="center"
                    customColor={
                        alarming
                            ? COLORS.STATE.Destructive
                            : COLORS.TEXT.Primary
                    }
                >
                    {statusText}
                </Typography>

                <Typography type="body13" color="secondary" textAlign="center">
                    {details}
                </Typography>
            </View>
        )
    }
)
