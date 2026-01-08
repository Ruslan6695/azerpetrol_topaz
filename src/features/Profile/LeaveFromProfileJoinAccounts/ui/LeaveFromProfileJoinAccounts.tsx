import React from 'react'
import { StyleSheet } from 'react-native'
import { useModal } from '../../../../shared'
import { CustomTouchableOpacity } from '../../../../shared/CustomTouchableOpacity'
import { Typography } from '../../../../shared/Typography'
import { LeaveFromProfileJoinAccountsModal } from './LeaveFromProfileJoinAccountsModal'

type Props = {
    onLeave: () => void
}

export const LeaveFromProfileJoinAccounts = ({ onLeave }: Props) => {
    const { handleCloseModal, handleOpenModal, isShowModal } = useModal()
    return (
        <>
            <CustomTouchableOpacity
                onPress={handleOpenModal}
                activeOpacity={0.6}
                style={styles.container}
            >
                <Typography color="error" type="bodyAccentSmall">
                    Покинуть группу
                </Typography>
            </CustomTouchableOpacity>

            <LeaveFromProfileJoinAccountsModal
                onLeave={onLeave}
                handleClose={handleCloseModal}
                isOpened={isShowModal}
            />
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 0,
    },
})
