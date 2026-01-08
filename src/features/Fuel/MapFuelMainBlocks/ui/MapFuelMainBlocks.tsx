import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { EColorThemes, SIZES, ThemeStore } from '../../../../shared'
import { FuelMainBlock } from '../../../../entities/Fuel/FuelMainBlock'
import ScanSvg from '../assets/scanColumn.svg'
import ScanDarkSvg from '../assets/scanColumnDark.svg'
import SelectSvg from '../assets/selectColumn.svg'
import SelectDarkSvg from '../assets/selectColumnDark.svg'
import HelpSvg from '../assets/help.svg'
import HelpDark from '../assets/helpDark.svg'
type Props = {
    onSelectColumn: () => void
    onScanColumn: () => void
    onNeedHelp: () => void
}

export const MapFuelMainBlocks = memo(
    ({ onNeedHelp, onScanColumn, onSelectColumn }: Props) => {
        const colorTheme = ThemeStore.useTheme()
        return (
            <View style={styles.container}>
                <FuelMainBlock
                    onPress={onScanColumn}
                    title={`Сканируйте QR-код\nс колонки`}
                    icon={
                        colorTheme === EColorThemes.LIGHT ? (
                            <ScanSvg
                                height={SIZES.PX * 32}
                                width={SIZES.PX * 32}
                            />
                        ) : (
                            <ScanDarkSvg
                                height={SIZES.PX * 32}
                                width={SIZES.PX * 32}
                            />
                        )
                    }
                />
                <FuelMainBlock
                    onPress={onSelectColumn}
                    title={`Выбрать колонку\nиз списка`}
                    icon={
                        colorTheme === EColorThemes.LIGHT ? (
                            <SelectSvg
                                height={SIZES.PX * 32}
                                width={SIZES.PX * 32}
                            />
                        ) : (
                            <SelectDarkSvg
                                height={SIZES.PX * 32}
                                width={SIZES.PX * 32}
                            />
                        )
                    }
                />
                <FuelMainBlock
                    onPress={onNeedHelp}
                    title={`Мне нужна\nпомощь`}
                    icon={
                        colorTheme === EColorThemes.LIGHT ? (
                            <HelpSvg
                                height={SIZES.PX * 32}
                                width={SIZES.PX * 32}
                            />
                        ) : (
                            <HelpDark
                                height={SIZES.PX * 32}
                                width={SIZES.PX * 32}
                            />
                        )
                    }
                />
            </View>
        )
    }
)

const styles = StyleSheet.create({
    container: {
        gap: 12 * SIZES.PX,
    },
})
