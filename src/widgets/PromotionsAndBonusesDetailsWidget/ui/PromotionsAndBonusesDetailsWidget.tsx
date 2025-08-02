import { memo, useEffect, useState } from 'react'
import { Button, Image, StyleSheet, View } from 'react-native'
import RenderHTML from 'react-native-render-html'

import { EDeviceOsNames, getToken, SIZES } from '../../../shared'
import { CustomText } from '../../../shared/CustomText'
import { TPromotionsAndBonusesScreenParams } from '../../../entities/PromotionsAndBonuses/PromotionsAndBonusesItem'
import WebView from 'react-native-webview'
import * as Device from 'expo-device'
import { useFocusEffect, useRouter } from 'expo-router'

type Props = {
    params: Partial<TPromotionsAndBonusesScreenParams>
}

export const PromotionsAndBonusesDetailsWidget = memo(({ params }: Props) => {
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
            <CustomText
                textAlign="center"
                marginsPaddings={{ mb: 10 }}
                fz={20}
                fw="600"
            >
                {params.header}
            </CustomText>
            <View style={styles.imageContainer}>
                <Image style={styles.img} source={{ uri: params.img }} />
            </View>
            {params.html_text && (
                <RenderHTML source={{ html: params.html_text }} />
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
