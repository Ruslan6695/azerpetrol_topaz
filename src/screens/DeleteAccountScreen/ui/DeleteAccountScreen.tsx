import { memo } from 'react'
import { DeleteAccount } from '../../../features/DeleteAccount'
import { InternalPagesLayout } from '../../../layouts/InternalPagesLayout'

export const DeleteAccountScreen = memo(() => {
    return (
        <InternalPagesLayout>
            <DeleteAccount />
        </InternalPagesLayout>
    )
})
