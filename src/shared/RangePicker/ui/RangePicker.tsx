import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { PRESS_SCALE } from '../../common/config/constants/PRESS_SCALE'
import { RADII } from '../../common/config/constants/RADII'
import { SPACING } from '../../common/config/constants/SPACING'
import { SIZES } from '../../common/config/constants/sizes'
import { useModal } from '../../common/config/lib/hooks/useModal'
import { Glass } from '../../GlassCard'
import { LinkButton } from '../../LinkButton'
import { PressableScale } from '../../PressableScale'
import { Typography } from '../../Typography'
import { formatRangeDate } from '../lib/formatRangeDate'
import { RangePickerModal } from './RangePickerModal'

type Props = {
    dates: {
        startDate: undefined | string
        endDate: undefined | string
    }
    onChangeDates: (dates: { startDate: string; endDate: string }) => void
    onResetDate?: () => void
}

// Период из макета (dc.html:289–297): два стеклянных поля 44 в ряд.
// В прототипе за каждым полем стоит нативный date-picker, которого в RN нет,
// поэтому оба поля открывают одну модалку-диапазон RangePickerModal —
// новую библиотеку под это не тянем.
export const RangePicker = memo(
    ({ dates, onChangeDates, onResetDate }: Props) => {
        const { handleCloseModal, handleOpenModal, isShowModal } = useModal()

        const hasPeriod = Boolean(dates.startDate && dates.endDate)

        const styles = StyleSheet.create({
            row: {
                flexDirection: 'row',
                gap: SPACING.ROW_GAP * SIZES.PX,
            },
            field: {
                flex: 1,
            },
            fieldBody: {
                height: 44 * SIZES.PX,
                alignItems: 'center',
                justifyContent: 'center',
            },
        })

        return (
            <View>
                <View style={styles.row}>
                    <PressableScale
                        onPress={handleOpenModal}
                        scaleTo={PRESS_SCALE.ROW}
                        style={styles.field}
                    >
                        <Glass radius={RADII.BADGE * SIZES.PX}>
                            <View style={styles.fieldBody}>
                                <Typography type="body13" color="secondary">
                                    {formatRangeDate(dates.startDate) ||
                                        'Дата от'}
                                </Typography>
                            </View>
                        </Glass>
                    </PressableScale>

                    <PressableScale
                        onPress={handleOpenModal}
                        scaleTo={PRESS_SCALE.ROW}
                        style={styles.field}
                    >
                        <Glass radius={RADII.BADGE * SIZES.PX}>
                            <View style={styles.fieldBody}>
                                <Typography type="body13" color="secondary">
                                    {formatRangeDate(dates.endDate) ||
                                        'Дата до'}
                                </Typography>
                            </View>
                        </Glass>
                    </PressableScale>
                </View>

                {onResetDate && hasPeriod && (
                    <LinkButton title="Сбросить период" onPress={onResetDate} />
                )}

                <RangePickerModal
                    onSave={onChangeDates}
                    handleClose={handleCloseModal}
                    isOpened={isShowModal}
                />
            </View>
        )
    }
)
