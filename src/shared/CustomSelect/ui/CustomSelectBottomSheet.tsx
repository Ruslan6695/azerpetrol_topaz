import React, { useEffect, useState } from 'react'
import { Modal, StyleSheet, View } from 'react-native'
import { MPLayout } from '../../MpLayout'
import { PillButton } from '../../PillButton'
import { Typography } from '../../Typography'
import WheelPickerExpo from '../../WheelPicker'
import { RADII } from '../../common/config/constants/RADII'
import { SIZES } from '../../common/config/constants/sizes'
import { ISelectOption } from '../config/interfaces/ISelectOption'
import { ThemeStore } from '../../common/model/themeStore'

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
    const COLORS = ThemeStore.useCOLORS()
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

    // Шит лежит над затемнённым бэкдропом — поверхность должна быть непрозрачной.
    const styles = StyleSheet.create({
        wrapper: {
            flex: 1,
            justifyContent: 'flex-end',
            alignItems: 'center',
            backgroundColor: COLORS.EFFECTS.Backdrop,
        },
        container: {
            alignItems: 'center',
            position: 'relative',
            width: '100%',
            backgroundColor: COLORS.GLASS.Surface,
            borderTopLeftRadius: RADII.SHEET * SIZES.PX,
            borderTopRightRadius: RADII.SHEET * SIZES.PX,
        },
        // Кнопки лежат в ряду с space-between, поэтому ширину задаём здесь:
        // PillButton с fullWidth={false} тянется по контенту.
        button: {
            minWidth: 120 * SIZES.PX,
        },
        title: {
            position: 'absolute',
            zIndex: 1,
            backgroundColor: COLORS.GLASS.Surface,
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
            backgroundColor: COLORS.GLASS.Surface,
        },
    })

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
                        <Typography
                            type="num16"
                            marginsPaddings={{ pt: 20 }}
                        >
                            {title.toUpperCase()}
                        </Typography>
                    </View>

                    <View style={styles.top}>
                        <PillButton
                            title="Отменить"
                            onPress={handleClose}
                            variant="secondary"
                            size="md"
                            fullWidth={false}
                            style={styles.button}
                        />
                        <PillButton
                            title="Подтвердить"
                            onPress={handleSubmit}
                            size="md"
                            fullWidth={false}
                            style={styles.button}
                        />
                    </View>
                    <MPLayout mt={30}>
                        <WheelPickerExpo
                            initialSelectedIndex={initialSelectedIndex}
                            width={SIZES.WIDTH(1)}
                            height={300 * SIZES.PX}
                            haptics
                            backgroundColor={COLORS.GLASS.Surface}
                            selectedStyle={{
                                borderColor: COLORS.BACKGROUND.Secondary,
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
