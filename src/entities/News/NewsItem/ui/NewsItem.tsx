import { useRouter } from 'expo-router'
import React, { useCallback, useMemo } from 'react'
import { StyleSheet } from 'react-native'
import { ESCREENS, SIZES, ThemeStore } from '../../../../shared'
import { CustomTouchableOpacity } from '../../../../shared/CustomTouchableOpacity'
import { Typography } from '../../../../shared/Typography'
import { INewsItem } from '../config/interfaces/INewsItem'

interface IProps extends INewsItem {}

export const NewsItem = ({ date_create, header, html_text, id }: IProps) => {
    const router = useRouter()
    const COLORS = ThemeStore.useCOLORS()
    const handlePress = useCallback(() => {
        router.navigate({
            pathname: ESCREENS.NEWS_DETAILS,
            params: { date_create, html_text, header },
        })
    }, [date_create, html_text, header])

    const styles = useMemo(
        () =>
            StyleSheet.create({
                container: {
                    borderRadius: SIZES.PX * 20,
                    padding: SIZES.PX * 16,
                    backgroundColor: COLORS.BACKGROUND.Tertiary,
                },
                img: {
                    width: '100%',
                    height: 155 * SIZES.PX,
                    objectFit: 'contain',
                },
            }),
        []
    )

    return (
        <CustomTouchableOpacity
            style={styles.container}
            onPress={handlePress}
            activeOpacity={0.8}
        >
            <Typography marginsPaddings={{ mb: 8 }}>{header}</Typography>
            <Typography color="secondary" type="caption">
                {date_create}
            </Typography>
        </CustomTouchableOpacity>
    )
}
