import React, { useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import { SIZES, ThemeStore } from '../../../../shared'
import { CloseIcon } from '../../../../shared/CloseIcon'
import { CustomTouchableOpacity } from '../../../../shared/CustomTouchableOpacity'
import { Typography } from '../../../../shared/Typography'
import { ProfileImg } from '../../ProfileImg'
import { IProfileJoinAccountItem } from '../config/interfaces/IProfileJoinAccountItem'

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
    const COLORS = ThemeStore.useCOLORS()
    const handleDelete = useCallback(() => {
        onDeleteAccount({ id, name })
    }, [id, onDeleteAccount, name])

    const styles = StyleSheet.create({
        container: {
            backgroundColor: isCreator
                ? COLORS.BRAND.Primary
                : COLORS.BACKGROUND.Primary,
            borderRadius: SIZES.PX * 8,
            height: 98 * SIZES.PX,
            padding: SIZES.PX * 12,
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
                    <CloseIcon size={19} />
                </CustomTouchableOpacity>
            )}

            <ProfileImg size={48} />
            <Typography
                color={isCreator ? 'invert' : undefined}
                type="captionAccent"
                marginsPaddings={{ mt: 12 }}
            >
                {name}
            </Typography>
        </View>
    )
}
