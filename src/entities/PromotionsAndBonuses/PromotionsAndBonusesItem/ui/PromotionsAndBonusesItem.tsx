import { memo, useCallback } from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { IPromotionsAndBonusesItem } from '../config/interfaces/IPromotionsAndBonusesItem'
import { useRouter } from 'expo-router'
import { CustomTouchableOpacity } from '../../../../shared/CustomTouchableOpacity'
import { ESCREENS, SIZES } from '../../../../shared'

interface IProps extends IPromotionsAndBonusesItem {}
export const PromotionsAndBonusesItem = memo(
    ({ id, img, date_create, header, html_text, page_link }: IProps) => {
        const router = useRouter()

        const handlePress = useCallback(() => {
            router.navigate({
                pathname: ESCREENS.PROMOTIONS_AND_BONUSES_DETAILS,
                params: { date_create, html_text, img, header, page_link },
            })
        }, [date_create, html_text, img, header])
        return (
            <View style={styles.container}>
                <CustomTouchableOpacity
                    onPress={handlePress}
                    activeOpacity={0.8}
                >
                    <Image style={styles.img} source={{ uri: img }} />
                </CustomTouchableOpacity>
            </View>
        )
    }
)

const styles = StyleSheet.create({
    container: {
        borderRadius: 20 * SIZES.PX,
        height: 155 * SIZES.PX,
        overflow: 'hidden',
    },
    img: {
        width: '100%',
        height: 155 * SIZES.PX,
        objectFit: 'contain',
    },
})
