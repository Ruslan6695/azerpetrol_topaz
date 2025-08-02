import { memo } from 'react'
import { InternalPagesLayout } from '../../../layouts/InternalPagesLayout'
import { EGetAricleIds, GetArticle } from '../../../features/GetArticle'

type Props = {}

export const HelpScreen = memo((props: Props) => {
    return (
        <InternalPagesLayout>
            <GetArticle id={EGetAricleIds.HELP} />
        </InternalPagesLayout>
    )
})
