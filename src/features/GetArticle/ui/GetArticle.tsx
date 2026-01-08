import { memo, useCallback, useEffect } from 'react'
import RenderHTML from 'react-native-render-html'
import { EColorThemes, SIZES, ThemeStore, useFetchData } from '../../../shared'
import { getArticleApi } from '../api/getArticleApi'
import { Loader } from '../../../shared/Loader'
import { ErrorWhileFetchingForm } from '../../../entities/ErrorWhileFetchingForm'
import { StyleSheet, View, ViewBase } from 'react-native'
import { EGetAricleIds } from '../config/enums/EGetAricleIds'

type Props = {
    id: EGetAricleIds
}

export const GetArticle = memo(({ id }: Props) => {
    const colorTheme = ThemeStore.useTheme()
    const { data, errorText, fetchData, isDataLoading } = useFetchData({
        apiCallback: getArticleApi.getArticle,
        errorText: 'Ошибка при получении данных',
    })

    const handleReloadData = useCallback(() => {
        fetchData({
            args: { id },
            hideToastOnError: true,
            onErrorCallback(error) {},
        })
    }, [id])

    useEffect(() => {
        handleReloadData()
    }, [])
    if (isDataLoading) {
        return (
            <View style={styles.center}>
                <Loader />
            </View>
        )
    }
    if (errorText) {
        return (
            <View style={styles.center}>
                <ErrorWhileFetchingForm
                    onReload={handleReloadData}
                    message={errorText}
                />
            </View>
        )
    }

    return (
        <>
            {data?.html_text ? (
                <RenderHTML
                    baseStyle={{
                        color:
                            colorTheme == EColorThemes.DARK
                                ? 'white'
                                : undefined,
                    }}
                    contentWidth={SIZES.WIDTH(1)}
                    source={{ html: data?.html_text }}
                ></RenderHTML>
            ) : (
                <></>
            )}
        </>
    )
})

const styles = StyleSheet.create({
    center: {
        justifyContent: 'center',
        height: SIZES.HEIGHT(0.7),
    },
})
