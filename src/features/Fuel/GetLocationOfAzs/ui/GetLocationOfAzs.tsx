import { LocationAccuracy } from 'expo-location'
import { memo, useCallback, useEffect, useState } from 'react'
import {
    IAzs,
    PermissionsStatuses,
    useGetLocationPermission,
} from '../../../../shared'
import { CustomButton } from '../../../../shared/CustomButton'
import { LocationIcon } from '../../../../shared/LocationIcon'
import { ToastBlock } from '../../../../shared/ToastBlock'
import { getLocationOfAzsApi } from '../api/getLocationOfAzsApi'
import * as Location from 'expo-location'

type Props = {
    onChangeAzs: (azs: IAzs) => void
}

export const GetLocationOfAzs = memo(({ onChangeAzs }: Props) => {
    const { locationPermission, fetchLocationOnPress } =
        useGetLocationPermission()
    const [fetchError, setFetchError] = useState<string | null>('')
    const [fetchAzsIsLoading, setFetchAzsIsLoading] = useState(false)

    const fetchAzs = useCallback(async () => {
        setFetchAzsIsLoading(true)
        setFetchError(null)
        try {
            const location = await Location.getCurrentPositionAsync({
                accuracy: LocationAccuracy.Highest,
            })

            const resp = await getLocationOfAzsApi.getLocation({
                lat: location.coords.latitude,
                long: location.coords.longitude,
            })

            onChangeAzs(resp.azs)
        } catch (error: any) {
            setFetchError(
                error?.response?.data ||
                    `Ошибка при определении Азс.\nПопробуйте выбрать вручную`
            )
        } finally {
            setFetchAzsIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchAzs()
    }, [])

    if (locationPermission?.status === PermissionsStatuses.ABORTED) {
        return (
            <>
                <ToastBlock
                    icon={<LocationIcon size={25} white />}
                    text="Для автоматического выбора АЗС рекомендуем включить геолокацию"
                    styled={{
                        marginsPaddings: { mb: 10 },
                        width: { value: '100%', type: 'absolute' },
                    }}
                    type="error"
                />
                <CustomButton
                    onPress={fetchLocationOnPress}
                    styled={{
                        type: 'secondary',
                        marginsPaddings: { mb: 30 },
                        height: { value: 56, type: 'px' },
                    }}
                >
                    Включить
                </CustomButton>
            </>
        )
    }

    if (fetchError) {
        return (
            <ToastBlock
                icon={<LocationIcon size={25} white />}
                text={fetchError}
                styled={{
                    marginsPaddings: { mb: 30 },
                    width: { value: '100%', type: 'absolute' },
                }}
                type="error"
            />
        )
    }

    if (fetchAzsIsLoading) {
        return (
            <ToastBlock
                icon={<LocationIcon size={25} white />}
                text={`Идет определение Азс...\nПожалуйста, подождите.`}
                styled={{
                    marginsPaddings: { mb: 30 },
                    width: { value: '100%', type: 'absolute' },
                }}
                type="info"
            />
        )
    }

    return (
        <ToastBlock
            text={`Геолокация включена. Азс будет определяться автоматически.`}
            styled={{
                marginsPaddings: { mb: 30 },
                width: { value: '100%', type: 'absolute' },
            }}
            type="success"
        />
    )
})
