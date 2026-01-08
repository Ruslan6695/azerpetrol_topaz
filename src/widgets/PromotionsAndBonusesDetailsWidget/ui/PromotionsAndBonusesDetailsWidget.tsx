import { memo, useEffect, useState } from 'react'
import { Image, StyleSheet, View } from 'react-native'
import RenderHTML from 'react-native-render-html'
import { EColorThemes, getToken, SIZES, ThemeStore } from '../../../shared'
import { Typography } from '../../../shared/Typography'
import { TPromotionsAndBonusesScreenParams } from '../../../entities/PromotionsAndBonuses/PromotionsAndBonusesItem'
import WebView from 'react-native-webview'
import { useRouter } from 'expo-router'

type Props = {
    params: Partial<TPromotionsAndBonusesScreenParams>
}

export const PromotionsAndBonusesDetailsWidget = memo(({ params }: Props) => {
    const colorTheme = ThemeStore.useTheme()
    const [token, setToken] = useState<null | string>(null)
    const router = useRouter()
    const getTokenFromStorage = async () => {
        const token = await getToken()
        setToken(token)
    }

    useEffect(() => {
        getTokenFromStorage()
    }, [])
    if (params.page_link && token) {
        return (
            <View
                style={{
                    height: SIZES.HEIGHT(1),
                    width: SIZES.WIDTH(1),
                }}
            >
                <WebView
                    onMessage={async (event: any) => {
                        if (event.nativeEvent.data === 'goBack') {
                            router.back()
                        }
                    }}
                    focusable={false}
                    showsVerticalScrollIndicator={false}
                    source={{
                        uri: `${params.page_link}?token=${token}`,
                    }}
                />
            </View>
        )
    }
    return (
        <>
            <Typography
                textAlign="center"
                marginsPaddings={{ mb: 10 }}
                type="bodyAccentMedium"
            >
                {params.header}
            </Typography>
            <View style={styles.imageContainer}>
                <Image style={styles.img} source={{ uri: params.img }} />
            </View>
            {params.html_text && (
                <RenderHTML
                    baseStyle={{
                        color:
                            colorTheme == EColorThemes.DARK
                                ? 'white'
                                : undefined,
                    }}
                    source={{ html: params.html_text }}
                />
            )}
        </>
    )
})

const styles = StyleSheet.create({
    center: {
        alignItems: 'center',
    },
    imageContainer: {
        borderRadius: 20 * SIZES.PX,
        height: 155 * SIZES.PX,
        overflow: 'hidden',
        marginBottom: SIZES.PX * 20,
    },
    img: {
        width: '100%',
        height: 155 * SIZES.PX,
        objectFit: 'contain',
    },
})
