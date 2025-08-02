import { memo, useCallback, useEffect, useState } from 'react'
import { IProfileJoinAccountItem } from '../../../entities/Profile/ProfileJoinAccountItem'
import { DeleteJoinAccountModal } from '../../../features/Profile/DeleteJoinAccountModal'
import { UserStore, useFetchData, useModal } from '../../../shared'
import { ProfileJoinAccountsWidget } from '../../../widgets/Profile/ProfileJoinAccountsWidget'
import { ProfileWidget } from '../../../widgets/Profile/ProfileWidget'
import { profileApi } from '../api/profileApi'
import { ProfileLinksWidget } from '../../../widgets/Profile/ProfileLinksWidget'
import { ErrorWhileFetchingForm } from '../../../entities/ErrorWhileFetchingForm'
import { useFocusEffect } from 'expo-router'

type Props = {}

export const Profile = memo((props: Props) => {
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
        []
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
    }, [accountToDelete])

    const handleReloadData = useCallback(() => {
        fetchData({
            args: undefined,
            afterDataCallback(data) {
                setBalance({ balance: data.balance })
            },
            hideToastOnError: true,
        })
    }, [])

    useFocusEffect(
        useCallback(() => {
            handleReloadData()
        }, [])
    )
    return (
        <>
            {errorText ? (
                <ErrorWhileFetchingForm
                    margins={{ mb: 55 }}
                    message={errorText}
                    onReload={handleReloadData}
                />
            ) : (
                <>
                    <ProfileWidget
                        isDataLoading={isDataLoading}
                        name={data?.name}
                        phone={data?.phone}
                    />
                    <ProfileJoinAccountsWidget
                        isDataLoading={isDataLoading}
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
        </>
    )
})
