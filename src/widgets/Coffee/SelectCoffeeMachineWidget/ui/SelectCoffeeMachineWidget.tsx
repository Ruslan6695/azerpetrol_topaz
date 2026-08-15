import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { ErrorWhileFetchingForm } from '../../../../entities/ErrorWhileFetchingForm'
import { InfoCard } from '../../../../entities/InfoCard'
import { StepHeader } from '../../../../entities/StepHeader'
import {
    CoffeeMachinesStore,
    SelectCoffeeMachine,
} from '../../../../features/Coffee/SelectCoffeeMachine'
import { SIZES, SPACING } from '../../../../shared'
import { SELECT_COFFEE_MACHINE_WIDGET_INFO_TEXTS } from '../config/constants/SELECT_COFFEE_MACHINE_WIDGET_INFO_TEXTS'

type Props = {
    onSelectCoffeeMachineId: (id: number) => void
    onGoBack: () => void
    onReload: () => void
}

// Шаг выбора кофемашины из списка.
export const SelectCoffeeMachineWidget = memo(
    ({ onSelectCoffeeMachineId, onGoBack, onReload }: Props) => {
        const error = CoffeeMachinesStore.useError()

        const styles = StyleSheet.create({
            info: {
                gap: SPACING.ROW_GAP * SIZES.PX,
                marginTop: SPACING.XXL * SIZES.PX,
            },
        })

        return (
            <>
                <StepHeader title="Выбор кофемашины" onBack={onGoBack} />
                {error ? (
                    <ErrorWhileFetchingForm
                        margins={{ mt: 100 }}
                        message={error}
                        onReload={onReload}
                    />
                ) : (
                    <>
                        <SelectCoffeeMachine
                            onSelect={onSelectCoffeeMachineId}
                        />
                        <View style={styles.info}>
                            {SELECT_COFFEE_MACHINE_WIDGET_INFO_TEXTS.map(
                                (info) => (
                                    <InfoCard key={info.title} {...info} />
                                )
                            )}
                        </View>
                    </>
                )}
            </>
        )
    }
)
