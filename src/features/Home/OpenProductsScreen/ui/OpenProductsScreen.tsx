import { memo } from 'react'
import ProductsSvg from '../assets/products.svg'
import { HomeMainBlock } from '../../../../entities/HomeMainBlock'
import { ESCREENS, SIZES } from '../../../../shared'
type Props = {
    big_text: string
    small_text: string
}

export const OpenProductsScreen = memo(({ big_text, small_text }: Props) => {
    return (
        <HomeMainBlock
            link={ESCREENS.PRODUCTS}
            bgColor="rgba(0, 193, 42, 0.8)"
            mainText={{ color: '#04781D', text: big_text, fz: 20 }}
            desciptionText={small_text}
            icon={<ProductsSvg height={85 * SIZES.PX} width={100 * SIZES.PX} />}
            title="КУПИТЬ ПРОДУКТЫ"
        />
    )
})
