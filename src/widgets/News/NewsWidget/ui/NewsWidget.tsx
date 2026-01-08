import { memo, useCallback, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { ErrorWhileFetchingForm } from '../../../../entities/ErrorWhileFetchingForm'
import { ScreenTitle } from '../../../../entities/ScreenTitle'
import { SIZES, useFetchData } from '../../../../shared'
import { newsWidgetApi } from '../api/newsWidgetApi'
import { NewsItem, NewsItemSkeleton } from '../../../../entities/News/NewsItem'
import { WithoutNewsBlock } from '../../../../entities/News/WithoutNewsBlock'
import { Typography } from '../../../../shared/Typography'

type Props = {}

export const NewsWidget = memo(({}: Props) => {
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
    return (
        <>
            <Typography marginsPaddings={{ mb: 10 }} type="headlineSmall">
                Новости
            </Typography>
            {isDataLoading ? (
                <View style={styles.container}>
                    {[1, 2, 3, 4, 5, 6].map((id) => (
                        <NewsItemSkeleton key={id} />
                    ))}
                </View>
            ) : errorText ? (
                <ErrorWhileFetchingForm
                    buttonProps={{ type: 'primary' }}
                    onReload={handleReloadData}
                    message={errorText}
                />
            ) : (
                <View style={styles.container}>
                    {data?.news?.length === 0 ? (
                        <WithoutNewsBlock />
                    ) : (
                        data?.news?.map((ne) => (
                            <NewsItem {...ne} key={ne.id} />
                        ))
                    )}
                </View>
            )}
        </>
    )
})

const styles = StyleSheet.create({
    container: {
        gap: SIZES.PX * 10,
    },
})
