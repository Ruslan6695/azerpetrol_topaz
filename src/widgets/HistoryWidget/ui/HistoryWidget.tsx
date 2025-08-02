import React, { memo, useCallback, useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { ErrorWhileFetchingForm } from '../../../entities/ErrorWhileFetchingForm'
import {
    GetHistoryPieChart,
    IGetHistoryPieChartData,
} from '../../../features/History/GetHistoryPieChart'
import { MapHistoryItems } from '../../../features/History/MapHistoryItems'
import { InternalPagesLayout } from '../../../layouts/InternalPagesLayout'
import { useFetchData } from '../../../shared'
import { RangePicker, useRangePicker } from '../../../shared/RangePicker'
import { historyWidgetApi } from '../api/historyWidgetApi'
import { IHistoryWidgetGetItemsData } from '../config/IHistoryWidgetGetItemsData'
import { HistoryWidgetSkeleton } from './HistoryWidgetSkeleton'

type Props = {}

export const HistoryWidget = memo(({}: Props) => {
    const { dates, handleChangeDates, handleResetDate } = useRangePicker()
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

    const onChangeDates = useCallback(() => {
        fetchHistoryJournal({
            args: {
                page,
                end_date: dates.endDate,
                start_date: dates.startDate,
            },
            hideToastOnError: true,
        })
        fetchPieChartData({
            args: { end_date: dates.endDate, start_date: dates.startDate },
            hideToastOnError: true,
        })
    }, [dates, page])

    const handleScrollToEnd = useCallback(() => {
        if (historyItemsData?.pages && page < historyItemsData.pages) {
            fetchHistoryJournal({
                args: {
                    page,
                    end_date: dates.endDate,
                    start_date: dates.startDate,
                },
                afterDataCallback(data) {
                    setHistoryItemsData((prev) => {
                        if (prev) {
                            return {
                                ...prev,
                                journal: [...prev.journal, ...data.journal],
                            }
                        }
                    })
                },
            })
            setPage((prev) => (prev += 1))
        }
    }, [page, dates, historyItemsData])

    useEffect(() => {
        fetchHistoryJournal({
            args: { page: 1 },
            hideToastOnError: true,
        })
        fetchPieChartData({
            args: {},
            hideToastOnError: true,
        })
    }, [])

    useEffect(() => {
        onChangeDates()
    }, [dates])

    return (
        <InternalPagesLayout onScrollToEnd={handleScrollToEnd}>
            {(isHistoryItemsLoading && !historyItemsData) ||
            isPieChartDataLoading ? (
                <HistoryWidgetSkeleton />
            ) : historyItemsErrorText || pieChartErrorText ? (
                <ErrorWhileFetchingForm
                    margins={{ mt: 50 }}
                    onReload={onChangeDates}
                    message={historyItemsErrorText || pieChartErrorText || ''}
                />
            ) : (
                <>
                    <View style={styles.container}>
                        <RangePicker
                            onResetDate={handleResetDate}
                            dates={dates}
                            onChangeDates={handleChangeDates}
                            styled={{
                                width: { type: 'px', value: 320 },
                                marginsPaddings: { mb: 10 },
                            }}
                        />

                        <GetHistoryPieChart data={pieChartData} />
                    </View>
                    <MapHistoryItems items={historyItemsData?.journal} />
                </>
            )}
        </InternalPagesLayout>
    )
})

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
})
