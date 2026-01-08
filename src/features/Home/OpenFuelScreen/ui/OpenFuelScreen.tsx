import { useNavigation, useRouter } from 'expo-router'
import { memo, useCallback, useMemo } from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { ESCREENS, SIZES, ThemeStore } from '../../../../shared'
import { CustomTouchableOpacity } from '../../../../shared/CustomTouchableOpacity'
import { Typography } from '../../../../shared/Typography'
import { BackgroundImage } from '../../../../shared/BackgroundImage'
type Props = {
    big_text: string
    small_text: string
}

export const OpenFuelScreen = memo(({ big_text, small_text }: Props) => {
    const router = useRouter()
    const COLORS = ThemeStore.useCOLORS()
    const handlePress = useCallback(() => {
        router.navigate(ESCREENS.FUEL)
    }, [])

    const styles = useMemo(() => {
        return StyleSheet.create({
            container: {
                width: '100%',
                borderRadius: SIZES.PX * 16,
                position: 'relative',
                height: 154,
                backgroundColor: COLORS.BACKGROUND.Tertiary,
                borderColor: COLORS.BRAND.Secondary,
                borderWidth: 0.9 * SIZES.PX,
                overflow: 'hidden',
            },
            image: {
                borderRadius: SIZES.PX * 16,
                width: '100%',
                height: 160 * SIZES.PX,
            },
            textContainer: {
                position: 'absolute',
                top: 16 * SIZES.PX,
                left: 16 * SIZES.PX,
            },
        })
    }, [COLORS])

    return (
        <CustomTouchableOpacity
            onPress={handlePress}
            activeOpacity={0.8}
            style={styles.container}
        >
            <BackgroundImage bottom={-10} right={-5} />
            <View style={styles.textContainer}>
                <Typography type="headlineSmall">Заправить авто</Typography>
                <Typography color="secondary" type="caption">
                    {small_text} {big_text}
                </Typography>
            </View>
        </CustomTouchableOpacity>
    )
})
