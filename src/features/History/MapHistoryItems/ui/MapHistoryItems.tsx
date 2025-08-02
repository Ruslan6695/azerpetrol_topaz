import { FlashList } from '@shopify/flash-list'
import { memo } from 'react'
import { StyleSheet } from 'react-native'

import { EHistoryItemType } from '../../../../entities/History'
import {
    HistoryItem,
    IHistoryItem,
} from '../../../../entities/History/HistoryItem'
import { MPLayout } from '../../../../shared/MpLayout'
import { CustomText } from '../../../../shared/CustomText'

type Props = {
    items: IHistoryItem[] | undefined
}

export const MapHistoryItems = memo(({ items }: Props) => {
    return (
        <MPLayout mt={15}>
            {items && items?.length > 0 ? (
                <FlashList
                    scrollEnabled={false}
                    renderItem={({ item }) => (
                        <HistoryItem key={item.date} {...item} />
                    )}
                    data={items}
                />
            ) : (
                <CustomText
                    fz={18}
                    secondary
                    marginsPaddings={{ mt: 100 }}
                    textAlign="center"
                >
                    ИСТОРИЯ НЕ НАЙДЕНА
                </CustomText>
            )}
        </MPLayout>
    )
})
const styles = StyleSheet.create({})
