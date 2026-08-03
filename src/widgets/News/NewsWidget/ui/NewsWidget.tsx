import { memo, useCallback, useEffect } from 'react'
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
            afterDataCallback(data) {},
            hideToastOnError: true,
        })
    }, [])

    useEffect(() => {
        handleReloadData()
    }, [])

    const isCarousel = variant === 'carousel'

    const styles = StyleSheet.create({
        container: {
            gap: SIZES.PX * 10,
        },
        section: {
            gap: SPACING.MD * SIZES.PX,
        },
        carouselContent: {
            gap: 10 * SIZES.PX,
            paddingBottom: 2 * SIZES.PX,
        },
    })

    const content = errorText ? (
        <ErrorWhileFetchingForm
            buttonProps={{ type: 'primary' }}
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
            <Typography marginsPaddings={{ mb: 10 }} type="headlineSmall">
                Новости
            </Typography>
            {isEmpty ? <WithoutNewsBlock /> : content}
        </>
    )
})
