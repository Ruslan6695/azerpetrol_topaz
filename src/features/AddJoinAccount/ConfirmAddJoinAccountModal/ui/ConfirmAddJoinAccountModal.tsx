import { memo, useCallback, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { InfoCard } from '../../../../entities/InfoCard'
import {
    RADII,
    SIZES,
    SPACING,
    ThemeStore,
    UserStore,
    useFetchData,
    useModal,
    useSendFetch,
} from '../../../../shared'
import { BottomSheet } from '../../../../shared/BottomSheet'
import { Icon } from '../../../../shared/Icons'
import { PillButton } from '../../../../shared/PillButton'
import { showToast } from '../../../../shared/ToastComponent'
import { Typography } from '../../../../shared/Typography'
import { confirmAddJoinAccountModalApi } from '../api/confirmAddJoinAccountModalApi'
import { CONFIRM_ADD_JOIN_ACCOUNT_MODAL_INFO_TEXTS } from '../config/constants/CONFIRM_ADD_JOIN_ACCOUNT_MODAL_INFO_TEXTS'

const AVATAR_SIZE = 96
const AVATAR_ICON_SIZE = 44
const GRABBER_WIDTH = 40
const GRABBER_HEIGHT = 4

export const ConfirmAddJoinAccountModal = memo(() => {
    const COLORS = ThemeStore.useCOLORS()
    const insets = useSafeAreaInsets()
    // Именно флаг, а не сам user: объект пересоздаётся при обновлении токена,
    // и эффект уходил бы в лишний запрос приглашения.
    const isAuthorized = !!UserStore.useUser()
    const { data, fetchData } = useFetchData({
        apiCallback: confirmAddJoinAccountModalApi.getInfo,
        errorText: 'Ошибка при получении данных',
    })
    const {
        sendFetch: sendConfirmFetch,
        isSendFetchLoading: isConfirmLoading,
    } = useSendFetch({
        apiCallback: confirmAddJoinAccountModalApi.confirm,
        errorText: 'Не удалось присоединиться к общему балансу.',
    })
    const { sendFetch: sendAbortFetch, isSendFetchLoading: isAbortLoading } =
        useSendFetch({
            apiCallback: confirmAddJoinAccountModalApi.abort,
            errorText: 'Не удалось отклонить приглашение.',
        })
    const { handleCloseModal, handleOpenModal, isShowModal } = useModal()

    const handleConfirm = useCallback(() => {
        if (data?.invite) {
            sendConfirmFetch({
                args: undefined,
                afterDataCallback() {
                    showToast({
                        text: 'Привязка к общему счету прошла успешно',
                        type: 'success',
                    })
                },
                finalyCallback() {
                    handleCloseModal()
                },
            })
        }
    }, [data, sendConfirmFetch, handleCloseModal])

    const handleAbort = useCallback(() => {
        if (data?.invite) {
            sendAbortFetch({
                args: undefined,
                finalyCallback() {
                    handleCloseModal()
                },
            })
        }
    }, [data, sendAbortFetch, handleCloseModal])

    // Компонент смонтирован в корневом layout и переживает вход в аккаунт,
    // поэтому приглашение запрашиваем при появлении пользователя, а не один
    // раз на монтировании — иначе логин после холодного старта его не увидит.
    useEffect(() => {
        if (!isAuthorized) {
            handleCloseModal()
            return
        }

        fetchData({
            args: undefined,
            onErrorCallback() {
                handleCloseModal()
            },
            afterDataCallback(data) {
                if (data.invite) {
                    handleOpenModal()
                }
            },
            hideToastOnError: true,
        })
    }, [isAuthorized])

    const styles = StyleSheet.create({
        container: {
            alignItems: 'center',
            gap: SPACING.MD * SIZES.PX,
            paddingHorizontal: SPACING.SCREEN * SIZES.PX,
            paddingTop: SPACING.MD * SIZES.PX,
            paddingBottom: SPACING.SCREEN * SIZES.PX + insets.bottom,
        },
        grabber: {
            width: GRABBER_WIDTH * SIZES.PX,
            height: GRABBER_HEIGHT * SIZES.PX,
            borderRadius: RADII.PILL,
            backgroundColor: COLORS.GLASS.Border,
            marginBottom: SPACING.XS * SIZES.PX,
        },
        avatar: {
            width: AVATAR_SIZE * SIZES.PX,
            height: AVATAR_SIZE * SIZES.PX,
            borderRadius: RADII.PILL,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: COLORS.GLASS.Secondary,
            borderWidth: 1,
            borderColor: COLORS.GLASS.Border,
        },
        infoList: {
            width: '100%',
            gap: SPACING.SM * SIZES.PX,
            marginTop: SPACING.XS * SIZES.PX,
        },
        actions: {
            width: '100%',
            gap: SPACING.ROW_GAP * SIZES.PX,
            marginTop: SPACING.SM * SIZES.PX,
        },
    })

    return (
        <BottomSheet isOpened={isShowModal} bgDark>
            <View style={styles.container}>
                <View style={styles.grabber} />

                <View style={styles.avatar}>
                    <Icon name="person" size={AVATAR_ICON_SIZE} />
                </View>

                <Typography type="h6" textAlign="center">
                    {data?.invite?.name}
                </Typography>

                <Typography type="body13" color="secondary" textAlign="center">
                    {data?.invite?.phone}
                </Typography>

                <Typography type="body125" color="secondary" textAlign="center">
                    Приглашает вас присоединиться к общему счёту.
                </Typography>

                <View style={styles.infoList}>
                    {CONFIRM_ADD_JOIN_ACCOUNT_MODAL_INFO_TEXTS.map(
                        (infoBlock) => (
                            <InfoCard
                                key={infoBlock.title}
                                title={infoBlock.title}
                                info={infoBlock.info}
                            />
                        )
                    )}
                </View>

                <View style={styles.actions}>
                    <PillButton
                        title="Принять"
                        onPress={handleConfirm}
                        loading={isConfirmLoading}
                        disabled={isAbortLoading}
                    />
                    <PillButton
                        title="Отклонить"
                        variant="secondary"
                        onPress={handleAbort}
                        loading={isAbortLoading}
                        disabled={isConfirmLoading}
                    />
                </View>
            </View>
        </BottomSheet>
    )
})
