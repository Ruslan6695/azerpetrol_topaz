import { memo } from 'react'
import { CustomButton } from '../../../../shared/CustomButton'
import { FuelMainBlock } from '../../../../entities/Fuel/FuelMainBlock'
import ScanSvg from '../assets/scan.svg'
import { SIZES } from '../../../../shared'
type Props = {
    onPress: () => void
}

export const ScanCoffeeMachineButton = memo(({ onPress }: Props) => {
    return (
        <FuelMainBlock
            onPress={onPress}
            icon={<ScanSvg height={SIZES.PX * 100} width={SIZES.PX * 100} />}
            bgColor="rgba(155, 118, 249, 0.8)"
            title={`СКАНИРУЙ\nQR-КОД С КОФЕМАШИНЫ`}
        />
    )
})
