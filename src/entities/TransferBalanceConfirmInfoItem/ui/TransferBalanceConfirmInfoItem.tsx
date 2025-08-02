import { memo } from 'react'
import { CustomText } from '../../../shared/CustomText'
import { MPLayout } from '../../../shared/MpLayout'

type Props = {
    title: string
    info: string
}

export const TransferBalanceConfirmInfoItem = memo(({ info, title }: Props) => {
    return (
        <MPLayout mt={5} mb={5}>
            <CustomText fz={13} secondary>
                {title}
            </CustomText>
            <CustomText fw="500" fz={20}>
                {info}
            </CustomText>
        </MPLayout>
    )
})
