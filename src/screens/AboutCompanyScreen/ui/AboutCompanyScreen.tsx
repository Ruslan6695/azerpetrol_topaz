import React from 'react'
import { InternalPagesLayout } from '../../../layouts/InternalPagesLayout'
import { EGetAricleIds, GetArticle } from '../../../features/GetArticle'

type Props = {}

export const AboutCompanyScreen = (props: Props) => {
    return (
        <InternalPagesLayout>
            <GetArticle id={EGetAricleIds.ABOUT_COMPANY} />
        </InternalPagesLayout>
    )
}
