import React from 'react'
import { StyleSheet, View } from 'react-native'
import { CoffeeMachineItem } from '../../../../entities/Coffee/CoffeeMachineItem'
import { SIZES } from '../../../../shared'
import { CustomButton } from '../../../../shared/CustomButton'
import { CoffeeMachinesStore } from '../model/coffeeMachinesStore'

type Props = {
    onGoBack: () => void
    onSelect: (id: number) => void
}

export const SelectCoffeeMachine = ({ onGoBack, onSelect }: Props) => {
    const coffeeMachines = CoffeeMachinesStore.useCoffeeMachines()
    return (
        <>
            <View style={styles.container}>
                {coffeeMachines?.map((cm) => (
                    <CoffeeMachineItem onPress={onSelect} {...cm} key={cm.id} />
                ))}
                <CustomButton
                    onPress={onGoBack}
                    styled={{
                        type: 'secondary',
                        width: { type: 'absolute', value: '100%' },
                    }}
                >
                    Вернуться назад
                </CustomButton>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 15 * SIZES.PX,
    },
})
