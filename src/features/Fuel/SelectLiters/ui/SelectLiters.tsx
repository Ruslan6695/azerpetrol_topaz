import { useRouter } from 'expo-router'
import { memo, useCallback, useMemo, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { StepHeader } from '../../../../entities/StepHeader'
import {
    ESCREENS,
    FuelStore,
    IAzs,
    IColumn,
    ITrkType,
    RADII,
    SIZES,
    SPACING,
    ThemeStore,
    UserStore,
} from '../../../../shared'
import { AmountField } from '../../../../shared/AmountField'
import { GlassCard } from '../../../../shared/GlassCard'
import { ListGroup, ListRow } from '../../../../shared/ListRow'
import { PillButton } from '../../../../shared/PillButton'
import { Slider } from '../../../../shared/Slider'
import {
    ITabWithBackground,
    TabBarWithBackground,
} from '../../../../shared/TabBarWithBackground'
import { showError } from '../../../../shared/ToastComponent'
import { Typography } from '../../../../shared/Typography'
import { LITERS_STEP, MIN_LITERS } from '../config/constants/LITERS'
import { FuelBonusCard } from './FuelBonusCard'
import { LitersPresets } from './LitersPresets'

type Props = {
    column: IColumn
    azs: IAzs
    trkType: ITrkType
    onSubmit: (props: { liters: number; rubles: number }) => void
    onGoBack: () => void
}

const MODES: ITabWithBackground[] = [
    { label: 'Литры', value: 0 },
    { label: 'Сумма', value: 1 },
]

export const SelectLiters = memo(
    ({ azs, column, trkType, onSubmit, onGoBack }: Props) => {
        const COLORS = ThemeStore.useCOLORS()
        const router = useRouter()
        const fuelOnDebt = FuelStore.useState().fuelOnDebt
        const tankVolume = FuelStore.useTankVolume()
        const balance = UserStore.useBalance()

        const [mode, setMode] = useState<ITabWithBackground>(MODES[0])
        const [liters, setLiters] = useState(
            Math.min(20, tankVolume) || MIN_LITERS
        )

        const isLitersMode = mode.value === MODES[0].value
        const rubles = useMemo(
            () => Math.round(liters * trkType.price),
            [liters, trkType.price]
        )

        const handleChangeLiters = useCallback((value: number) => {
            setLiters(Number(value.toFixed(2)))
        }, [])

        // Сумма редактируется в рублях, но состояние одно — литры.
        const handleChangeRubles = useCallback(
            (value: number) => {
                setLiters(Number((value / trkType.price).toFixed(2)))
            },
            [trkType.price]
        )

        const handleSubmit = useCallback(() => {
            if (liters < MIN_LITERS) {
                showError({
                    text: `Минимальный объём налива — ${MIN_LITERS} л.`,
                })
                return
            }

            if (rubles > balance && !fuelOnDebt) {
                showError({ text: 'Недостаточно средств' })
                router.navigate({
                    pathname: ESCREENS.PAY_BALANCE,
                    params: {
                        sum: Math.ceil(rubles - balance),
                        backLink: ESCREENS.FUEL,
                    },
                })
                return
            }

            onSubmit({ liters, rubles })
        }, [liters, rubles, balance, fuelOnDebt, onSubmit, router])

        const styles = StyleSheet.create({
            amounts: {
                flexDirection: 'row',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                gap: SPACING.MD * SIZES.PX,
            },
            amountRight: {
                alignItems: 'flex-end',
            },
            section: {
                marginTop: SPACING.LG * SIZES.PX,
            },
            // Отступ поля от надстрочника (dc.html:535).
            field: {
                marginTop: 6 * SIZES.PX,
            },
        })

        return (
            <>
                <StepHeader title="Сумма и литры" onBack={onGoBack} />

                <TabBarWithBackground
                    tabs={MODES}
                    selectedTab={mode}
                    onChangeSelectedTab={setMode}
                    styled={{ width: { type: 'absolute', value: '100%' } }}
                />

                <View style={styles.section}>
                    <GlassCard
                        variant="glass2"
                        radius={RADII.HERO_SM}
                        paddingVertical={22}
                        paddingHorizontal={SPACING.SCREEN}
                    >
                        <View style={styles.amounts}>
                            <View>
                                <Typography type="eyebrow">Литры</Typography>
                                {isLitersMode ? (
                                    <AmountField
                                        value={liters}
                                        onChangeValue={handleChangeLiters}
                                        suffix="л"
                                        decimal
                                        min={MIN_LITERS}
                                        // Верхней границы у ручного ввода нет:
                                        // объём бака — это пресет для слайдера
                                        // и чипа, а не лимит налива.
                                        minWidth={86}
                                        radius={RADII.BADGE}
                                        style={styles.field}
                                    />
                                ) : (
                                    <Typography
                                        type="h2"
                                        marginsPaddings={{ mt: 2 }}
                                    >
                                        {`${liters.toFixed(1)} л`}
                                    </Typography>
                                )}
                            </View>

                            <View style={styles.amountRight}>
                                <Typography type="eyebrow">Сумма</Typography>
                                {isLitersMode ? (
                                    <Typography
                                        type="num28"
                                        customColor={COLORS.ACCENT.Primary}
                                        marginsPaddings={{ mt: 2 }}
                                    >
                                        {`${rubles} ₽`}
                                    </Typography>
                                ) : (
                                    <AmountField
                                        value={rubles}
                                        onChangeValue={handleChangeRubles}
                                        suffix="₽"
                                        fontSize={28}
                                        min={0}
                                        minWidth={92}
                                        radius={RADII.BADGE}
                                        color={COLORS.ACCENT.Primary}
                                        style={styles.field}
                                    />
                                )}
                            </View>
                        </View>
                    </GlassCard>
                </View>

                <View style={styles.section}>
                    <Slider
                        value={liters}
                        onChangeValue={handleChangeLiters}
                        min={MIN_LITERS}
                        max={tankVolume}
                        step={LITERS_STEP}
                    />
                </View>

                <View style={styles.section}>
                    <LitersPresets
                        liters={liters}
                        tankVolume={tankVolume}
                        onSelect={handleChangeLiters}
                    />
                </View>

                <View style={styles.section}>
                    <ListGroup>
                        <ListRow title="АЗС" value={azs.name} />
                        <ListRow
                            title="Топливо"
                            value={`${trkType.name} · Колонка ${column.name}`}
                        />
                        <ListRow
                            title="Цена за литр"
                            value={`${trkType.price} ₽`}
                            last
                        />
                    </ListGroup>
                </View>

                <View style={styles.section}>
                    <FuelBonusCard trkType={trkType} liters={liters} />
                </View>

                <View style={styles.section}>
                    <PillButton title="Начать налив" onPress={handleSubmit} />
                </View>
            </>
        )
    }
)
