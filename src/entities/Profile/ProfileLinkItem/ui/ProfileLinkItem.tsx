import { ReactNode, memo, useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import { IProfileLinkItem } from '../config/interfaces/IProfileLinkItem'
import { COLORS, ESCREENS, SIZES } from '../../../../shared'
import { CustomText } from '../../../../shared/CustomText'
import { CustomTouchableOpacity } from '../../../../shared/CustomTouchableOpacity'
import { useRouter } from 'expo-router'

interface IProps extends IProfileLinkItem {}

export const ProfileLinkItem = memo(
    ({ icon: Icon, link, title, onPress }: IProps) => {
        const router = useRouter()
        const handleSubmit = useCallback(() => {
            router.navigate(link)
        }, [])
        return (
            <CustomTouchableOpacity
                activeOpacity={0.6}
                onPress={onPress || handleSubmit}
                style={styles.container}
            >
                <Icon width={25 * SIZES.PX} height={25 * SIZES.PX} />
                <CustomText marginsPaddings={{ ml: 20 }}>{title}</CustomText>
            </CustomTouchableOpacity>
        )
    }
)

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SIZES.PX * 10,
        borderTopColor: COLORS.GRAY_2,
        borderTopWidth: 1 * SIZES.PX,
    },
})
