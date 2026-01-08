import React from 'react'
import { StyleSheet, View } from 'react-native'
import { SIZES } from '../../../shared'
import { CustomTouchableOpacity } from '../../../shared/CustomTouchableOpacity'
import { PersonIcon } from '../../../shared/Icons/PersonIcon'
import { Logo, LogoFull } from '../../../shared/Logo'
import { MPLayout } from '../../../shared/MpLayout'
import { Typography } from '../../../shared/Typography'
import { IContactItem } from '../config/interfaces/IContactItem'

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
                <PersonIcon size={24} />
                <MPLayout ml={10}>
                    <Typography type="bodySmall">{name}</Typography>
                    <Typography color="secondary" type="caption">
                        {phone}
                    </Typography>
                </MPLayout>
            </View>
            <Logo size={20} />
        </CustomTouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: SIZES.PX * 5,
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
    },
})
