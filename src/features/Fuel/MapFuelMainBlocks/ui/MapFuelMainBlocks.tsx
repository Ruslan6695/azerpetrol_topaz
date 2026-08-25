import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { FuelMethodTile } from '../../../../entities/Fuel/FuelMethodTile'
import { FuelMainHero } from '../../../../entities/Fuel/FuelMainHero'
import { SIZES, SPACING } from '../../../../shared'

type Props = {
    onSelectColumn: () => void
    onNeedHelp: () => void
}

// Раскладка макета: герой «Выбрать колонку», под ним плитка помощи
// (плитка сканирования убрана — Топаз не поддерживает идентификацию по QR).
export const MapFuelMainBlocks = memo(
    ({ onNeedHelp, onSelectColumn }: Props) => {
        const styles = StyleSheet.create({
            container: {
                gap: SPACING.MD * SIZES.PX,
            },
        })

        return (
            <View style={styles.container}>
                <FuelMainHero onPress={onSelectColumn} />
                <FuelMethodTile
                    icon="fuel_help"
                    variant="glass"
                    title="Нужна помощь"
                    subtitle="Подсказки, контакты"
                    onPress={onNeedHelp}
                />
            </View>
        )
    }
)
