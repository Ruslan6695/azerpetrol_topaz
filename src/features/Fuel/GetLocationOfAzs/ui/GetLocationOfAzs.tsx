import { LocationAccuracy } from 'expo-location'
import { memo, useCallback, useEffect, useState } from 'react'
import {
    IAzs,
    PermissionsStatuses,
    SPACING,
    ThemeStore,
    useGetLocationPermission,
} from '../../../../shared'
import { Icon } from '../../../../shared/Icons'
import { MPLayout } from '../../../../shared/MpLayout'
import { PillButton } from '../../../../shared/PillButton'
import { ToastBlock } from '../../../../shared/ToastBlock'
import { getLocationOfAzsApi } from '../api/getLocationOfAzsApi'
import * as Location from 'expo-location'

type Props = {
    onChangeAzs: (azs: IAzs) => void
}

export const GetLocationOfAzs = memo(({ onChangeAzs }: Props) => {
    const COLORS = ThemeStore.useCOLORS()
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
                    icon={
                        <Icon
                            name="location"
                            size={16}
                            color={COLORS.STATE.Destructive}
                        />
                    }
                    text="Для автоматического выбора АЗС рекомендуем включить геолокацию"
                    styled={{
                        marginsPaddings: { mb: 10 },
                        width: { value: '100%', type: 'absolute' },
                    }}
                    type="error"
                />
                <MPLayout mb={SPACING.SECTION}>
                    <PillButton
                        title="Включить"
                        variant="elevated"
                        onPress={fetchLocationOnPress}
                    />
                </MPLayout>
            </>
        )
    }

    if (fetchError) {
        return (
            <ToastBlock
                icon={
                    <Icon
                        name="location"
                        size={16}
                        color={COLORS.STATE.Destructive}
                    />
                }
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
                icon={
                    <Icon
                        name="location"
                        size={16}
                        color={COLORS.ACCENT.Primary}
                    />
                }
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
