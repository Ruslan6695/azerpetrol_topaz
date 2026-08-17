import { memo, useCallback, useState } from 'react'
import { Modal, StyleSheet, View } from 'react-native'
import Calendar from 'react-native-calendar-range-picker'
import { CloseIcon } from '../../CloseIcon'
import { RADII } from '../../common/config/constants/RADII'
import { SPACING } from '../../common/config/constants/SPACING'
import { SIZES } from '../../common/config/constants/sizes'
import { ThemeStore } from '../../common/model/themeStore'
import { PillButton } from '../../PillButton'
import { PressableScale } from '../../PressableScale'
import { showError } from '../../ToastComponent'
import { Typography } from '../../Typography'
import { formatRangeDate } from '../lib/formatRangeDate'

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
        const COLORS = ThemeStore.useCOLORS()
        const [startDate, setStartDate] = useState<string>()
        const [endDate, setEndDate] = useState<string>()

        const showedDate =
            startDate && endDate
                ? `${formatRangeDate(startDate)} — ${formatRangeDate(endDate)}`
                : ''

        const handleChangeDate = useCallback(
            (start: string | null, end: string | null) => {
                setStartDate(start ?? undefined)
                setEndDate(end ?? undefined)
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

        const styles = StyleSheet.create({
            wrapper: {
                flex: 1,
                justifyContent: 'flex-end',
                alignItems: 'center',
                backgroundColor: COLORS.EFFECTS.Backdrop,
            },
            // Поверхность шита непрозрачная: полупрозрачное стекло над
            // затемнённым бэкдропом просвечивает и выглядит сломанным.
            container: {
                width: '100%',
                height: '95%',
                backgroundColor: COLORS.GLASS.Surface,
                borderTopLeftRadius: RADII.SHEET * SIZES.PX,
                borderTopRightRadius: RADII.SHEET * SIZES.PX,
                padding: SPACING.SCREEN * SIZES.PX,
            },
            topRow: {
                justifyContent: 'space-between',
                flexDirection: 'row',
                width: '100%',
                alignItems: 'center',
            },
            period: {
                marginTop: SPACING.ROW_GAP * SIZES.PX,
                marginBottom: SPACING.SCREEN * SIZES.PX,
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
                        <View style={styles.topRow}>
                            <PressableScale onPress={handleClose}>
                                <CloseIcon />
                            </PressableScale>
                            <PillButton
                                title="Сохранить"
                                onPress={handleSave}
                                size="sm"
                                fullWidth={false}
                            />
                        </View>

                        <View style={styles.period}>
                            <Typography color="secondary" type="caption12">
                                Выберите период:
                            </Typography>
                            <Typography type="rowTitle">
                                {showedDate || 'Не выбрано'}
                            </Typography>
                        </View>

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
