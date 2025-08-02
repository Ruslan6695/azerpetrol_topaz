import React, { useEffect, useState } from 'react'
import { Modal, StyleSheet, View } from 'react-native'
import { CustomButton } from '../../CustomButton'
import { CustomText } from '../../CustomText'
import { MPLayout } from '../../MpLayout'
import { COLORS } from '../../common/config/constants/COLORS'
import { SIZES } from '../../common/config/constants/sizes'
import { ISelectOption } from '../config/interfaces/ISelectOption'
import WheelPickerExpo from '../../WheelPicker'

type Props = {
    handleClose: () => void
    isOpened: boolean
    title: string
    options: ISelectOption[]
    selectedOption: ISelectOption | null
    onChangeOption: (option: ISelectOption | null) => void
}

export const CustomSelectBottomSheet = ({
    handleClose,
    isOpened,
    title,
    options,
    selectedOption,
    onChangeOption,
}: Props) => {
    const [initialSelectedIndex, setInitialSelectedIndex] = useState<number>()
    const [selected, setSelected] = useState<ISelectOption | null>(null)

    const handleSubmit = () => {
        onChangeOption(selected)
        handleClose()
    }

    useEffect(() => {
        if (selectedOption) {
            setSelected(selectedOption)
        } else {
            setSelected(options[0])
        }

        let findedIndex = options.findIndex(
            (item) => item.value == selectedOption?.value
        )
        if (findedIndex >= 0) {
            setInitialSelectedIndex(findedIndex)
        } else {
            setInitialSelectedIndex(0)
        }
    }, [selectedOption, options])

    return (
        <Modal
            transparent
            visible={isOpened}
            onRequestClose={handleClose}
            animationType="slide"
        >
            <View style={styles.wrapper}>
                <View style={styles.container}>
                    <View style={styles.title}>
                        <CustomText
                            marginsPaddings={{ pt: 20 }}
                            fw="600"
                            fz={20}
                        >
                            {title.toUpperCase()}
                        </CustomText>
                    </View>

                    <View style={styles.top}>
                        <CustomButton
                            onPress={handleClose}
                            styled={{
                                type: 'OUTLINED',
                                width: { type: 'px', value: 110 },
                                height: { type: 'px', value: 45 },
                                fz: 13,
                            }}
                        >
                            Отменить
                        </CustomButton>
                        <CustomButton
                            onPress={handleSubmit}
                            styled={{
                                type: 'DARK',
                                width: { type: 'px', value: 110 },
                                height: { type: 'px', value: 45 },
                                fz: 13,
                            }}
                        >
                            Подтвердить
                        </CustomButton>
                    </View>
                    <MPLayout mt={30}>
                        <WheelPickerExpo
                            initialSelectedIndex={initialSelectedIndex}
                            width={SIZES.WIDTH(1)}
                            height={300 * SIZES.PX}
                            haptics
                            selectedStyle={{
                                borderColor: COLORS.GRAY_2,
                                borderWidth: 1,
                            }}
                            items={options}
                            onChange={({ item }) => {
                                setSelected(item)
                            }}
                        />
                    </MPLayout>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.49)',
    },
    container: {
        alignItems: 'center',
        position: 'relative',
        width: '100%',
        backgroundColor: COLORS.WHITE,
        borderTopLeftRadius: SIZES.PX * 30,
        borderTopRightRadius: SIZES.PX * 30,
    },
    title: {
        position: 'absolute',
        zIndex: 1,
        backgroundColor: COLORS.WHITE,
        paddingBottom: SIZES.PX * 50,
        width: '100%',
        alignItems: 'center',
    },
    top: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: SIZES.PX * 20,
        position: 'absolute',
        zIndex: 1,
        marginTop: 60 * SIZES.PX,
        backgroundColor: COLORS.WHITE,
    },
})
