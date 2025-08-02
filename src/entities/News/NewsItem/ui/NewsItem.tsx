import React, { useCallback } from 'react'
import { INewsItem } from '../config/interfaces/INewsItem'
import { Image, StyleSheet, View } from 'react-native'
import { useRouter } from 'expo-router'
import { CustomTouchableOpacity } from '../../../../shared/CustomTouchableOpacity'
import { COLORS, ESCREENS, SIZES } from '../../../../shared'
import { CustomText } from '../../../../shared/CustomText'

interface IProps extends INewsItem {}

export const NewsItem = ({ date_create, header, html_text, id }: IProps) => {
    const router = useRouter()

    const handlePress = useCallback(() => {
        router.navigate({
            pathname: ESCREENS.NEWS_DETAILS,
            params: { date_create, html_text, header },
        })
    }, [date_create, html_text, header])
    return (
        <CustomTouchableOpacity
            style={styles.container}
            onPress={handlePress}
            activeOpacity={0.8}
        >
            <CustomText fz={16}>{header}</CustomText>
            <CustomText secondary fz={13} marginsPaddings={{ mt: 15 }}>
                {date_create}
            </CustomText>
        </CustomTouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        borderRadius: SIZES.PX * 20,
        padding: SIZES.PX * 15,
        backgroundColor: COLORS.GRAY_3,
    },
    img: {
        width: '100%',
        height: 155 * SIZES.PX,
        objectFit: 'contain',
    },
})
