import React from 'react'
import { StyleSheet, View } from 'react-native'
import { COLORS, SIZES } from '../../../shared'
import { CustomText } from '../../../shared/CustomText'
import { CustomTouchableOpacity } from '../../../shared/CustomTouchableOpacity'
import { Logo } from '../../../shared/Logo'
import { MPLayout } from '../../../shared/MpLayout'
import { IContactItem } from '../config/interfaces/IContactItem'
import { PersonIcon } from '../../../shared/Icons/PersonIcon'

interface IProps extends IContactItem {
    onPress: (contact: IContactItem) => void
}

export const ContactItem = ({ id, name, phone, onPress }: IProps) => {
    const handlePress = () => {
        onPress({ id, name, phone })
    }
    return (
        <CustomTouchableOpacity
            onPress={handlePress}
            activeOpacity={0.6}
            style={styles.container}
        >
            <View style={styles.left}>
                <PersonIcon size={25} />
                <MPLayout ml={10}>
                    <CustomText>{name}</CustomText>
                    <CustomText secondary>{phone}</CustomText>
                </MPLayout>
            </View>
            <Logo size={25} />
        </CustomTouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomColor: COLORS.GRAY_2,
        paddingVertical: SIZES.PX * 5,
        borderBottomWidth: 1,
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
    },
})
