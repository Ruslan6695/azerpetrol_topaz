import { memo, useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import { PRESS_SCALE, RADII, SIZES, SPACING, ThemeStore } from '../../../shared'
import { Glass } from '../../../shared/GlassCard'
import { Icon } from '../../../shared/Icons'
import { PressableScale } from '../../../shared/PressableScale'
import { Typography } from '../../../shared/Typography'
import { IContactItem } from '../config/interfaces/IContactItem'

interface IProps extends IContactItem {
    onPress: (contact: IContactItem) => void
}

const AVATAR_SIZE = 40

export const ContactItem = memo(({ id, name, phone, onPress }: IProps) => {
    const COLORS = ThemeStore.useCOLORS()

    const handlePress = useCallback(() => {
        onPress({ id, name, phone })
    }, [onPress, id, name, phone])

    const styles = StyleSheet.create({
        row: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: SPACING.LG * SIZES.PX,
            paddingVertical: SPACING.LG * SIZES.PX,
            paddingHorizontal: SPACING.XL * SIZES.PX,
        },
        avatar: {
            width: AVATAR_SIZE * SIZES.PX,
            height: AVATAR_SIZE * SIZES.PX,
            borderRadius: RADII.PILL,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: COLORS.GLASS.Primary,
        },
    })

    return (
        <PressableScale onPress={handlePress} scaleTo={PRESS_SCALE.ROW}>
            <Glass level="secondary" radius={RADII.ROW * SIZES.PX}>
                <View style={styles.row}>
                    <View style={styles.avatar}>
                        <Icon name="person" size={20} />
                    </View>
                    <View>
                        <Typography type="label14">{name}</Typography>
                        <Typography
                            type="caption12"
                            color="secondary"
                            marginsPaddings={{ mt: 1 }}
                        >
                            {phone}
                        </Typography>
                    </View>
                </View>
            </Glass>
        </PressableScale>
    )
})
