import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { COLORS, SIZES } from '../../../../shared'
import { CustomText } from '../../../../shared/CustomText'
import JoinSvg from '../assets/join.svg'
import { MapProfileJoinAccounts } from '../../../../features/Profile/MapProfileJoinAccounts'
import { IProfileJoinAccountItem } from '../../../../entities/Profile/ProfileJoinAccountItem'
import { AddProfileJoinAccount } from '../../../../features/Profile/AddProfileJoinAccount'
import { LeaveFromProfileJoinAccounts } from '../../../../features/Profile/LeaveFromProfileJoinAccounts'
import { ProfileJoinAccountsWidgetSkeleton } from './ProfileJoinAccountsWidgetSkeleton'
type Props = {
    join_accounts: IProfileJoinAccountItem[] | undefined
    onDeleteAccount: (account: IProfileJoinAccountItem) => void
    balanceCreatorId: number | undefined
    profileId: number | undefined
    onReloadData: () => void
    isDataLoading: boolean
}

export const ProfileJoinAccountsWidget = memo(
    ({
        join_accounts,
        onDeleteAccount,
        balanceCreatorId,
        profileId,
        onReloadData,
        isDataLoading,
    }: Props) => {
        if (isDataLoading) {
            return <ProfileJoinAccountsWidgetSkeleton />
        }
        return (
            <View style={styles.container}>
                <CustomText marginsPaddings={{ mb: 10 }} fz={14}>
                    Привязанные аккаунты
                </CustomText>
                {join_accounts && join_accounts?.length > 1 ? (
                    <MapProfileJoinAccounts
                        profileId={profileId}
                        balanceCreatorId={balanceCreatorId}
                        onDeleteAccount={onDeleteAccount}
                        joinAccounts={join_accounts}
                    />
                ) : (
                    <View style={styles.center}>
                        <JoinSvg />
                        <CustomText
                            secondary
                            marginsPaddings={{ mt: 10 }}
                            fz={15}
                        >
                            Нет привязанных аккаунтов
                        </CustomText>
                    </View>
                )}
                {balanceCreatorId === profileId && <AddProfileJoinAccount />}
                {balanceCreatorId !== profileId && (
                    <LeaveFromProfileJoinAccounts onLeave={onReloadData} />
                )}
            </View>
        )
    }
)

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: COLORS.GRAY_3,
        borderRadius: SIZES.PX * 25,
        padding: SIZES.PX * 15,
        justifyContent: 'center',
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: SIZES.PX * 20,
        marginBottom: SIZES.PX * 10,
    },
})
