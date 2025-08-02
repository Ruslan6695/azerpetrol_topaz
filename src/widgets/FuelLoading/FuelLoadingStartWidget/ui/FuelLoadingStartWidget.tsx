import { memo, useCallback } from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { COLORS, FuelStore, SIZES, useSendFetch } from '../../../../shared'
import { CustomText } from '../../../../shared/CustomText'
import { MPLayout } from '../../../../shared/MpLayout'
import { CustomButton } from '../../../../shared/CustomButton'
import FuelSvg from '../assets/fuel.svg'
import { fuelLoadingStartApi } from '../api/fuelLoadingStartApi'
import { Loader } from '../../../../shared/Loader'
type Props = {
    setRoad: React.Dispatch<React.SetStateAction<'start' | 'fuelling' | 'end'>>
}

export const FuelLoadingStartWidget = memo(({ setRoad }: Props) => {
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

    return (
        <View style={styles.wrapper}>
            <FuelSvg
                width={200 * SIZES.PX}
                height={SIZES.PX * 300}
                style={styles.fuelImg}
            />
            <CustomText textAlign="center" fz={22} white>
                НАЛИВ ТОПЛИВА
            </CustomText>
            <View style={styles.content}>
                <CustomText
                    textAlign="center"
                    marginsPaddings={{ mb: 20 }}
                    fw="500"
                    white
                    fz={50}
                >
                    {state.trkType?.name}
                </CustomText>
                {errorText ? (
                    <CustomText white textAlign="center" fz={22}>
                        {errorText}
                    </CustomText>
                ) : (
                    <>
                        <CustomText textAlign="center" fz={30} white>
                            {state.azs?.name}
                        </CustomText>
                        <View style={styles.row}>
                            <CustomText textAlign="center" fz={30} white>
                                {state.liters} л /
                            </CustomText>
                            <CustomText textAlign="center" fz={30} white>
                                {state.rubles} ₽
                            </CustomText>
                        </View>
                        <CustomText textAlign="center" fz={30} white>
                            Колонка {state.column?.name}
                        </CustomText>
                    </>
                )}
            </View>
            {isSendFetchLoading ? (
                <Loader color={COLORS.WHITE} />
            ) : (
                <CustomButton
                    onPress={handleStartFuelling}
                    styled={{
                        bg: COLORS.BROWN,
                        height: { value: 60, type: 'px' },
                    }}
                >
                    НАЧАТЬ НАЛИВ ТОПЛИВА
                </CustomButton>
            )}
        </View>
    )
})

const styles = StyleSheet.create({
    wrapper: {
        width: SIZES.WIDTH(1),
        height: SIZES.HEIGHT(1),
        backgroundColor: COLORS.ORANGE,
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
    fuelImg: {
        position: 'absolute',
        bottom: '10%',
        left: -10 * SIZES.PX,
    },
})
