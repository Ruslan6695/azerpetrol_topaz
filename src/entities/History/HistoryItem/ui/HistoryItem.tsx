import { memo, useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import { IHistoryItem } from '../config/interfaces/IHistoryItem'
import { EHistoryItemType } from '../../config/enums/EHistoryItemType'
import { CustomText } from '../../../../shared/CustomText'
import { COLORS, ESCREENS, SIZES, divideNumber } from '../../../../shared'
import { CoffeeIcon } from '../../../../shared/Icons/CoffeeIcon'
import { WalletIcon } from '../../../../shared/WalletIcon'
import { PersonIcon } from '../../../../shared/Icons/PersonIcon'
import { FuelIcon } from '../../../../shared/Icons/FuelIcon'
import { CustomTouchableOpacity } from '../../../../shared/CustomTouchableOpacity'
import { useRouter } from 'expo-router'
import { ProductsIcon } from '../../../../shared/Icons/ProductsIcon/ui/ProductsIcon'

interface IProps extends IHistoryItem {}
export const HistoryItem = memo(
    ({ date, text, type, sum, header, id }: IProps) => {
        const router = useRouter()
        const handlePress = useCallback(() => {
            router.navigate({
                pathname: ESCREENS.HISTORY_DETAILS,
                params: { type, id },
            })
        }, [id, type])
        return (
            <CustomTouchableOpacity
                onPress={handlePress}
                activeOpacity={0.6}
                style={styles.container}
            >
                <View style={styles.left}>
                    <CustomText
                        fw="300"
                        color={sum > 0 ? COLORS.GREEN : COLORS.RED}
                        fz={13}
                    >
                        {header}
                    </CustomText>
                    <CustomText fz={13}>{date}</CustomText>
                </View>
                <View style={styles.right}>
                    {type === EHistoryItemType.BUY_COFFEE ? (
                        <CoffeeIcon width={15} size={20} />
                    ) : type === EHistoryItemType.PAY_BALANCE ? (
                        <WalletIcon size={15} />
                    ) : type === EHistoryItemType.TRANSFER_BALANCE ? (
                        <PersonIcon size={15} />
                    ) : type === EHistoryItemType.FUEL_FILLING ? (
                        <FuelIcon size={18} />
                    ) : type === EHistoryItemType.BUY_ON_CASH ? (
                        <ProductsIcon size={20} />
                    ) : (
                        <></>
                    )}

                    <CustomText fz={13}> {divideNumber(sum)} ₽</CustomText>
                </View>
            </CustomTouchableOpacity>
        )
    }
)
const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        marginVertical: SIZES.PX * 5,
        alignItems: 'center',
    },
    left: {
        flex: 4,
        backgroundColor: COLORS.WHITE,
    },
    right: {
        flexDirection: 'row',
        backgroundColor: COLORS.GRAY_3,
        paddingHorizontal: SIZES.PX * 10,
        paddingVertical: SIZES.PX * 5,
        borderRadius: SIZES.PX * 5,
        flex: 1.5,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
})
