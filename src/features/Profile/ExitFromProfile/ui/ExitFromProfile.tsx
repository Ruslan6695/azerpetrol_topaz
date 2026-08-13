import { memo, useCallback } from 'react'
import { StyleSheet } from 'react-native'
import {
    PRESS_SCALE,
    SIZES,
    ThemeStore,
    UserStore,
    useModal,
} from '../../../../shared'
import { ConfirmDialog } from '../../../../shared/ConfirmDialog'
import { PressableScale } from '../../../../shared/PressableScale'
import { Typography } from '../../../../shared/Typography'

export const ExitFromProfile = memo(() => {
    const COLORS = ThemeStore.useCOLORS()
    const logout = UserStore.useLogout()
    const { handleCloseModal, handleOpenModal, isShowModal } = useModal()

    const handleConfirm = useCallback(() => {
        logout()
    }, [logout])

    const styles = StyleSheet.create({
        container: {
            padding: 6 * SIZES.PX,
        },
    })

    return (
        <>
            <PressableScale
                onPress={handleOpenModal}
                scaleTo={PRESS_SCALE.ROW}
                style={styles.container}
            >
                <Typography
                    type="label14"
                    textAlign="center"
                    customColor={COLORS.STATE.Destructive}
                >
                    Выйти
                </Typography>
            </PressableScale>

            <ConfirmDialog
                isOpened={isShowModal}
                onClose={handleCloseModal}
                onConfirm={handleConfirm}
                title="Выйти из аккаунта?"
                description="Вы сможете войти снова по номеру телефона."
                confirmLabel="Выйти"
            />
        </>
    )
})
