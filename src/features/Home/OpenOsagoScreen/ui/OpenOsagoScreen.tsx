import { memo } from 'react'
import OsagoSvg from '../assets/car.svg'
import OsagoDarkSvg from '../assets/car_dark.svg'
import { HomeMainBlock } from '../../../../entities/HomeMainBlock'
import { ESCREENS, SIZES, ThemeStore } from '../../../../shared'
type Props = {
    big_text: string
    small_text: string
}

export const OpenOsagoScreen = memo(({ big_text, small_text }: Props) => {
    const colorTheme = ThemeStore.useTheme()
    return (
        <HomeMainBlock
            link={ESCREENS.PRODUCTS}
            bgColor="rgba(255, 149, 0, 0.8)"
            mainText={big_text}
            desciptionText={small_text}
            title={'Оформить осаго'}
            icon={
                colorTheme === 'light' ? (
                    <OsagoSvg height={56 * SIZES.PX} width={56 * SIZES.PX} />
                ) : (
                    <OsagoDarkSvg
                        height={56 * SIZES.PX}
                        width={56 * SIZES.PX}
                    />
                )
            }
        />
    )
})
