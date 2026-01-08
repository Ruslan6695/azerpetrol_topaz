import { useRouter } from 'expo-router'
import { memo, useCallback, useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import {
    COLORS,
    EColorThemes,
    ESCREENS,
    SIZES,
    ThemeStore,
    divideNumber,
} from '../../../../shared'
import { CustomTouchableOpacity } from '../../../../shared/CustomTouchableOpacity'
import { CoffeeIcon } from '../../../../shared/Icons/CoffeeIcon'
import { FuelIcon } from '../../../../shared/Icons/FuelIcon'
import { PersonIcon } from '../../../../shared/Icons/PersonIcon'
import { ProductsIcon } from '../../../../shared/Icons/ProductsIcon/ui/ProductsIcon'
import { Typography } from '../../../../shared/Typography'
import { WalletIcon } from '../../../../shared/WalletIcon'
import { EHistoryItemType } from '../../config/enums/EHistoryItemType'
import { IHistoryItem } from '../config/interfaces/IHistoryItem'
import { BonusIcon } from '../../../../shared/BonusIcon'

interface IProps extends IHistoryItem {
    isFirst: boolean
    isLast: boolean
}
export const HistoryItem = memo(
    ({ date, text, type, sum, header, id, isFirst, isLast }: IProps) => {
        const COLORS = ThemeStore.useCOLORS()
        const colorTheme = ThemeStore.useTheme()
        const router = useRouter()
        const handlePress = useCallback(() => {
            router.navigate({
                pathname: ESCREENS.HISTORY_DETAILS,
                params: { type, id },
            })
        }, [id, type])

        const styles = useMemo(
            () =>
                StyleSheet.create({
                    container: {
                        width: '100%',
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: SIZES.PX * 14,
                        paddingVertical: 5 * SIZES.PX,
                        borderWidth: 0,
                        borderTopLeftRadius: isFirst ? 16 * SIZES.PX : 0,
                        borderTopRightRadius: isFirst ? 16 * SIZES.PX : 0,
                        borderBottomLeftRadius: isLast ? 16 * SIZES.PX : 0,
                        borderBottomRightRadius: isLast ? 16 * SIZES.PX : 0,
                        backgroundColor: COLORS.BACKGROUND.Tertiary,
                    },
                    left: {
                        flex: 4,
                    },
                    right: {
                        flexDirection: 'row',
                        backgroundColor: COLORS.BACKGROUND.Primary,
                        paddingHorizontal: SIZES.PX * 10,
                        paddingVertical: SIZES.PX * 5,
                        borderRadius: SIZES.PX * 10,
                        flex: 1.5,
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    },
                    row: {
                        flexDirection: 'row',
                        alignItems: 'center',
                    },
                }),
            [COLORS]
        )

        return (
            <CustomTouchableOpacity
                onPress={handlePress}
                activeOpacity={0.6}
                style={styles.container}
            >
                <View style={styles.left}>
                    <Typography
                        style={{ maxWidth: '95%' }}
                        type="captionAccent"
                        color={sum > 0 ? 'success' : 'error'}
                    >
                        {header}
                    </Typography>
                    <Typography color="secondary" type="caption">
                        {date}
                    </Typography>
                </View>
                <View style={styles.right}>
                    {type === EHistoryItemType.BUY_COFFEE ? (
                        <CoffeeIcon size={18} />
                    ) : type === EHistoryItemType.PAY_BALANCE ? (
                        <WalletIcon gray size={20} />
                    ) : type === EHistoryItemType.TRANSFER_BALANCE ? (
                        <PersonIcon size={20} />
                    ) : type === EHistoryItemType.FUEL_FILLING ? (
                        <FuelIcon size={20} />
                    ) : type === EHistoryItemType.BUY_ON_CASH ? (
                        <ProductsIcon size={20} />
                    ) : (
                        <></>
                    )}

                    <View style={styles.row}>
                        <Typography type="caption">
                            {divideNumber(sum)}
                        </Typography>
                        <BonusIcon mt={2} size={11} />
                    </View>
                </View>
            </CustomTouchableOpacity>
        )
    }
)
