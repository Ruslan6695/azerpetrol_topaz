import { memo } from 'react'
import { View } from 'react-native'
import { CustomText } from '../../../../shared/CustomText'
import { divideNumber } from '../../../../shared'

type Props = {
    sum: number
}

export const OpenHistoryDetailsPayBalance = memo(({ sum }: Props) => {
    return (
        <>
            <CustomText fz={18} marginsPaddings={{ mt: 20 }} secondary>
                Cумма
            </CustomText>
            <CustomText fz={25} fw="600">
                {divideNumber(sum)} ₽
            </CustomText>
        </>
    )
})
