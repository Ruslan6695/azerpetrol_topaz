import React, { useCallback } from 'react'
import { IProfileJoinAccountItem } from '../config/interfaces/IProfileJoinAccountItem'
import { StyleSheet, View } from 'react-native'
import { COLORS, SIZES } from '../../../../shared'
import { ProfileImg } from '../../ProfileImg'
import { CustomText } from '../../../../shared/CustomText'
import { CloseIcon } from '../../../../shared/CloseIcon'
import { CustomTouchableOpacity } from '../../../../shared/CustomTouchableOpacity'

interface IProps extends IProfileJoinAccountItem {
    onDeleteAccount: (account: IProfileJoinAccountItem) => void
    deleteDisabled?: boolean
    isCreator: boolean
}

export const ProfileJoinAccountItem = ({
    id,
    name,
    onDeleteAccount,
    deleteDisabled,
    isCreator,
}: IProps) => {
    const handleDelete = useCallback(() => {
        onDeleteAccount({ id, name })
    }, [id, onDeleteAccount, name])

    const styles = StyleSheet.create({
        container: {
            backgroundColor: isCreator ? 'rgba(255,217,0,0.2)' : COLORS.WHITE,
            borderRadius: SIZES.PX * 15,
            alignItems: 'center',
            height: 110 * SIZES.PX,
            justifyContent: 'center',
            padding: SIZES.PX * 15,
            minWidth: SIZES.WIDTH(0.3),
            position: 'relative',
        },
        deleteButton: {
            position: 'absolute',
            top: 0 * SIZES.PX,
            right: 0 * SIZES.PX,
            marginBottom: SIZES.PX * 20,
            padding: SIZES.PX * 5,
        },
    })
    return (
        <View style={styles.container}>
            {!deleteDisabled && (
                <CustomTouchableOpacity
                    onPress={handleDelete}
                    style={styles.deleteButton}
                >
                    <CloseIcon size={22} red />
                </CustomTouchableOpacity>
            )}

            <ProfileImg size={42} />
            <CustomText fz={13}>{name}</CustomText>
            {isCreator && <CustomText fz={8}>создатель</CustomText>}
        </View>
    )
}
