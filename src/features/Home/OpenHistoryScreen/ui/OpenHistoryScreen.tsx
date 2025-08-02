import { memo } from 'react'
import { HomeMainBlock } from '../../../../entities/HomeMainBlock'
import HistorySvg from '../assets/history.svg'
import { ESCREENS, SIZES } from '../../../../shared'
type Props = {
    big_text: string
    small_text: string
}

export const OpenHistoryScreen = memo(({ big_text, small_text }: Props) => {
    return (
        <HomeMainBlock
            link={ESCREENS.HISTORY}
            bgColor="rgba(115, 134, 237, 0.8)"
            mainText={{
                color: '#4856A4',
                text: big_text,
                fz: 22,
            }}
            desciptionText={small_text}
            title="МОЯ ИСТОРИЯ"
            icon={<HistorySvg height={110 * SIZES.PX} width={SIZES.PX * 100} />}
        />
    )
})
