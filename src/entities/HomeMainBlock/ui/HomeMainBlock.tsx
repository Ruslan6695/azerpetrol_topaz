import { useRouter } from 'expo-router'
import { ReactElement, memo, useCallback } from 'react'
import { StyleSheet } from 'react-native'
import { ESCREENS, SIZES, ThemeStore } from '../../../shared'
import { CustomTouchableOpacity } from '../../../shared/CustomTouchableOpacity'
import { Typography } from '../../../shared/Typography'

type Props = {
    title: string
    icon: ReactElement
    bgColor: string
    desciptionText?: string
    mainText: string
    link: ESCREENS
}

export const HomeMainBlock = memo(
    ({ bgColor, desciptionText, icon: Icon, mainText, title, link }: Props) => {
        const COLORS = ThemeStore.useCOLORS()

        const router = useRouter()
        const styles = StyleSheet.create({
            container: {
                backgroundColor: COLORS.BACKGROUND.Tertiary,
                width: SIZES.WIDTH(0.5) - 25 * SIZES.PX,
                borderRadius: 16 * SIZES.PX,
                padding: SIZES.PX * 16,
                borderColor: COLORS.BRAND.Secondary,
                borderWidth: 0.9 * SIZES.PX,
            },
            bottom: {
                flexDirection: 'row',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
            },
        })

        const handlePress = useCallback(() => {
            router.push(link)
        }, [link])
        return (
            <CustomTouchableOpacity
                onPress={handlePress}
                activeOpacity={0.7}
                style={styles.container}
            >
                {Icon}
                <Typography marginsPaddings={{ mt: 12 }} type="displaySmall">
                    {title}
                </Typography>
                <Typography type="caption">
                    {desciptionText} {mainText}
                </Typography>
            </CustomTouchableOpacity>
        )
    }
)
