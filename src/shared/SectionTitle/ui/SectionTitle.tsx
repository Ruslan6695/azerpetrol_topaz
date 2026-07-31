import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { PRESS_SCALE } from '../../common/config/constants/PRESS_SCALE'
import { SIZES } from '../../common/config/constants/sizes'
import { PressableScale } from '../../PressableScale'
import { Typography } from '../../Typography'

type Props = {
    children: string
    action?: {
        label: string
        onPress: () => void
    }
}

// Заголовок секции из макета: «Новости» слева, «Все →» справа.
export const SectionTitle = memo(({ children, action }: Props) => {
    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginHorizontal: 4 * SIZES.PX,
            marginTop: 4 * SIZES.PX,
        },
    })

    return (
        <View style={styles.container}>
            <Typography type="num18">{children}</Typography>
            {action && (
                <PressableScale
                    onPress={action.onPress}
                    scaleTo={PRESS_SCALE.CHIP}
                >
                    <Typography type="body125" color="secondary">
                        {action.label}
                    </Typography>
                </PressableScale>
            )}
        </View>
    )
})
