import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import {
    CoffeeMachineRow,
    CoffeeMachineRowSkeleton,
} from '../../../../entities/Coffee/CoffeeMachineRow'
import { SIZES, SPACING } from '../../../../shared'
import { CoffeeMachinesStore } from '../model/coffeeMachinesStore'

type Props = {
    onSelect: (id: number) => void
}

const PLACEHOLDERS = [1, 2, 3]

// Список кофемашин (dc.html:498–503). Кнопки «Вернуться назад» здесь нет:
// возврат даёт StepHeader над списком.
export const SelectCoffeeMachine = memo(({ onSelect }: Props) => {
    const coffeeMachines = CoffeeMachinesStore.useCoffeeMachines()
    const isLoading = CoffeeMachinesStore.useIsLoading()

    return (
        <View style={styles.container}>
            {isLoading
                ? PLACEHOLDERS.map((item) => (
                      <CoffeeMachineRowSkeleton key={item} />
                  ))
                : coffeeMachines?.map((cm) => (
                      <CoffeeMachineRow
                          onPress={onSelect}
                          {...cm}
                          key={cm.id}
                      />
                  ))}
        </View>
    )
})

const styles = StyleSheet.create({
    container: {
        gap: SPACING.ROW_GAP * SIZES.PX,
    },
})
