import { ReactNode, memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { Icon, TIconName } from '../../Icons'
import { PRESS_SCALE } from '../../common/config/constants/PRESS_SCALE'
import { SIZES } from '../../common/config/constants/sizes'
import { ThemeStore } from '../../common/model/themeStore'
import { PressableScale } from '../../PressableScale'
import { Typography } from '../../Typography'

type Props = {
    title: string
    subtitle?: string
    /** Имя иконки из набора «21 Век» либо готовый узел */
    left?: TIconName | ReactNode
    /** 'chevron' — стрелка «→» справа, 'none' — ничего, либо свой узел */
    right?: ReactNode | 'chevron' | 'none'
    /** Значение справа (для строк ключ/значение) */
    value?: string
    /** Акцентное значение: num16 цветом ACCENT.Primary (итоговая сумма, dc.html:595) */
    valueAccent?: boolean
    onPress?: () => void
    destructive?: boolean
    /** Последняя строка группы — без нижнего разделителя */
    last?: boolean
}

export const ListRow = memo(
    ({
        title,
        subtitle,
        left,
        right = 'none',
        value,
        valueAccent,
        onPress,
        destructive,
        last,
    }: Props) => {
        const COLORS = ThemeStore.useCOLORS()

        const styles = StyleSheet.create({
            container: {
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12 * SIZES.PX,
                paddingVertical: 15 * SIZES.PX,
                paddingHorizontal: 18 * SIZES.PX,
                borderBottomWidth: last ? 0 : 1,
                borderBottomColor: COLORS.GLASS.Border,
            },
            body: {
                flex: 1,
            },
        })

        const titleColor = destructive
            ? COLORS.STATE.Destructive
            : COLORS.TEXT.Primary

        const content = (
            <View style={styles.container}>
                {typeof left === 'string' ? (
                    <Icon name={left as TIconName} size={24} />
                ) : (
                    left
                )}

                <View style={styles.body}>
                    <Typography type="label14" customColor={titleColor}>
                        {title}
                    </Typography>
                    {subtitle && (
                        <Typography
                            type="caption12"
                            color="secondary"
                            marginsPaddings={{ mt: 2 }}
                        >
                            {subtitle}
                        </Typography>
                    )}
                </View>

                {value && (
                    <Typography
                        type={valueAccent ? 'num16' : 'label14'}
                        customColor={
                            valueAccent ? COLORS.ACCENT.Primary : undefined
                        }
                    >
                        {value}
                    </Typography>
                )}

                {right === 'chevron' ? (
                    <Typography type="label13" color="secondary">
                        →
                    </Typography>
                ) : right === 'none' ? null : (
                    right
                )}
            </View>
        )

        if (!onPress) {
            return content
        }

        return (
            <PressableScale onPress={onPress} scaleTo={PRESS_SCALE.ROW}>
                {content}
            </PressableScale>
        )
    }
)
