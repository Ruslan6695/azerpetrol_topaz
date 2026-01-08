import AntDesign from '@expo/vector-icons/AntDesign'
import { memo, useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import { SIZES } from '../../common/config/constants/sizes'
import { IMarginsPaddings } from '../../common/config/interfaces/IMarginsPaddings'
import { useModal } from '../../common/config/lib/hooks/useModal'
import { ThemeStore } from '../../common/model/themeStore'
import { CustomTouchableOpacity } from '../../CustomTouchableOpacity'
import { Typography } from '../../Typography'
import { RangePickerModal } from './RangePickerModal'

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
    dates: {
        startDate: undefined | string
        endDate: undefined | string
    }
    onChangeDates: (dates: { startDate: string; endDate: string }) => void
    onResetDate?: () => void
}

export const RangePicker = memo(
    ({ styled, dates, onChangeDates, onResetDate }: Props) => {
        const COLORS = ThemeStore.useCOLORS()
        const { handleCloseModal, handleOpenModal, isShowModal } = useModal()

        const showedDates = useMemo<string>(() => {
            let date = ''

            if (dates.startDate && dates.endDate) {
                const startDates = dates.startDate?.split('-')
                const endDates = dates.endDate?.split('-')
                let startMonthName = ''
                let endMonthName = ''

                switch (startDates[1]) {
                    case '01': {
                        startMonthName = 'Январь'
                        break
                    }
                    case '02': {
                        startMonthName = 'Февраль'
                        break
                    }
                    case '03': {
                        startMonthName = 'Март'
                        break
                    }
                    case '04': {
                        startMonthName = 'Апрель'
                        break
                    }
                    case '05': {
                        startMonthName = 'Май'
                        break
                    }
                    case '06': {
                        startMonthName = 'Июль'
                        break
                    }
                    case '07': {
                        startMonthName = 'Июнь'
                        break
                    }
                    case '08': {
                        startMonthName = 'Август'
                        break
                    }
                    case '09': {
                        startMonthName = 'Сентябрь'
                        break
                    }
                    case '10': {
                        startMonthName = 'Октябрь'
                        break
                    }
                    case '11': {
                        startMonthName = 'Ноябрь'
                        break
                    }
                    case '12': {
                        startMonthName = 'Декабрь'
                        break
                    }
                }

                switch (endDates[1]) {
                    case '01': {
                        endMonthName = 'Январь'
                        break
                    }
                    case '02': {
                        endMonthName = 'Февраль'
                        break
                    }
                    case '03': {
                        endMonthName = 'Март'
                        break
                    }
                    case '04': {
                        endMonthName = 'Апрель'
                        break
                    }
                    case '05': {
                        endMonthName = 'Май'
                        break
                    }
                    case '06': {
                        endMonthName = 'Июль'
                        break
                    }
                    case '07': {
                        endMonthName = 'Июнь'
                        break
                    }
                    case '08': {
                        endMonthName = 'Август'
                        break
                    }
                    case '09': {
                        endMonthName = 'Сентябрь'
                        break
                    }
                    case '10': {
                        endMonthName = 'Октябрь'
                        break
                    }
                    case '11': {
                        endMonthName = 'Ноябрь'
                        break
                    }
                    case '12': {
                        endMonthName = 'Декабрь'
                        break
                    }
                }
                if (dates.startDate === dates.endDate) {
                    date = `${startDates[2]} ${startMonthName} ${startDates[0]}`
                } else if (
                    startDates[0] === endDates[0] &&
                    startDates[1] === endDates[1]
                ) {
                    date = `${startDates[2]} - ${endDates[2]} ${endMonthName} ${endDates[0]}`
                } else {
                    date = `${startDates[2]} ${startMonthName} ${startDates[0]} - ${endDates[2]} ${endMonthName} ${endDates[0]}`
                }
            }

            return date
        }, [dates])

        const width = styled
            ? styled.width
                ? (styled.width.type === 'px' || !styled.width) &&
                  typeof styled.width.value === 'number'
                    ? styled.width.value * SIZES.PX
                    : styled.width.value
                : SIZES.WIDTH(0.85)
            : SIZES.WIDTH(0.85)

        const height = styled
            ? styled.height
                ? (styled.height.type === 'px' || !styled.height) &&
                  typeof styled.height.value === 'number'
                    ? styled.height.value * SIZES.PX
                    : styled.height.value
                : 45 * SIZES.PX
            : 45 * SIZES.PX

        const styles = StyleSheet.create({
            wrapper: {
                alignItems: 'flex-end',
            },
            picker: {
                backgroundColor: COLORS.BACKGROUND.Tertiary,
                marginTop: styled?.marginsPaddings?.mt
                    ? styled?.marginsPaddings?.mt * SIZES.PX
                    : 0,
                marginBottom: styled?.marginsPaddings?.mb
                    ? styled?.marginsPaddings?.mb * SIZES.PX
                    : 0,
                marginRight: styled?.marginsPaddings?.mr
                    ? styled?.marginsPaddings?.mr * SIZES.PX
                    : 0,
                marginLeft: styled?.marginsPaddings?.ml
                    ? styled?.marginsPaddings?.ml * SIZES.PX
                    : 0,
                //@ts-ignore
                width,
                //@ts-ignore
                height,
                borderRadius: SIZES.PX * 10,
                fontSize: SIZES.PX * 15,
                paddingVertical: 0,
                paddingHorizontal: SIZES.PX * 15,
                flexDirection: 'row',
                alignItems: 'center',
            },
            iconContainer: {
                width: 25 * SIZES.PX,
                height: 25 * SIZES.PX,
                marginLeft: 0 * SIZES.PX,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: SIZES.PX * 10,
            },
        })
        return (
            <View style={styles.wrapper}>
                {onResetDate && dates.endDate && dates.startDate && (
                    <CustomTouchableOpacity onPress={onResetDate}>
                        <Typography type="caption">Cбросить</Typography>
                    </CustomTouchableOpacity>
                )}

                <CustomTouchableOpacity
                    onPress={handleOpenModal}
                    style={styles.picker}
                >
                    <>
                        <View style={styles.iconContainer}>
                            <AntDesign
                                name="calendar"
                                size={20 * SIZES.PX}
                                color="#636F74"
                            />
                        </View>
                    </>

                    <View>
                        <Typography type="caption">
                            {showedDates || 'Даты не выбраны'}
                        </Typography>
                    </View>
                </CustomTouchableOpacity>
                <RangePickerModal
                    onSave={onChangeDates}
                    handleClose={handleCloseModal}
                    isOpened={isShowModal}
                />
            </View>
        )
    }
)
