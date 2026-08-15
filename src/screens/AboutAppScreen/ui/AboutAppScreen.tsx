import { memo } from 'react'
import { EGetAricleIds, GetArticle } from '../../../features/GetArticle'
import { InternalPagesLayout } from '../../../layouts/InternalPagesLayout'

export const AboutAppScreen = memo(() => {
    return (
        <InternalPagesLayout>
            <GetArticle id={EGetAricleIds.ABOUT_APP} />
        </InternalPagesLayout>
    )
})
