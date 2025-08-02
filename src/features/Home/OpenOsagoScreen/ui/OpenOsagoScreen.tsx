import { memo } from 'react'
import CarSvg from '../assets/car.svg'
import { HomeMainBlock } from '../../../../entities/HomeMainBlock'
import { ESCREENS, SIZES } from '../../../../shared'
type Props = {
    big_text: string
    small_text: string
}

export const OpenOsagoScreen = memo(({ big_text, small_text }: Props) => {
    return (
        <HomeMainBlock
            link={ESCREENS.PRODUCTS}
            bgColor="rgba(255, 149, 0, 0.8)"
            mainText={{
                color: '#AF6600',
                text: big_text,
                fz: 21,
            }}
            desciptionText={small_text}
            title={'ОФОРМИТЬ ОСАГО'}
            icon={<CarSvg width={100 * SIZES.PX} height={90 * SIZES.PX} />}
        />
    )
})
