import React from 'react'
import { InternalPagesLayout } from '../../../layouts/InternalPagesLayout'
import { NewsWidget } from '../../../widgets/News/NewsWidget'
import { useLocalSearchParams } from 'expo-router'
import { TNewsDetailsScreenParams } from '../../../entities/NewsItem'

type Props = {}

export const NewsScreen = (props: Props) => {
    return (
        <InternalPagesLayout>
            <NewsWidget  />
        </InternalPagesLayout>
    )
}
