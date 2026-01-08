import { memo } from 'react'
import { HomeMainBlock } from '../../../../entities/HomeMainBlock'
import HistorySvg from '../assets/history.svg'
import HistoryDarkSvg from '../assets/history_dark.svg'
import { ESCREENS, SIZES, ThemeStore } from '../../../../shared'
type Props = {
    big_text: string
    small_text: string
}

export const OpenHistoryScreen = memo(({ big_text, small_text }: Props) => {
    const colorTheme = ThemeStore.useTheme()

    return (
        <HomeMainBlock
            link={ESCREENS.HISTORY}
            bgColor="rgba(115, 134, 237, 0.8)"
            mainText={big_text}
            desciptionText={small_text}
            title="Моя история"
            icon={
                colorTheme === 'light' ? (
                    <HistorySvg height={56 * SIZES.PX} width={56 * SIZES.PX} />
                ) : (
                    <HistoryDarkSvg
                        height={56 * SIZES.PX}
                        width={56 * SIZES.PX}
                    />
                )
            }
        />
    )
})
