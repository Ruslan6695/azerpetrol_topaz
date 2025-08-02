import { memo } from 'react'
import {
    HistoryDetailsTransferBalanceItem,
    IHistoryDetailsTransferBalanceItem,
} from '../../../../entities/History/HistoryDetailsTransferBalanceItem'
import { StyleSheet, View } from 'react-native'
import { SIZES, divideNumber } from '../../../../shared'
import { PersonIcon } from '../../../../shared/Icons/PersonIcon'
import { PhoneIcon } from '../../../../shared/PhoneIcon'
import { SumIcon } from '../../../../shared/SumIcon'

type Props = {
    info: IHistoryDetailsTransferBalanceItem
}

export const OpenHistoryDetailsTransferBalance = ({ info }: Props) => {
    return (
        <View style={styles.container}>
            <HistoryDetailsTransferBalanceItem
                icon={<PersonIcon />}
                info={info.transfer_name}
                title="Получатель"
            />
            <HistoryDetailsTransferBalanceItem
                icon={<PhoneIcon />}
                info={info.transfer_phone}
                title="Телефон"
            />
            <HistoryDetailsTransferBalanceItem
                icon={<SumIcon />}
                info={`${divideNumber(info.sum)} ₽`}
                title="Cумма"
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        gap: SIZES.PX * 10,
        marginTop: SIZES.PX * 20,
    },
})
