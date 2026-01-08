import { memo } from 'react'
import { CustomButton } from '../../../../shared/CustomButton'
import { FuelMainBlock } from '../../../../entities/Fuel/FuelMainBlock'
import SelectCoffeeSvg from '../assets/select.svg'
import SelectCoffeeDarkSvg from '../assets/selectDark.svg'
import { EColorThemes, SIZES, ThemeStore } from '../../../../shared'
type Props = {
    onPress: () => void
}

export const SelectCoffeeMachineButton = memo(({ onPress }: Props) => {
    const colorTheme = ThemeStore.useTheme()
    return (
        <FuelMainBlock
            onPress={onPress}
            icon={
                colorTheme === EColorThemes.DARK ? (
                    <SelectCoffeeDarkSvg
                        height={SIZES.PX * 27}
                        width={SIZES.PX * 27}
                    />
                ) : (
                    <SelectCoffeeSvg
                        height={SIZES.PX * 27}
                        width={SIZES.PX * 27}
                    />
                )
            }
            title={`Выберите кофемашину из списка`}
        />
    )
})
