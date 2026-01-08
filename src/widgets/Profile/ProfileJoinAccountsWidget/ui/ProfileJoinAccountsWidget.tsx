import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { IProfileJoinAccountItem } from '../../../../entities/Profile/ProfileJoinAccountItem'
import { AddProfileJoinAccount } from '../../../../features/Profile/AddProfileJoinAccount'
import { LeaveFromProfileJoinAccounts } from '../../../../features/Profile/LeaveFromProfileJoinAccounts'
import { MapProfileJoinAccounts } from '../../../../features/Profile/MapProfileJoinAccounts'
import { EColorThemes, SIZES, ThemeStore } from '../../../../shared'
import { MPLayout } from '../../../../shared/MpLayout'
import { Typography } from '../../../../shared/Typography'
import JoinSvg from '../assets/join.svg'
import JoinDarkSvg from '../assets/join_dark.svg'

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
        const COLORS = ThemeStore.useCOLORS()
        const colorTheme = ThemeStore.useTheme()
        const styles = StyleSheet.create({
            container: {
                width: '100%',
                backgroundColor: COLORS.BACKGROUND.Tertiary,
                borderRadius: SIZES.PX * 16,
                padding: SIZES.PX * 16,
                justifyContent: 'center',
            },
            row: {
                flexDirection: 'row',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
            },
        })

        if (isDataLoading) {
            return <ProfileJoinAccountsWidgetSkeleton />
        }
        return (
            <View style={styles.container}>
                <Typography type="displaySmall">Связанные аккаунты</Typography>
                {join_accounts && join_accounts?.length > 1 ? (
                    balanceCreatorId !== profileId ? (
                        <View style={styles.row}>
                            <Typography type="caption" color="secondary">
                                Ваш аккаунт привязан к счету
                            </Typography>
                            <MPLayout mt={-30}>
                                {colorTheme === EColorThemes.LIGHT ? (
                                    <JoinSvg
                                        width={SIZES.PX * 55}
                                        height={SIZES.PX * 55}
                                    />
                                ) : (
                                    <JoinDarkSvg
                                        width={SIZES.PX * 55}
                                        height={SIZES.PX * 55}
                                    />
                                )}
                            </MPLayout>
                        </View>
                    ) : (
                        <MapProfileJoinAccounts
                            profileId={profileId}
                            balanceCreatorId={balanceCreatorId}
                            onDeleteAccount={onDeleteAccount}
                            joinAccounts={join_accounts}
                        />
                    )
                ) : (
                    <View style={styles.row}>
                        <Typography type="caption" color="secondary">
                            У вас пока нет связанных аккаунтов
                        </Typography>
                        <MPLayout mt={-30}>
                            {colorTheme === EColorThemes.LIGHT ? (
                                <JoinSvg
                                    width={SIZES.PX * 55}
                                    height={SIZES.PX * 55}
                                />
                            ) : (
                                <JoinDarkSvg
                                    width={SIZES.PX * 55}
                                    height={SIZES.PX * 55}
                                />
                            )}
                        </MPLayout>
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
