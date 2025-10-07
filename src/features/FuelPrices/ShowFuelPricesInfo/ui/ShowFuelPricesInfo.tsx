import React from 'react'
import { CustomText } from '../../../../shared/CustomText'
import { IInfoBlock, InfoBlock } from '../../../../entities/InfoBlock'

type Props = {
    info: IInfoBlock
}

export const ShowFuelPricesInfo = ({ info }: Props) => {
    return (
        <InfoBlock
            title={info.title}
            info={info.info}
            marginsPaddings={{ mt: 20 }}
        />
    )
}
