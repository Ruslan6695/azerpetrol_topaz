import React from 'react'
import { Keyboard, TouchableOpacity, TouchableOpacityProps } from 'react-native'

type Props = {}
interface IProps extends TouchableOpacityProps {
    children: React.ReactNode
}
export const CustomTouchableOpacity = (props: IProps) => {
    return (
        <TouchableOpacity
            {...props}
            onPress={(e) => {
                props.onPress && props.onPress(e)
                Keyboard.dismiss()
            }}
        >
            {props.children}
        </TouchableOpacity>
    )
}
