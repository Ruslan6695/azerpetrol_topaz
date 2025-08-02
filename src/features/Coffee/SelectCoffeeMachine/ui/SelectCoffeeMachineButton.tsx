import { memo } from 'react'
import { CustomButton } from '../../../../shared/CustomButton'
import { FuelMainBlock } from '../../../../entities/Fuel/FuelMainBlock'
import SelectCoffeeSvg from '../assets/select.svg'
import { SIZES } from '../../../../shared'
type Props = {
    onPress: () => void
}

export const SelectCoffeeMachineButton = memo(({ onPress }: Props) => {
    return (
        <FuelMainBlock
            onPress={onPress}
            icon={
                <SelectCoffeeSvg
                    height={SIZES.PX * 100}
                    width={SIZES.PX * 100}
                />
            }
            bgColor="rgba(76, 81, 89, 1)"
            title={`ВЫБЕРИ\nКОФЕМАШИНУ\nИЗ СПИСКА`}
        />
    )
})
