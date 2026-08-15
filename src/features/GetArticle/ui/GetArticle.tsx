import { memo, useCallback, useEffect } from 'react'
import { ErrorWhileFetchingForm } from '../../../entities/ErrorWhileFetchingForm'
import { RADII, useFetchData } from '../../../shared'
import { GlassCard } from '../../../shared/GlassCard'
import { HtmlContent } from '../../../shared/HtmlContent'
import { getArticleApi } from '../api/getArticleApi'
import { ARTICLE_CARD_PADDING } from '../config/constants/ARTICLE_CARD'
import { EGetAricleIds } from '../config/enums/EGetAricleIds'
import { GetArticleSkeleton } from './GetArticleSkeleton'

type Props = {
    id: EGetAricleIds
}

// Заголовок статьи выводит шапка экрана (SCREENS_TITLES → InternalPagesHeader),
// поэтому data.header внутри карточки не дублируем. Типографику разметки с
// бэкенда целиком держит shared/HtmlContent — здесь только рамка.
export const GetArticle = memo(({ id }: Props) => {
    const { data, errorText, fetchData, isDataLoading } = useFetchData({
        apiCallback: getArticleApi.getArticle,
        errorText: 'Ошибка при получении данных',
    })

    const handleReloadData = useCallback(() => {
        fetchData({
            args: { id },
            hideToastOnError: true,
        })
    }, [fetchData, id])

    useEffect(() => {
        handleReloadData()
    }, [handleReloadData])

    if (isDataLoading) {
        return <GetArticleSkeleton />
    }

    if (errorText) {
        return (
            <ErrorWhileFetchingForm
                onReload={handleReloadData}
                message={errorText}
                margins={{ mt: 40 }}
            />
        )
    }

    if (!data?.html_text) {
        return null
    }

    return (
        <GlassCard
            variant="glass2"
            radius={RADII.CARD}
            padding={ARTICLE_CARD_PADDING}
        >
            <HtmlContent html={data.html_text} />
        </GlassCard>
    )
})
