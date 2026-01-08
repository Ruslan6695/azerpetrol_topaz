import React from 'react'
import { StyleSheet, View } from 'react-native'
import { DeleteAccountModal } from '../../../../features/DeleteAccount'
import { ExitFromProfile } from '../../../../features/Profile/ExitFromProfile'
import { MapProfileLinkItems } from '../../../../features/Profile/MapProfileLinkItems'
import { SIZES, useModal } from '../../../../shared'
import { MPLayout } from '../../../../shared/MpLayout'

type Props = {}

export const ProfileLinksWidget = ({}: Props) => {
    const { handleCloseModal, handleOpenModal, isShowModal } = useModal()
    const styles = StyleSheet.create({
        links: { paddingBottom: SIZES.PX * 13, borderRadius: 16 * SIZES.PX },
    })
    return (
        <MPLayout mt={16} mb={20}>
            <View style={styles.links}>
                <MapProfileLinkItems onDeleteAccount={handleOpenModal} />
                <ExitFromProfile />
            </View>

            <DeleteAccountModal
                isOpened={isShowModal}
                handleClose={handleCloseModal}
            />
        </MPLayout>
    )
}
