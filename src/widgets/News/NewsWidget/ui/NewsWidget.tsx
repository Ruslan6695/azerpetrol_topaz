import { memo, useCallback, useEffect, useMemo } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { ErrorWhileFetchingForm } from '../../../../entities/ErrorWhileFetchingForm'
import {
    NewsCard,
    NewsCardSkeleton,
    NewsItem,
    NewsItemSkeleton,
} from '../../../../entities/News/NewsItem'
import { WithoutNewsBlock } from '../../../../entities/News/WithoutNewsBlock'
import { OpenNewsScreen } from '../../../../features/News/OpenNewsScreen'
import { SIZES, SPACING, useFetchData } from '../../../../shared'
import { Typography } from '../../../../shared/Typography'
import { newsWidgetApi } from '../api/newsWidgetApi'

type Props = {
    /** carousel — горизонтальная лента на главной, list — экран /news */
    variant?: 'list' | 'carousel'
}

export const NewsWidget = memo(({ variant = 'list' }: Props) => {
    const { data, errorText, fetchData, isDataLoading } = useFetchData({
        apiCallback: newsWidgetApi.getNews,
        errorText: 'Ошибка при загрузке данных',
    })

    const handleReloadData = useCallback(() => {
        fetchData({
            args: undefined,
            hideToastOnError: true,
        })
    }, [fetchData])

    useEffect(() => {
        handleReloadData()
    }, [handleReloadData])

    const isCarousel = variant === 'carousel'

    const styles = useMemo(
        () =>
            StyleSheet.create({
                // Зазор между карточками экрана /news — 12 по макету,
                // у карусели главной он свой (10).
                container: {
                    gap: SPACING.MD * SIZES.PX,
                },
                section: {
                    gap: SPACING.MD * SIZES.PX,
                },
                carouselContent: {
                    gap: SPACING.ROW_GAP * SIZES.PX,
                    paddingBottom: 2 * SIZES.PX,
                },
            }),
        []
    )

    const content = errorText ? (
        <ErrorWhileFetchingForm
            onReload={handleReloadData}
            message={errorText}
        />
    ) : isCarousel ? (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselContent}
        >
            {isDataLoading
                ? [1, 2, 3].map((id) => <NewsCardSkeleton key={id} />)
                : data?.news?.map((ne) => <NewsCard {...ne} key={ne.id} />)}
        </ScrollView>
    ) : (
        <View style={styles.container}>
            {isDataLoading
                ? [1, 2, 3, 4, 5, 6].map((id) => <NewsItemSkeleton key={id} />)
                : data?.news?.map((ne) => <NewsItem {...ne} key={ne.id} />)}
        </View>
    )

    const isEmpty = !isDataLoading && !errorText && data?.news?.length === 0

    if (isCarousel) {
        // Секции новостей на главной нет, пока не пришло ни одной новости.
        if (isEmpty) {
            return null
        }
        return (
            <View style={styles.section}>
                <OpenNewsScreen />
                {content}
            </View>
        )
    }

    return (
        <>
            <Typography marginsPaddings={{ mb: SPACING.MD }} type="num18">
                Новости
            </Typography>
            {isEmpty ? <WithoutNewsBlock /> : content}
        </>
    )
})
