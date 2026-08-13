import { memo } from 'react'
import { InternalPagesLayout } from '../../../layouts/InternalPagesLayout'
import { Settings } from '../../../proccesses/Settings'

export const SettingsScreen = memo(() => {
    return (
        <InternalPagesLayout>
            <Settings />
        </InternalPagesLayout>
    )
})
