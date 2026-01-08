import { memo, useCallback, useMemo, useState } from 'react'
import { Modal, StyleSheet, View } from 'react-native'
import Calendar from 'react-native-calendar-range-picker'
import { CloseIcon } from '../../CloseIcon'
import { COLORS } from '../../common/config/constants/COLORS'
import { SIZES } from '../../common/config/constants/sizes'
import { CustomButton } from '../../CustomButton'
import { CustomTouchableOpacity } from '../../CustomTouchableOpacity'
import { MPLayout } from '../../MpLayout'
import { showError } from '../../ToastComponent'
import { Typography } from '../../Typography'

type Props = {
    isOpened: boolean
    handleClose: () => void
    onSave: (props: { startDate: string; endDate: string }) => void
}
const LOCALE = {
    monthNames: [
        'Январь',
        'Февраль',
        'Март',
        'Апрель',
        'Май',
        'Июнь',
        'Июль',
        'Август',
        'Сентябрь',
        'Октябрь',
        'Ноябрь',
        'Декабрь',
    ],
    dayNames: ['Пон', 'Втр', 'Срд', 'Чтв', 'Пт', 'Суб', 'Вск'],
    today: '',
    year: '',
}
export const RangePickerModal = memo(
    ({ handleClose, isOpened, onSave }: Props) => {
        const [startDate, setStartDate] = useState<string>()
        const [endDate, setEndDate] = useState<string>()
        const showedDate = useMemo<string>(() => {
            let date = ''
            const startDates = startDate?.split('-')
            const endDates = endDate?.split('-')
            let startMonthName = ''
            let endMonthName = ''
            if (startDates && endDates) {
                if (startDates) {
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
                }
                if (endDates) {
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
                }
                if (startDate === endDate) {
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
        }, [startDate, endDate])

        const handleChangeDate = useCallback(
            (startDate: string, endDate: string) => {
                if (startDate) {
                    setStartDate(startDate)
                } else {
                    setStartDate(undefined)
                }
                if (endDate) {
                    setEndDate(endDate)
                } else {
                    setEndDate(undefined)
                }
            },
            []
        )

        const handleSave = useCallback(() => {
            if (startDate && endDate) {
                onSave({ startDate, endDate })
                handleClose()
            } else {
                showError({ text: 'Выберите обе даты' })
                handleClose()
            }
        }, [startDate, endDate])
        return (
            <Modal
                transparent
                visible={isOpened}
                onRequestClose={handleClose}
                animationType="slide"
            >
                <View style={styles.wrapper}>
                    <View style={styles.container}>
                        <View style={styles.topRow}>
                            <CustomTouchableOpacity onPress={handleClose}>
                                <CloseIcon />
                            </CustomTouchableOpacity>
                            <CustomButton
                                onPress={handleSave}
                                styled={{
                                    type: 'secondary',
                                    width: { type: 'px', value: 120 },
                                    height: { type: 'px', value: 40 },
                                }}
                            >
                                СОХРАНИТЬ
                            </CustomButton>
                        </View>
                        <MPLayout mt={10} mb={20}>
                            <Typography color="secondary" type="caption">
                                Выберите дату:
                            </Typography>
                            <Typography type="bodyAccentMedium">
                                {showedDate || 'Не выбрано'}
                            </Typography>
                        </MPLayout>
                        <Calendar
                            startDate={startDate}
                            endDate={endDate}
                            isMonthFirst
                            locale={LOCALE}
                            style={{
                                container: {
                                    width: SIZES.WIDTH(0.9),
                                    height: SIZES.HEIGHT(1),
                                },
                            }}
                            pastYearRange={5}
                            futureYearRange={2}
                            onChange={({ startDate, endDate }) => {
                                handleChangeDate(startDate, endDate)
                            }}
                        />
                    </View>
                </View>
            </Modal>
        )
    }
)

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.49)',
    },
    container: {
        position: 'relative',
        width: '100%',
        backgroundColor: COLORS.BACKGROUND.Tertiary,
        height: '95%',
        padding: 20,
    },
    topRow: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
    },
})
