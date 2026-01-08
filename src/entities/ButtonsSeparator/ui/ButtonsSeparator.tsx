import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { COLORS, SIZES } from '../../../shared'
import { Typography } from '../../../shared/Typography'

type Props = {}

export const ButtonsSeparator = memo((props: Props) => {
    return (
        <View style={styles.separatorContainer}>
            <View style={styles.separator}></View>
            <Typography
                marginsPaddings={{ ml: 10, mr: 10 }}
                color="secondary"
                type="caption"
            >
                или
            </Typography>
            <View style={styles.separator}></View>
        </View>
    )
})

const styles = StyleSheet.create({
    separatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginVertical: 16 * SIZES.PX,
    },
    separator: {
        backgroundColor: COLORS.BACKGROUND.Secondary,
        height: 1 * SIZES.PX,
        flex: 1,
    },
})
