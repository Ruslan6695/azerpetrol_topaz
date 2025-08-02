import React from 'react'
import BottomSheet from '../../../../shared/BottomSheet/ui/BottomSheet'
import { StyleSheet, View } from 'react-native'
import {
    CoffeeMachineItem,
    ICoffeeMachineItem,
} from '../../../../entities/Coffee/CoffeeMachineItem'
import { CoffeeMachinesStore } from '../model/coffeeMachinesStore'
import { SIZES } from '../../../../shared'
import { CustomText } from '../../../../shared/CustomText'
import { CustomButton } from '../../../../shared/CustomButton'

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
                        type: 'OUTLINED',
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
