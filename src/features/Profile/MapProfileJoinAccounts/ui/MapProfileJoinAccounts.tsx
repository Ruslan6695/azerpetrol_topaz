import { memo, useMemo } from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import {
    IProfileJoinAccountItem,
    ProfileJoinAccountItem,
} from '../../../../entities/Profile/ProfileJoinAccountItem'
import { SIZES, SPACING } from '../../../../shared'

type Props = {
    joinAccounts: IProfileJoinAccountItem[]
    onDeleteAccount: (account: IProfileJoinAccountItem) => void
    balanceCreatorId: number | undefined
    profileId: number | undefined
}

export const MapProfileJoinAccounts = memo(
    ({ joinAccounts, onDeleteAccount, balanceCreatorId, profileId }: Props) => {
        // Копия перед reverse(): исходный массив лежит в data хука useFetchData,
        // мутировать его нельзя.
        const accounts = useMemo(
            () => [...joinAccounts].reverse(),
            [joinAccounts]
        )

        const styles = StyleSheet.create({
            scroll: {
                marginTop: SPACING.MD * SIZES.PX,
            },
            content: {
                gap: SPACING.ROW_GAP * SIZES.PX,
            },
        })

        return (
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.scroll}
                contentContainerStyle={styles.content}
            >
                {accounts.map((account) => (
                    <ProfileJoinAccountItem
                        key={account.id}
                        isCreator={balanceCreatorId === account.id}
                        deleteDisabled={
                            account.id === balanceCreatorId ||
                            account.id === profileId
                        }
                        onDeleteAccount={onDeleteAccount}
                        {...account}
                    />
                ))}
            </ScrollView>
        )
    }
)
