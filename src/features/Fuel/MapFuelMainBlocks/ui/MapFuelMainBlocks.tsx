import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { SIZES } from '../../../../shared'
import { FuelMainBlock } from '../../../../entities/Fuel/FuelMainBlock'
import ScanSvg from '../assets/scanColumn.svg'
import SelectSvg from '../assets/selectColumn.svg'
import HelpSvg from '../assets/help.svg'
type Props = {
    onSelectColumn: () => void
    onScanColumn: () => void
    onNeedHelp: () => void
}

export const MapFuelMainBlocks = memo(
    ({ onNeedHelp, onScanColumn, onSelectColumn }: Props) => {
        return (
            <View style={styles.container}>
                <FuelMainBlock
                    onPress={onScanColumn}
                    title={`СКАНИРУЙ\nQR-КОД\nС КОЛОНКИ`}
                    bgColor="rgba(155, 118, 249, 0.8)"
                    icon={
                        <ScanSvg
                            height={SIZES.PX * 100}
                            width={SIZES.PX * 100}
                        />
                    }
                />
                <FuelMainBlock
                    textDark
                    onPress={onSelectColumn}
                    title={`ВЫБРАТЬ\nКОЛОНКУ\nИЗ СПИСКА`}
                    bgColor="rgba(245, 245, 245, 0.8)"
                    icon={
                        <SelectSvg
                            height={SIZES.PX * 100}
                            width={SIZES.PX * 100}
                        />
                    }
                />
                <FuelMainBlock
                    onPress={onNeedHelp}
                    title={`НУЖНА\nПОМОЩЬ`}
                    bgColor="rgba(76, 81, 89, 1)"
                    icon={
                        <HelpSvg height={SIZES.PX * 90} width={SIZES.PX * 90} />
                    }
                />
            </View>
        )
    }
)

const styles = StyleSheet.create({
    container: {
        gap: 15 * SIZES.PX,
    },
})
