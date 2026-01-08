import { FlashList } from '@shopify/flash-list'
import { memo } from 'react'

import {
    HistoryItem,
    IHistoryItem,
} from '../../../../entities/History/HistoryItem'
import { MPLayout } from '../../../../shared/MpLayout'
import { Typography } from '../../../../shared/Typography'

type Props = {
    items: IHistoryItem[] | undefined
}

export const MapHistoryItems = memo(({ items }: Props) => {
    
    return (
        <MPLayout mt={16}>
            {items && items?.length > 0 ? (
                <FlashList
                    scrollEnabled={false}
                    renderItem={({ item, index }) => (
                        <HistoryItem
                            isFirst={index === 0}
                            isLast={index === items.length - 1}
                            key={item.date}
                            {...item}
                        />
                    )}
                    data={items}
                />
            ) : (
                <Typography
                    color="secondary"
                    marginsPaddings={{ mt: 100 }}
                    textAlign="center"
                >
                    Иcтория не найдена
                </Typography>
            )}
        </MPLayout>
    )
})
