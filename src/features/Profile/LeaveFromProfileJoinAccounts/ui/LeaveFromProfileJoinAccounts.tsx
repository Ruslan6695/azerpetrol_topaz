import { memo } from 'react'
import { StyleSheet } from 'react-native'
import {
    PRESS_SCALE,
    SIZES,
    SPACING,
    ThemeStore,
    useModal,
} from '../../../../shared'
import { PressableScale } from '../../../../shared/PressableScale'
import { Typography } from '../../../../shared/Typography'
import { LeaveFromProfileJoinAccountsModal } from './LeaveFromProfileJoinAccountsModal'

type Props = {
    onLeave: () => void
}

export const LeaveFromProfileJoinAccounts = memo(({ onLeave }: Props) => {
    const COLORS = ThemeStore.useCOLORS()
    const { handleCloseModal, handleOpenModal, isShowModal } = useModal()

    const styles = StyleSheet.create({
        container: {
            alignSelf: 'flex-start',
            marginTop: SPACING.MD * SIZES.PX,
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
                    type="label13"
                    customColor={COLORS.STATE.Destructive}
                >
                    Покинуть группу
                </Typography>
            </PressableScale>

            <LeaveFromProfileJoinAccountsModal
                onLeave={onLeave}
                handleClose={handleCloseModal}
                isOpened={isShowModal}
            />
        </>
    )
})
