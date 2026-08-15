import { memo } from 'react'
import { EGetAricleIds, GetArticle } from '../../../features/GetArticle'
import { InternalPagesLayout } from '../../../layouts/InternalPagesLayout'

export const AboutCompanyScreen = memo(() => {
    return (
        <InternalPagesLayout>
            <GetArticle id={EGetAricleIds.ABOUT_COMPANY} />
        </InternalPagesLayout>
    )
})
