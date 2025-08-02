import React from 'react'
import { StyleSheet, View } from 'react-native'
import { CloseIcon } from '../../../../shared/CloseIcon'
import { CustomText } from '../../../../shared/CustomText'
import { COLORS, SIZES, useModal } from '../../../../shared'
import { CustomTouchableOpacity } from '../../../../shared/CustomTouchableOpacity'
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
                <CloseIcon size={20} red />
                <CustomText marginsPaddings={{ ml: 10 }} color={COLORS.RED}>
                    Покинуть группу
                </CustomText>
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
        padding: SIZES.PX * 5,
        paddingBottom: 0,
        marginTop: SIZES.PX * 5,
    },
})
