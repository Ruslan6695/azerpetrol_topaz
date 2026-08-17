import { useFocusEffect } from 'expo-router'
import { memo, useCallback, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { ErrorWhileFetchingForm } from '../../../entities/ErrorWhileFetchingForm'
import { IProfileJoinAccountItem } from '../../../entities/Profile/ProfileJoinAccountItem'
import { ScreenTitle } from '../../../entities/ScreenTitle'
import { ChangeColorTheme } from '../../../features/ChangeColorTheme'
import { DeleteJoinAccountModal } from '../../../features/Profile/DeleteJoinAccountModal'
import {
    SIZES,
    SPACING,
    UserStore,
    useFetchData,
    useModal,
} from '../../../shared'
import { ProfileJoinAccountsWidget } from '../../../widgets/Profile/ProfileJoinAccountsWidget'
import { ProfileLinksWidget } from '../../../widgets/Profile/ProfileLinksWidget'
import { ProfileWidget } from '../../../widgets/Profile/ProfileWidget'
import { profileApi } from '../api/profileApi'

export const Profile = memo(() => {
    const setBalance = UserStore.useSetBalance()
    const { data, errorText, fetchData, setData, isDataLoading } = useFetchData(
        {
            apiCallback: profileApi.getProfileInfo,
            errorText: 'Ошибка при получении данных',
        }
    )

    const [accountToDelete, setAccountToDelete] =
        useState<IProfileJoinAccountItem | null>(null)
    const {
        handleCloseModal: handleCloseDeleteJoinAccountModal,
        handleOpenModal: handleOpenDeleteJoinAccountModal,
        isShowModal: isShowDeleteJoinAccountModal,
    } = useModal()

    const handleOpenDeleteJoinAccount = useCallback(
        (account: IProfileJoinAccountItem) => {
            setAccountToDelete(account)
            handleOpenDeleteJoinAccountModal()
        },
        [handleOpenDeleteJoinAccountModal]
    )

    const handleDeleteJoinAccount = useCallback(() => {
        setData((prev) => {
            if (prev)
                return {
                    ...prev,
                    join_accounts: prev.join_accounts.filter(
                        (ja) => ja.id !== accountToDelete?.id
                    ),
                }
            return
        })
        setAccountToDelete(null)
    }, [setData, accountToDelete])

    const handleReloadData = useCallback(() => {
        fetchData({
            args: undefined,
            afterDataCallback(data) {
                setBalance({
                    balance: data.balance,
                    bonus_balance: data.bonus_balance,
                })
            },
            hideToastOnError: true,
        })
    }, [fetchData, setBalance])

    useFocusEffect(
        useCallback(() => {
            handleReloadData()
        }, [handleReloadData])
    )
    const styles = StyleSheet.create({
        container: {
            gap: SPACING.MD * SIZES.PX,
        },
    })

    return (
        <View style={styles.container}>
            <ScreenTitle title="Профиль" />

            {errorText ? (
                <ErrorWhileFetchingForm
                    message={errorText}
                    onReload={handleReloadData}
                />
            ) : (
                <>
                    <ProfileWidget
                        isDataLoading={!data && isDataLoading}
                        name={data?.name}
                        phone={data?.phone}
                    />
                    <ChangeColorTheme />
                    <ProfileJoinAccountsWidget
                        isDataLoading={!data && isDataLoading}
                        onReloadData={handleReloadData}
                        profileId={data?.id}
                        balanceCreatorId={data?.balance_creator_id}
                        onDeleteAccount={handleOpenDeleteJoinAccount}
                        join_accounts={data?.join_accounts}
                    />
                </>
            )}

            <ProfileLinksWidget />
            {accountToDelete && (
                <DeleteJoinAccountModal
                    onDeleteAccount={handleDeleteJoinAccount}
                    deletingAccount={accountToDelete}
                    isOpened={isShowDeleteJoinAccountModal}
                    handleClose={handleCloseDeleteJoinAccountModal}
                />
            )}
        </View>
    )
})
