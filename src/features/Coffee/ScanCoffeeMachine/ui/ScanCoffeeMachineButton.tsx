import { memo } from 'react'
import { CustomButton } from '../../../../shared/CustomButton'
import { FuelMainBlock } from '../../../../entities/Fuel/FuelMainBlock'
import ScanSvg from '../assets/scan.svg'
import ScanDarkSvg from '../assets/scanDark.svg'
import { EColorThemes, SIZES, ThemeStore } from '../../../../shared'
type Props = {
    onPress: () => void
}

export const ScanCoffeeMachineButton = memo(({ onPress }: Props) => {
    const colorTheme = ThemeStore.useTheme()
    return (
        <FuelMainBlock
            onPress={onPress}
            icon={
                colorTheme === EColorThemes.DARK ? (
                    <ScanDarkSvg height={SIZES.PX * 32} width={SIZES.PX * 32} />
                ) : (
                    <ScanSvg height={SIZES.PX * 32} width={SIZES.PX * 32} />
                )
            }
            title={`Сканируйте QR  с кофемашины`}
        />
    )
})
