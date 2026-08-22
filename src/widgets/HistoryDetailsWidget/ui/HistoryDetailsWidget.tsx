import { memo, useCallback, useEffect, useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import {
    EHistoryItemType,
    THistoryDetailsScreenParams,
} from '../../../entities/History'
import { SIZES, SPACING, divideNumber, useFetchData } from '../../../shared'
import { BonusIcon } from '../../../shared/BonusIcon'
import { CenteredState } from '../../../shared/CenteredState'
import { ListGroup, ListRow } from '../../../shared/ListRow'
import { StatusPill } from '../../../shared/StatusPill'
import { Typography } from '../../../shared/Typography'
import { historyDetailsWidgetApi } from '../api/historyDetailsWidgetApi'
import { buildDetailsRows } from '../lib/buildDetailsRows'
import { HistoryDetailsWidgetSkeleton } from './HistoryDetailsWidgetSkeleton'
import { ContentIn } from '../../../shared/ContentIn'

type Props = {
    params: Partial<THistoryDetailsScreenParams>
}

// Детали операции из макета (dc.html:315–324): центрированная шапка
// «пилюля → сумма → дата» и одна стеклянная группа строк ключ/значение.
// Раньше под каждый тип операции было своё тело со своей вёрсткой —
// теперь их различает только buildDetailsRows.
export const HistoryDetailsWidget = memo(({ params }: Props) => {
    // Параметры маршрута приходят строками — приводим к енаму в одном месте
    const type = params.type
        ? (Number(params.type) as EHistoryItemType)
        : undefined

    const { data, errorText, fetchData, isDataLoading } = useFetchData({
        apiCallback: historyDetailsWidgetApi.getDetails,
        errorText: 'Ошибка при получении данных',
    })

    const handleReloadData = useCallback(() => {
        if (params.id && type) {
            fetchData({
                args: { historyId: Number(params.id), type },
                hideToastOnError: true,
            })
        }
    }, [params.id, type])

    const rows = useMemo(() => buildDetailsRows(type, data), [type, data])

    useEffect(() => {
        handleReloadData()
    }, [handleReloadData])

    const styles = StyleSheet.create({
        header: {
            alignItems: 'center',
            gap: SPACING.SM * SIZES.PX,
            paddingVertical: SPACING.SM * SIZES.PX,
            marginBottom: SPACING.LG * SIZES.PX,
        },
        sum: {
            flexDirection: 'row',
            alignItems: 'center',
        },
    })

    if (errorText) {
        return (
            <CenteredState
                variant="error"
                title="Не удалось загрузить операцию"
                error={errorText}
                action={{ label: 'Повторить', onPress: handleReloadData }}
            />
        )
    }

    if (isDataLoading || !data) {
        return <HistoryDetailsWidgetSkeleton />
    }

    return (
        <ContentIn>
            <View style={styles.header}>
                <StatusPill
                    label={data.text}
                    tone={data.sum > 0 ? 'positive' : 'destructive'}
                />
                {/* Сумма и знак валюты — одним цветом TEXT.Primary, как
                    в макете: знак операции уже несёт пилюля выше */}
                <View style={styles.sum}>
                    <Typography type="h2">{divideNumber(data.sum)}</Typography>
                    <BonusIcon mt={4} size={24} />
                </View>
                <Typography type="caption12" color="secondary">
                    {data.date}
                </Typography>
            </View>

            {rows.length > 0 && (
                <ListGroup level="secondary">
                    {rows.map((row, index) => (
                        <ListRow
                            key={`${row.k}-${index}`}
                            title={row.k}
                            value={row.v}
                            last={index === rows.length - 1}
                        />
                    ))}
                </ListGroup>
            )}
        </ContentIn>
    )
})
