import { memo, useCallback, useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import {
    PRESS_SCALE,
    RADII,
    SIZES,
    SPACING,
    ThemeStore,
} from '../../../../shared'
import { Icon } from '../../../../shared/Icons'
import { PressableScale } from '../../../../shared/PressableScale'
import { Typography } from '../../../../shared/Typography'
import { IProfileJoinAccountItem } from '../config/interfaces/IProfileJoinAccountItem'

interface IProps extends IProfileJoinAccountItem {
    onDeleteAccount: (account: IProfileJoinAccountItem) => void
    deleteDisabled?: boolean
    isCreator: boolean
}

const TILE_WIDTH = 100
const AVATAR_SIZE = 36
const CLOSE_SIZE = 20

// Плитка связанного аккаунта. У владельца счёта она лаймовая — так в макете
// сразу видно, чей это счёт.
export const ProfileJoinAccountItem = memo(
    ({ id, name, onDeleteAccount, deleteDisabled, isCreator }: IProps) => {
        const COLORS = ThemeStore.useCOLORS()

        const handleDelete = useCallback(() => {
            onDeleteAccount({ id, name })
        }, [id, onDeleteAccount, name])

        const contentColor = isCreator
            ? COLORS.ACCENT.OnLime
            : COLORS.TEXT.Primary

        const styles = useMemo(
            () =>
                StyleSheet.create({
                    container: {
                        width: TILE_WIDTH * SIZES.PX,
                        backgroundColor: isCreator
                            ? COLORS.ACCENT.Lime
                            : COLORS.GLASS.Secondary,
                        borderRadius: RADII.INPUT * SIZES.PX,
                        padding: SPACING.MD * SIZES.PX,
                        position: 'relative',
                    },
                    avatar: {
                        width: AVATAR_SIZE * SIZES.PX,
                        height: AVATAR_SIZE * SIZES.PX,
                        borderRadius: RADII.PILL,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: COLORS.GLASS.TileAvatar,
                    },
                    deleteButton: {
                        position: 'absolute',
                        top: 6 * SIZES.PX,
                        right: 6 * SIZES.PX,
                        width: CLOSE_SIZE * SIZES.PX,
                        height: CLOSE_SIZE * SIZES.PX,
                        borderRadius: RADII.PILL,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: COLORS.GLASS.TileClose,
                        zIndex: 1,
                    },
                }),
            [COLORS, isCreator]
        )

        return (
            <View style={styles.container}>
                {!deleteDisabled && (
                    <PressableScale
                        onPress={handleDelete}
                        scaleTo={PRESS_SCALE.CHIP}
                        style={styles.deleteButton}
                    >
                        <Typography type="label13" customColor={contentColor}>
                            ✕
                        </Typography>
                    </PressableScale>
                )}

                <View style={styles.avatar}>
                    <Icon name="person" size={18} color={contentColor} />
                </View>

                <Typography
                    type="label13"
                    numberOfLines={1}
                    customColor={contentColor}
                    marginsPaddings={{ mt: SPACING.ROW_GAP }}
                >
                    {name}
                </Typography>
            </View>
        )
    }
)
