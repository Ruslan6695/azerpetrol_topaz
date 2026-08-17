import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import {
    GetHistoryPieChart,
    IGetHistoryPieChartData,
} from '../../../features/History/GetHistoryPieChart'
import { MapHistoryItems } from '../../../features/History/MapHistoryItems'
import { SIZES, SPACING, useFetchData } from '../../../shared'
import { ContentIn } from '../../../shared/ContentIn'
import { CenteredState } from '../../../shared/CenteredState'
import { RangePicker, useRangePicker } from '../../../shared/RangePicker'
import { historyWidgetApi } from '../api/historyWidgetApi'
import { IHistoryWidgetGetItemsData } from '../config/IHistoryWidgetGetItemsData'
import { HistoryStore } from '../model/HistoryStore'
import { HistoryWidgetSkeleton } from './HistoryWidgetSkeleton'

export const HistoryWidget = memo(() => {
    const { dates, handleChangeDates, handleResetDate } = useRangePicker()
    const loadMoreTick = HistoryStore.useLoadMoreTick()
    const [page, setPage] = useState(1)

    const {
        errorText: pieChartErrorText,
        fetchData: fetchPieChartData,
        isDataLoading: isPieChartDataLoading,
        data: pieChartData,
    } = useFetchData<
        IGetHistoryPieChartData,
        { start_date?: string; end_date?: string }
    >({
        apiCallback: historyWidgetApi.getHistoryPieChart,
        errorText: 'Ошибка при получении данных',
    })

    const {
        errorText: historyItemsErrorText,
        fetchData: fetchHistoryJournal,
        isDataLoading: isHistoryItemsLoading,
        data: historyItemsData,
        setData: setHistoryItemsData,
    } = useFetchData<
        IHistoryWidgetGetItemsData,
        { page: number; start_date?: string; end_date?: string }
    >({
        apiCallback: historyWidgetApi.getHistoryItems,
        errorText: 'Ошибка при получении данных',
    })

    const loadPeriod = useCallback(() => {
        setPage(1)
        fetchHistoryJournal({
            args: {
                page: 1,
                end_date: dates.endDate,
                start_date: dates.startDate,
            },
            hideToastOnError: true,
        })
        fetchPieChartData({
            args: { end_date: dates.endDate, start_date: dates.startDate },
            hideToastOnError: true,
        })
    }, [dates])

    const handleScrollToEnd = useCallback(() => {
        const nextPage = page + 1

        if (!historyItemsData?.pages || nextPage > historyItemsData.pages) {
            return
        }

        // Догружаем именно следующую страницу: раньше запрашивалась текущая,
        // уже загруженная, и первая страница дублировалась в списке.
        fetchHistoryJournal({
            args: {
                page: nextPage,
                end_date: dates.endDate,
                start_date: dates.startDate,
            },
            afterDataCallback(data) {
                setPage(nextPage)
                setHistoryItemsData((prev) =>
                    prev
                        ? {
                              ...prev,
                              journal: [...prev.journal, ...data.journal],
                          }
                        : prev
                )
            },
        })
    }, [page, dates, historyItemsData])

    // Первая загрузка приходит этим же эффектом: отдельный useEffect на []
    // дублировал её, и на монтировании уходило четыре запроса вместо двух.
    useEffect(() => {
        loadPeriod()
    }, [loadPeriod])

    // Долистывание до конца ловит layout на слое screens и кладёт в стор.
    // Первый рендер пропускаем: тика ещё не было.
    const isFirstTick = useRef(true)
    useEffect(() => {
        if (isFirstTick.current) {
            isFirstTick.current = false
            return
        }
        handleScrollToEnd()
    }, [loadMoreTick])

    const styles = StyleSheet.create({
        chart: {
            marginTop: SPACING.MD * SIZES.PX,
        },
    })

    if ((isHistoryItemsLoading && !historyItemsData) || isPieChartDataLoading) {
        return <HistoryWidgetSkeleton />
    }

    if (historyItemsErrorText || pieChartErrorText) {
        return (
            <CenteredState
                variant="error"
                title="Не удалось загрузить историю"
                error={historyItemsErrorText || pieChartErrorText}
                action={{ label: 'Повторить', onPress: loadPeriod }}
            />
        )
    }

    return (
        <ContentIn>
            <RangePicker
                onResetDate={handleResetDate}
                dates={dates}
                onChangeDates={handleChangeDates}
            />

            <View style={styles.chart}>
                <GetHistoryPieChart data={pieChartData} />
            </View>

            <MapHistoryItems items={historyItemsData?.journal} />
        </ContentIn>
    )
})
