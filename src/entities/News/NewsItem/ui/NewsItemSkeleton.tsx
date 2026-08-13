import { memo } from 'react'
import { RADII, SIZES } from '../../../../shared'
import { Skeleton } from '../../../../shared/Skeleton'

type Props = {}

// Высота под NewsItem: паддинги 18×2 + дата 14 + 4 + заголовок 21 + 4 + превью
// в две строки 34. Радиус тот же, что у карточки, — иначе скачок при загрузке.
export const NewsItemSkeleton = memo((props: Props) => {
    return (
        <Skeleton
            height={110 * SIZES.PX}
            width={SIZES.WIDTH(1) - 40 * SIZES.PX}
            style={{ borderRadius: RADII.CARD * SIZES.PX }}
        />
    )
})
