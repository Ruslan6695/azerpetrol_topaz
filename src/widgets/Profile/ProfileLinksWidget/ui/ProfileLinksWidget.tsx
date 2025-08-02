import React from 'react'
import { MapProfileLinkItems } from '../../../../features/Profile/MapProfileLinkItems'
import { MPLayout } from '../../../../shared/MpLayout'
import { ExitFromProfile } from '../../../../features/Profile/ExitFromProfile'
import { useModal } from '../../../../shared'
import { DeleteAccountModal } from '../../../../features/DeleteAccount'

type Props = {}

export const ProfileLinksWidget = ({}: Props) => {
    const { handleCloseModal, handleOpenModal, isShowModal } = useModal()

    return (
        <MPLayout mt={10} mb={20}>
            <MapProfileLinkItems onDeleteAccount={handleOpenModal} />
            <ExitFromProfile />
            <DeleteAccountModal
                isOpened={isShowModal}
                handleClose={handleCloseModal}
            />
        </MPLayout>
    )
}
