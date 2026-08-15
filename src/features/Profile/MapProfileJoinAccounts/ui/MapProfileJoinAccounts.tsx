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

// Горизонтальный паддинг карточки «Связанные аккаунты» — лента компенсирует
// его отрицательным margin, чтобы плитки доезжали до края.
const CARD_PADDING_HORIZONTAL = 18

export const MapProfileJoinAccounts = memo(
    ({ joinAccounts, onDeleteAccount, balanceCreatorId, profileId }: Props) => {
        // В макете лаймовая плитка владельца счёта стоит первой, остальные —
        // от последнего добавленного. Копия перед reverse(): исходный массив
        // лежит в data хука useFetchData, мутировать его нельзя.
        const accounts = useMemo(() => {
            const creator = joinAccounts.filter(
                (account) => account.id === balanceCreatorId
            )
            const rest = joinAccounts
                .filter((account) => account.id !== balanceCreatorId)
                .reverse()

            return [...creator, ...rest]
        }, [joinAccounts, balanceCreatorId])

        const styles = StyleSheet.create({
            // Лента уходит под края карточки, а не упирается в её паддинг,
            // поэтому вытягиваем её за paddingHorizontal родителя.
            scroll: {
                marginTop: SPACING.MD * SIZES.PX,
                marginHorizontal: -CARD_PADDING_HORIZONTAL * SIZES.PX,
            },
            content: {
                gap: SPACING.ROW_GAP * SIZES.PX,
                paddingHorizontal: CARD_PADDING_HORIZONTAL * SIZES.PX,
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
