import { useRouter } from 'expo-router'
import { memo, useCallback } from 'react'
import { StyleSheet } from 'react-native'
import { ESCREENS, SIZES } from '../../../../shared'
import { CustomTouchableOpacity } from '../../../../shared/CustomTouchableOpacity'
import { Typography } from '../../../../shared/Typography'

type Props = {}

export const AddProfileJoinAccount = memo((props: Props) => {
    const router = useRouter()
    const handlePress = useCallback(() => {
        router.navigate(ESCREENS.ADD_JOIN_AСCOUNT)
    }, [])
    return (
        <CustomTouchableOpacity
            onPress={handlePress}
            activeOpacity={0.6}
            style={styles.container}
        >
            <Typography color="link" type="bodyAccentSmall">
                Пригласить пользователя
            </Typography>
        </CustomTouchableOpacity>
    )
})

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SIZES.PX * 5,
        paddingBottom: 0,
        marginTop: SIZES.PX * 5,
    },
})
