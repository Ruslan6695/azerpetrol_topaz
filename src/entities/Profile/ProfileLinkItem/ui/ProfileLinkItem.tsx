import { useRouter } from 'expo-router'
import { memo, useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import { COLORS_DARK, SIZES, ThemeStore } from '../../../../shared'
import { CustomTouchableOpacity } from '../../../../shared/CustomTouchableOpacity'
import { ArrowIcon } from '../../../../shared/Icons/ArrowIcon'
import { Typography } from '../../../../shared/Typography'
import { IProfileLinkItem } from '../config/interfaces/IProfileLinkItem'

interface IProps extends IProfileLinkItem {}

export const ProfileLinkItem = memo(
    ({ icon: Icon, link, title, onPress }: IProps) => {
        const COLORS = ThemeStore.useCOLORS()
        const router = useRouter()
        const handleSubmit = useCallback(() => {
            router.navigate(link)
        }, [])
        const styles = StyleSheet.create({
            container: {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingVertical: SIZES.PX * 16,
                paddingHorizontal: 12 * SIZES.PX,
                borderBottomColor: COLORS.BACKGROUND.Tertiary,
                borderBottomWidth: 2 * SIZES.PX,
            },
            left: {
                flexDirection: 'row',
                alignItems: 'center',
            },
        })

        return (
            <CustomTouchableOpacity
                activeOpacity={0.6}
                onPress={onPress || handleSubmit}
                style={styles.container}
            >
                <View style={styles.left}>
                    <Typography
                        type="bodyAccentSmall"
                        marginsPaddings={{ ml: 12 }}
                    >
                        {title}
                    </Typography>
                </View>
                <ArrowIcon width={10} height={15} />
            </CustomTouchableOpacity>
        )
    }
)
