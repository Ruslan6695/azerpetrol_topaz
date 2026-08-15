import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { FuelMethodTile } from '../../../../entities/Fuel/FuelMethodTile'
import { FuelMainHero } from '../../../../entities/Fuel/FuelMainHero'
import { SIZES, SPACING } from '../../../../shared'

type Props = {
    onSelectColumn: () => void
    onScanColumn: () => void
    onNeedHelp: () => void
}

// Раскладка макета: герой «Выбрать колонку», под ним ряд из двух плиток.
export const MapFuelMainBlocks = memo(
    ({ onNeedHelp, onScanColumn, onSelectColumn }: Props) => {
        const styles = StyleSheet.create({
            container: {
                gap: SPACING.MD * SIZES.PX,
            },
            row: {
                flexDirection: 'row',
                gap: SPACING.MD * SIZES.PX,
            },
            // Ширину плиткам задаёт обёртка: GlassCard сам не растягивается.
            tile: {
                flex: 1,
            },
        })

        return (
            <View style={styles.container}>
                <FuelMainHero onPress={onSelectColumn} />
                <View style={styles.row}>
                    <View style={styles.tile}>
                        <FuelMethodTile
                            icon="fuel_scan"
                            variant="glass2"
                            title="Сканировать QR"
                            subtitle="С колонки"
                            onPress={onScanColumn}
                        />
                    </View>
                    <View style={styles.tile}>
                        <FuelMethodTile
                            icon="fuel_help"
                            variant="glass"
                            title="Нужна помощь"
                            subtitle="Подсказки, контакты"
                            onPress={onNeedHelp}
                        />
                    </View>
                </View>
            </View>
        )
    }
)
