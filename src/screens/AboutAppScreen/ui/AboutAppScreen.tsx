import React from 'react'
import { InternalPagesLayout } from '../../../layouts/InternalPagesLayout'
import { EGetAricleIds, GetArticle } from '../../../features/GetArticle'

type Props = {}

export const AboutAppScreen = (props: Props) => {
    return (
        <InternalPagesLayout>
            <GetArticle id={EGetAricleIds.ABOUT_APP} />
        </InternalPagesLayout>
    )
}
