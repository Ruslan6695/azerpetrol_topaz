import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { RADII, SIZES, SPACING, ThemeStore } from '../../../shared'
import { GlassCard } from '../../../shared/GlassCard'
import { QrCode } from '../../../shared/QrCode'

type Props = {
    qr?: string
    qrSize?: number
    qrIsLoading?: boolean
    /** Радиус карточки в единицах макета. У кофейного QR он меньше, чем у балансного */
    radius?: number
    /** Паддинг карточки в единицах макета */
    padding?: number
}

// Размер QR из макета (design/21vek-app.dc.html:184). QrCode домножает
// его на SIZES.PX сам, поэтому передаётся сырым.
const QR_SIZE = 190

export const QrBlock = memo(
    ({ qr, qrIsLoading, qrSize, radius = RADII.HERO, padding = 26 }: Props) => {
        const COLORS = ThemeStore.useCOLORS()

        const styles = StyleSheet.create({
            plate: {
                borderRadius: RADII.ROW * SIZES.PX,
                padding: SPACING.MD * SIZES.PX,
                // Подложка появляется вместе с кодом: пока грузится, QrCode
                // рисует шиммер на GLASS.*, который на белом не виден.
                backgroundColor: qr ? COLORS.BACKGROUND.QrPlate : 'transparent',
            },
        })

        return (
            <GlassCard variant="glass2" radius={radius} padding={padding}>
                <View style={styles.plate}>
                    <QrCode
                        qrIsLoading={qrIsLoading}
                        size={qrSize || QR_SIZE}
                        value={qr}
                    />
                </View>
            </GlassCard>
        )
    }
)
