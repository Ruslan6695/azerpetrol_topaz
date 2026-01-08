import { memo, useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import { ITrkType, SIZES, ThemeStore, divideNumber } from '../../../../shared'
import { CustomTouchableOpacity } from '../../../../shared/CustomTouchableOpacity'
import { Typography } from '../../../../shared/Typography'
import { BonusIcon } from '../../../../shared/BonusIcon'
import { MPLayout } from '../../../../shared/MpLayout'

interface IProps extends ITrkType {
    onPress: (trkType: ITrkType) => void
    isSelected: boolean
}

export const TrkTypeBlock = memo(
    ({
        id,
        name,
        price,
        onPress,
        isSelected,
        nozzle_id,
        art,
        petrol_id,
    }: IProps) => {
        const COLORS = ThemeStore.useCOLORS()
        const handlePress = useCallback(() => {
            onPress({ id, name, price, nozzle_id, art, petrol_id })
        }, [onPress, id, name, price])

        const styles = StyleSheet.create({
            container: {
                backgroundColor: isSelected
                    ? COLORS.BRAND.Primary
                    : COLORS.BACKGROUND.Tertiary,
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: SIZES.PX * 16,
                paddingVertical: SIZES.PX * 18,
                borderRadius: SIZES.PX * 16,
                borderColor: COLORS.BRAND.Secondary,
                borderWidth: 0.9 * SIZES.PX,
            },
            row: {
                alignItems: 'center',
                flexDirection: 'row',
            },
        })
        return (
            <CustomTouchableOpacity
                activeOpacity={0.7}
                onPress={handlePress}
                style={styles.container}
            >
                <Typography
                    color={isSelected ? 'invert' : undefined}
                    type="displaySmall"
                >
                    {name.toUpperCase()}
                </Typography>
                <View style={styles.row}>
                    <Typography
                        color={isSelected ? 'invert' : undefined}
                        type="displaySmall"
                    >
                        {divideNumber(price)}
                    </Typography>
                    <MPLayout mt={2}>
                        <BonusIcon
                            color={isSelected ? COLORS.TEXT.Invert : undefined}
                        />
                    </MPLayout>
                </View>
            </CustomTouchableOpacity>
        )
    }
)
