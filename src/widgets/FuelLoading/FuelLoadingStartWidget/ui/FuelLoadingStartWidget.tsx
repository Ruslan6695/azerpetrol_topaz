import { memo, useCallback, useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import {
    COLORS,
    FuelStore,
    SIZES,
    ThemeStore,
    useSendFetch,
} from '../../../../shared'
import { CustomButton } from '../../../../shared/CustomButton'
import { Loader } from '../../../../shared/Loader'
import { Typography } from '../../../../shared/Typography'
import { WarningImage } from '../../../../shared/WarningImage'
import { fuelLoadingStartApi } from '../api/fuelLoadingStartApi'
import { BackgroundImage } from '../../../../shared/BackgroundImage'
import { BonusIcon } from '../../../../shared/BonusIcon'
type Props = {
    setRoad: React.Dispatch<React.SetStateAction<'start' | 'fuelling' | 'end'>>
}

export const FuelLoadingStartWidget = memo(({ setRoad }: Props) => {
    const COLORS = ThemeStore.useCOLORS()
    const state = FuelStore.useState()
    const { sendFetch, errorText, isSendFetchLoading } = useSendFetch({
        apiCallback: fuelLoadingStartApi.startFuelling,
        errorText: 'Не удалось начать налив',
    })

    const handleStartFuelling = useCallback(async () => {
        await sendFetch({
            args: {
                //@ts-ignore
                azsId: state.azs?.id,
                //@ts-ignore
                columnDevice: state.column?.device,
                //@ts-ignore
                sumRub: state.rubles,
                //@ts-ignore
                trkTypeArt: state.trkType?.art,
                //@ts-ignore
                trkTypeName: state.trkType?.name,
                //@ts-ignore
                trkTypeNozzleId: state.trkType?.nozzle_id,
                //@ts-ignore
                trkTypePetrolId: state.trkType?.petrol_id,
                //@ts-ignore
                trkTypePrice: state.trkType?.price,
            },
            hideToastOnError: true,
            onErrorCallback(error) {},
            afterDataCallback(data) {
                setRoad('fuelling')
            },
        })
    }, [state])

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                width: SIZES.WIDTH(1),
                height: '100%',
                backgroundColor: COLORS.BACKGROUND.Primary,
                paddingVertical: SIZES.PX * 60,
                paddingHorizontal: SIZES.PX * 20,
                alignItems: 'center',
            },
            content: {
                alignItems: 'center',
                flex: 1,
                justifyContent: 'center',
            },
            row: {
                flexDirection: 'row',
                alignItems: 'center',
            },
        })
    }, [COLORS])

    return (
        <View style={styles.wrapper}>
            <BackgroundImage bottom={103} right={10} />
            <View style={styles.content}>
                <WarningImage />
                <Typography
                    type="displayLarge"
                    textAlign="center"
                    marginsPaddings={{ mb: 8, mt: 34 }}
                >
                    {state.trkType?.name}
                </Typography>

                <>
                    <View style={styles.row}>
                        <Typography>
                            {state.liters} л/{state.rubles}
                        </Typography>
                        <BonusIcon ml={0} mt={2} />
                    </View>

                    <Typography
                        color="secondary"
                        type="bodyMedium"
                        textAlign="center"
                    >
                        {errorText ||
                            'Для начала налива топлива необходимо поставить пистолет в автомобиль'}
                    </Typography>
                </>
            </View>
            {isSendFetchLoading ? (
                <Loader />
            ) : (
                <CustomButton onPress={handleStartFuelling}>
                    Начать налив
                </CustomButton>
            )}
        </View>
    )
})
