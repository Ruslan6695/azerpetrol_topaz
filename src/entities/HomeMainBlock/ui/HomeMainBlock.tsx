import { ReactElement, memo, useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import { ESCREENS, SIZES } from '../../../shared'
import { CustomText } from '../../../shared/CustomText'
import { MPLayout } from '../../../shared/MpLayout'
import { SvgProps } from 'react-native-svg'
import { useRouter } from 'expo-router'
import { CustomTouchableOpacity } from '../../../shared/CustomTouchableOpacity'

type Props = {
    title: string
    icon: ReactElement
    bgColor: string
    desciptionText?: string
    mainText: {
        color: string
        text: string
        fz?: number
    }
    link: ESCREENS
}

export const HomeMainBlock = memo(
    ({ bgColor, desciptionText, icon: Icon, mainText, title, link }: Props) => {
        const router = useRouter()
        const styles = StyleSheet.create({
            container: {
                backgroundColor: bgColor,
                flex: 1,
                borderRadius: 20 * SIZES.PX,
                padding: SIZES.PX * 10,
            },
            bottom: {
                flexDirection: 'row',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
            },
            icon: {
                transform: [{ rotate: '10deg' }],
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
                <CustomText fz={21} fw="600" white>
                    {title}
                </CustomText>
                <View style={styles.bottom}>
                    <View>
                        <CustomText white>{desciptionText}</CustomText>
                        <CustomText
                            fw="700"
                            fz={mainText.fz ? mainText.fz : 30}
                            color={mainText.color}
                        >
                            {mainText.text}
                        </CustomText>
                    </View>
                    <View style={styles.icon}>{Icon}</View>
                </View>
            </CustomTouchableOpacity>
        )
    }
)
