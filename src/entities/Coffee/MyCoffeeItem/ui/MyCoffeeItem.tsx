import { memo, useCallback } from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { RADII, SIZES, ThemeStore } from '../../../../shared'
import { Icon } from '../../../../shared/Icons'
import { ListRow } from '../../../../shared/ListRow'
import { IMyCoffeeItem } from '../config/interfaces/IMyCoffeeItem'

interface IProps extends IMyCoffeeItem {
    onPress: (coffee: IMyCoffeeItem) => void
    isSelected: boolean
    /** Последняя строка группы — без нижнего разделителя */
    last?: boolean
}

const THUMB = 40

// Строка списка «мой кофе» (dc.html:222–225). Даты сгорания, нарисованной
// в макете, API не отдаёт — строка несёт миниатюру, название напитка
// и кофемашину, на которой он куплен.
export const MyCoffeeItem = memo(
    ({
        id,
        img,
        name,
        onPress,
        qr,
        coffee_machine_name,
        isSelected,
        last,
    }: IProps) => {
        const COLORS = ThemeStore.useCOLORS()

        const handlePress = useCallback(() => {
            onPress({ id, img, name, qr, coffee_machine_name })
        }, [id, img, name, qr, coffee_machine_name, onPress])

        const styles = StyleSheet.create({
            thumb: {
                width: THUMB * SIZES.PX,
                height: THUMB * SIZES.PX,
                borderRadius: RADII.CHIP_SM * SIZES.PX,
                backgroundColor: COLORS.GLASS.Primary,
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
            },
            img: {
                width: THUMB * SIZES.PX,
                height: THUMB * SIZES.PX,
                objectFit: 'contain',
            },
        })

        return (
            <ListRow
                title={name}
                subtitle={coffee_machine_name ?? undefined}
                selected={isSelected}
                last={last}
                onPress={handlePress}
                left={
                    <View style={styles.thumb}>
                        {img ? (
                            <Image style={styles.img} source={{ uri: img }} />
                        ) : (
                            <Icon name="home_coffee" size={22} opacity={0.85} />
                        )}
                    </View>
                }
            />
        )
    }
)
