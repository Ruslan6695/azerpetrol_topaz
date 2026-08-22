import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import {
    PRESS_SCALE,
    RADII,
    SIZES,
    SPACING,
    ThemeStore,
    divideNumber,
} from '../../../../shared'
import { BonusIcon } from '../../../../shared/BonusIcon'
import { Icon } from '../../../../shared/Icons'
import { PressableScale } from '../../../../shared/PressableScale'
import { Typography } from '../../../../shared/Typography'
import { HISTORY_TYPE_ICONS } from '../../config/constants/HISTORY_TYPE_ICONS'
import { getHistorySignColor } from '../../lib/getHistorySignColor'
import { IHistoryItem } from '../config/interfaces/IHistoryItem'

interface IProps extends IHistoryItem {
    /** Последняя строка группы — без нижнего разделителя */
    last?: boolean
    onPress: () => void
}

// Строка операции из макета (dc.html:304–307): слева заголовок цветом знака
// суммы и дата, справа чип с иконкой типа и суммой. Скруглений у строки нет —
// их даёт ListGroup, поэтому здесь только разделитель.
//
// Переход на детали операции — действие пользователя, поэтому им владеет
// feature: сюда он приходит колбэком (architecture.md, правило 1).
export const HistoryItem = memo(
    ({ date, type, sum, header, last, onPress }: IProps) => {
        const COLORS = ThemeStore.useCOLORS()

        const styles = StyleSheet.create({
            container: {
                flexDirection: 'row',
                alignItems: 'center',
                gap: SPACING.MD * SIZES.PX,
                paddingVertical: SPACING.MD * SIZES.PX,
                paddingHorizontal: SPACING.XL * SIZES.PX,
                borderBottomWidth: last ? 0 : 1,
                borderBottomColor: COLORS.GLASS.Border,
            },
            body: {
                flex: 1,
            },
            chip: {
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6 * SIZES.PX,
                paddingVertical: 6 * SIZES.PX,
                paddingHorizontal: 10 * SIZES.PX,
                borderRadius: RADII.CHIP_SM * SIZES.PX,
                backgroundColor: COLORS.GLASS.Secondary,
            },
            // В макете иконка чипа приглушена фильтром — в RN это opacity
            // на обёртке, цвет самой иконки задаёт проп color.
            chipIcon: {
                opacity: 0.8,
            },
            sum: {
                flexDirection: 'row',
                alignItems: 'center',
            },
        })

        return (
            <PressableScale onPress={onPress} scaleTo={PRESS_SCALE.ROW}>
                <View style={styles.container}>
                    <View style={styles.body}>
                        <Typography
                            type="body13"
                            customColor={getHistorySignColor(sum, COLORS)}
                        >
                            {header}
                        </Typography>
                        <Typography
                            type="caption11"
                            color="secondary"
                            marginsPaddings={{ mt: 2 }}
                        >
                            {date}
                        </Typography>
                    </View>

                    <View style={styles.chip}>
                        <View style={styles.chipIcon}>
                            <Icon
                                name={HISTORY_TYPE_ICONS[type]}
                                size={18}
                                color={COLORS.TEXT.Primary}
                            />
                        </View>
                        <View style={styles.sum}>
                            <Typography type="label13">
                                {divideNumber(sum)}
                            </Typography>
                            <BonusIcon mt={2} size={11} />
                        </View>
                    </View>
                </View>
            </PressableScale>
        )
    }
)
