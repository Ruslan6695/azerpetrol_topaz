import { memo } from 'react'
import { InternalPagesLayout } from '../../../layouts/InternalPagesLayout'
import { NewsDetailsWidget } from '../../../widgets/News/NewsDetailsWidget'
import { useLocalSearchParams } from 'expo-router'
import { TNewsDetailsScreenParams } from '../../../entities/News/NewsItem'

type Props = {}

export const NewsDetailsScreen = memo((props: Props) => {
    const params = useLocalSearchParams<TNewsDetailsScreenParams>()

    return <NewsDetailsWidget params={params} />
})

export default NewsDetailsScreen
