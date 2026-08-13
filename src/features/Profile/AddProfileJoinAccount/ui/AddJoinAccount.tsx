import { useRouter } from 'expo-router'
import { memo, useCallback } from 'react'
import { StyleSheet } from 'react-native'
import { ESCREENS, SIZES, SPACING, ThemeStore } from '../../../../shared'
import { Icon } from '../../../../shared/Icons'
import { LinkButton } from '../../../../shared/LinkButton'

export const AddProfileJoinAccount = memo(() => {
    const COLORS = ThemeStore.useCOLORS()
    const router = useRouter()

    const handlePress = useCallback(() => {
        router.navigate(ESCREENS.ADD_JOIN_AСCOUNT)
    }, [router])

    // LinkButton центрирует контент, в макете ссылка прижата влево.
    const styles = StyleSheet.create({
        container: {
            alignSelf: 'flex-start',
            justifyContent: 'flex-start',
            marginTop: SPACING.MD * SIZES.PX,
        },
    })

    return (
        <LinkButton
            title="Пригласить пользователя"
            onPress={handlePress}
            icon={<Icon name="plus" size={16} color={COLORS.ACCENT.Primary} />}
            style={styles.container}
        />
    )
})
