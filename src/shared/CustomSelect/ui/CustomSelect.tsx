import React, { ReactNode } from 'react'
import { StyleSheet, View } from 'react-native'
import { CustomTouchableOpacity } from '../../CustomTouchableOpacity'
import { CustomText } from '../../CustomText'
import { COLORS } from '../../common/config/constants/COLORS'
import { IMarginsPaddings } from '../../common/config/interfaces/IMarginsPaddings'
import { SIZES } from '../../common/config/constants/sizes'
import { useModal } from '../../common/config/lib/hooks/useModal'
import { CustomSelectBottomSheet } from './CustomSelectBottomSheet'
import { ISelectOption } from '../config/interfaces/ISelectOption'
import { DisabledIcon } from '../../DisabledIcon'

type Props = {
    styled?: {
        marginsPaddings?: IMarginsPaddings
        width?: {
            value: number | string
            type?: 'px' | 'absolute'
        }
        height?: {
            value: number | string
            type?: 'px' | 'absolute'
        }
    }
    placeholder: string
    title?: string
    options: ISelectOption[]
    selectedOption: ISelectOption | null
    onChangeOption: (option: ISelectOption | null) => void
    icon?: ReactNode
    disabledProps?: {
        disabled: boolean
        disabledText?: string
    }
}

export const CustomSelect = (props: Props) => {
    const { handleCloseModal, handleOpenModal, isShowModal } = useModal()
    const width = props.styled
        ? props.styled.width
            ? (props.styled.width.type === 'px' || !props.styled.width) &&
              typeof props.styled.width.value === 'number'
                ? props.styled.width.value * SIZES.PX
                : props.styled.width.value
            : SIZES.WIDTH(0.85)
        : SIZES.WIDTH(0.85)

    const height = props.styled
        ? props.styled.height
            ? (props.styled.height.type === 'px' || !props.styled.height) &&
              typeof props.styled.height.value === 'number'
                ? props.styled.height.value * SIZES.PX
                : props.styled.height.value
            : 56 * SIZES.PX
        : 56 * SIZES.PX
    const styles = StyleSheet.create({
        wrapper: {
            marginTop: props.styled?.marginsPaddings?.mt
                ? props.styled?.marginsPaddings?.mt * SIZES.PX
                : 0,
            marginBottom: props.styled?.marginsPaddings?.mb
                ? props.styled?.marginsPaddings?.mb * SIZES.PX
                : 0,
            marginRight: props.styled?.marginsPaddings?.mr
                ? props.styled?.marginsPaddings?.mr * SIZES.PX
                : 0,
            marginLeft: props.styled?.marginsPaddings?.ml
                ? props.styled?.marginsPaddings?.ml * SIZES.PX
                : 0,
        },
        container: {
            backgroundColor: props.disabledProps?.disabled
                ? COLORS.GRAY_3
                : COLORS.GRAY_2,
            //@ts-ignore
            width,
            //@ts-ignore
            height,
            borderRadius: SIZES.PX * 10,
            fontSize: SIZES.PX * 15,
            paddingVertical: 15,
            paddingHorizontal: props.icon ? SIZES.PX * 5 : SIZES.PX * 21,
            flexDirection: 'row',
            alignItems: 'center',
        },
        iconContainer: {
            width: 25 * SIZES.PX,
            height: 25 * SIZES.PX,
            marginLeft: 10 * SIZES.PX,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: SIZES.PX * 10,
        },
    })
    return (
        <>
            <View style={styles.wrapper}>
                {props.title && (
                    <CustomText fw="600" marginsPaddings={{ mb: 7, ml: 5 }}>
                        {props.title.toUpperCase()}
                    </CustomText>
                )}
                <CustomTouchableOpacity
                    activeOpacity={!props.disabledProps?.disabled ? 0.4 : 1}
                    onPress={
                        !props.disabledProps?.disabled
                            ? handleOpenModal
                            : undefined
                    }
                    style={styles.container}
                >
                    {props.icon && (
                        <>
                            <View style={styles.iconContainer}>
                                {props.disabledProps?.disabled ? (
                                    <DisabledIcon />
                                ) : (
                                    props.icon
                                )}
                            </View>
                        </>
                    )}
                    <CustomText secondary={props.disabledProps?.disabled}>
                        {props.selectedOption
                            ? props.selectedOption.label
                            : props.disabledProps?.disabled &&
                              props.disabledProps.disabledText
                            ? props.disabledProps.disabledText
                            : props.placeholder}
                    </CustomText>
                </CustomTouchableOpacity>
            </View>
            {
                <CustomSelectBottomSheet
                    onChangeOption={props.onChangeOption}
                    selectedOption={props.selectedOption}
                    options={props.options}
                    title={props.placeholder}
                    isOpened={isShowModal}
                    handleClose={handleCloseModal}
                />
            }
        </>
    )
}
