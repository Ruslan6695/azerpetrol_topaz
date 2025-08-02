import React from 'react'
import { CustomText } from '../../../shared/CustomText'
import { IHelpInfoItem } from '../config/interfaces/IHelpInfoItem'



export const HelpInfoItem = ({ address, phone, title }: IHelpInfoItem) => {
    return (
        <>
            <CustomText>{title}</CustomText>
            <CustomText>{phone}</CustomText>
            {address && <CustomText>{address}</CustomText>}
        </>
    )
}
