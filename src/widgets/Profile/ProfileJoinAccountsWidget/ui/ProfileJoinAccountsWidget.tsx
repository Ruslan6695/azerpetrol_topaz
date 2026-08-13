import { memo } from 'react'
import { IProfileJoinAccountItem } from '../../../../entities/Profile/ProfileJoinAccountItem'
import { AddProfileJoinAccount } from '../../../../features/Profile/AddProfileJoinAccount'
import { LeaveFromProfileJoinAccounts } from '../../../../features/Profile/LeaveFromProfileJoinAccounts'
import { MapProfileJoinAccounts } from '../../../../features/Profile/MapProfileJoinAccounts'
import { RADII, SPACING } from '../../../../shared'
import { GlassCard } from '../../../../shared/GlassCard'
import { Typography } from '../../../../shared/Typography'
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

        const isCreator = balanceCreatorId === profileId
        // Список приходит вместе с самим пользователем, поэтому «есть связанные» —
        // это больше одного элемента.
        const hasJoinAccounts = !!join_accounts && join_accounts.length > 1

        return (
            <GlassCard
                variant="glass"
                radius={RADII.CARD}
                paddingVertical={SPACING.XL}
                paddingHorizontal={18}
            >
                <Typography type="rowTitle">Связанные аккаунты</Typography>

                {hasJoinAccounts && isCreator && (
                    <MapProfileJoinAccounts
                        profileId={profileId}
                        balanceCreatorId={balanceCreatorId}
                        onDeleteAccount={onDeleteAccount}
                        joinAccounts={join_accounts}
                    />
                )}

                {hasJoinAccounts && !isCreator && (
                    <Typography
                        type="caption12"
                        color="secondary"
                        marginsPaddings={{ mt: SPACING.SM }}
                    >
                        Ваш аккаунт привязан к счёту
                    </Typography>
                )}

                {!hasJoinAccounts && (
                    <Typography
                        type="caption12"
                        color="secondary"
                        marginsPaddings={{ mt: SPACING.SM }}
                    >
                        У вас пока нет связанных аккаунтов
                    </Typography>
                )}

                {isCreator ? (
                    <AddProfileJoinAccount />
                ) : (
                    <LeaveFromProfileJoinAccounts onLeave={onReloadData} />
                )}
            </GlassCard>
        )
    }
)
