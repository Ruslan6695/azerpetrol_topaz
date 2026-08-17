import { useRouter } from 'expo-router'
import { memo, useCallback } from 'react'
import {
    HistoryItem,
    IHistoryItem,
} from '../../../../entities/History/HistoryItem'
import { ESCREENS } from '../../../../shared'
import { CenteredState } from '../../../../shared/CenteredState'
import { ListGroup } from '../../../../shared/ListRow'
import { MPLayout } from '../../../../shared/MpLayout'

type Props = {
    items: IHistoryItem[] | undefined
}

// Стеклянная группа операций из макета (dc.html:302–309). Список рендерится
// через .map(), а не FlashList: скроллом владеет InternalPagesLayout, а внутри
// чужого ScrollView измерения FlashList не работают.
export const MapHistoryItems = memo(({ items }: Props) => {
    const router = useRouter()

    const handleOpenDetails = useCallback((item: IHistoryItem) => {
        router.navigate({
            pathname: ESCREENS.HISTORY_DETAILS,
            params: { type: item.type, id: item.id },
        })
    }, [])

    if (!items || items.length === 0) {
        return (
            <CenteredState
                title="Операций нет"
                description="За выбранный период операции не найдены"
            />
        )
    }

    return (
        <MPLayout mt={12}>
            <ListGroup>
                {items.map((item, index) => (
                    <HistoryItem
                        key={item.id}
                        last={index === items.length - 1}
                        onPress={() => handleOpenDetails(item)}
                        {...item}
                    />
                ))}
            </ListGroup>
        </MPLayout>
    )
})
