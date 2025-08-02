import { memo, useCallback } from 'react'
import { CustomTouchableOpacity } from '../../../../shared/CustomTouchableOpacity'
import { ESCREENS, SIZES } from '../../../../shared'
import { StyleSheet } from 'react-native'
import { PlusIcon } from '../../../../shared/Icons/PlusIcon'
import { CustomText } from '../../../../shared/CustomText'
import { useRouter } from 'expo-router'

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
            <PlusIcon size={15} />
            <CustomText
                style={{ textDecorationLine: 'underline' }}
                marginsPaddings={{ ml: 10 }}
            >
                Привязать нового пользователя
            </CustomText>
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
