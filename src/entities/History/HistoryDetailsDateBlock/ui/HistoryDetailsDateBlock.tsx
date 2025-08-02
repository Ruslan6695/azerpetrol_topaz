import { memo } from 'react'
import { CustomText } from '../../../../shared/CustomText'
import { COLORS } from '../../../../shared'
import { EHistoryItemType } from '../../config/enums/EHistoryItemType'

type Props = {
    text: string
    date: string
    type: EHistoryItemType
}

export const HistoryDetailsDateBlock = memo(({ text, date, type }: Props) => {
    return (
        <>
            <CustomText fz={15}>{date}</CustomText>
            <CustomText
                color={
                    type === EHistoryItemType.PAY_BALANCE
                        ? COLORS.GREEN_2
                        : COLORS.RED
                }
                fz={13}
            >
                {text}
            </CustomText>
        </>
    )
})
