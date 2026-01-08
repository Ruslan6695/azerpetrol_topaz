import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { Typography } from '../../Typography'
import { ICustomPieChartData } from '../config/interfaces/ICustomPieChartData'

type Props = {
    text: string
}

export const CustomPieChartLegendItem = memo(
    ({ text, color }: ICustomPieChartData) => {
        const styles = StyleSheet.create({
            container: {
                flexDirection: 'row',
                alignItems: 'center',
            },
            colorBlock: {
                backgroundColor: color,
                borderRadius: 500,
                width: 15,
                height: 15,
            },
        })
        return (
            <View style={styles.container}>
                <View style={styles.colorBlock}></View>
                <Typography type="caption" marginsPaddings={{ ml: 10 }}>
                    {text}
                </Typography>
            </View>
        )
    }
)
