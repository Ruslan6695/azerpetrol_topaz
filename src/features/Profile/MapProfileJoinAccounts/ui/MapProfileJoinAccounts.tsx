import { memo } from 'react'
import {
    IProfileJoinAccountItem,
    ProfileJoinAccountItem,
} from '../../../../entities/Profile/ProfileJoinAccountItem'
import { FlatList, StyleSheet } from 'react-native'

type Props = {
    joinAccounts: IProfileJoinAccountItem[]
    onDeleteAccount: (account: IProfileJoinAccountItem) => void
    balanceCreatorId: number | undefined
    profileId: number | undefined
}

export const MapProfileJoinAccounts = memo(
    ({ joinAccounts, onDeleteAccount, balanceCreatorId, profileId }: Props) => {
        return (
            <FlatList
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.container}
                horizontal
                data={joinAccounts.reverse()}
                renderItem={({ item }) => (
                    <ProfileJoinAccountItem
                        isCreator={balanceCreatorId === item.id}
                        deleteDisabled={
                            item.id === balanceCreatorId ||
                            item.id === profileId
                        }
                        onDeleteAccount={onDeleteAccount}
                        {...item}
                        key={item.id}
                    />
                )}
            />
        )
    }
)

const styles = StyleSheet.create({
    container: {
        gap: 10,
    },
})
