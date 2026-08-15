import { CameraView, useCameraPermissions } from 'expo-camera'

import { memo, useCallback, useEffect, useState } from 'react'
import { Linking, StyleSheet, View } from 'react-native'
import { RADII, SIZES, ThemeStore } from '../../../shared'
import { CameraScannerHasNotPermissions } from './CameraScannerHasNotPermissions'
import { ScannerOverlay } from './ScannerOverlay'

type Props = {
    onScan: (scannedText: string) => void
    /** Подпись под рамкой прицела, если стандартная не подходит */
    hint?: string
}

// Пауза перед тем, как кадр снова начнёт принимать коды, мс.
const RESCAN_DELAY = 2000

export const CameraScanner = memo(({ onScan, hint }: Props) => {
    const [canAskAgain, setCanAskAgain] = useState(true)
    const [hadPermissions, setHadPermissions] = useState(true)
    const [, requestPermission] = useCameraPermissions()
    const [isScanned, setIsScanned] = useState(false)
    const COLORS = ThemeStore.useCOLORS()

    // Стеклянный кадр макета (dc.html:482): скруглённый вьюпорт с тёмной
    // подложкой. Подложка видна только до того, как камера отдаст первый кадр.
    const styles = StyleSheet.create({
        viewport: {
            height: SIZES.HEIGHT(0.45),
            minHeight: 340 * SIZES.PX,
            borderRadius: RADII.HERO_SM * SIZES.PX,
            overflow: 'hidden',
            backgroundColor: COLORS.BACKGROUND.Invert,
        },
    })

    const getPermission = useCallback(async () => {
        const { canAskAgain, granted } = await requestPermission()
        setIsScanned(canAskAgain)
        setHadPermissions(granted)
    }, [])

    const handlePressOnGivePermissions = useCallback(async () => {
        if (canAskAgain) {
            const permission = await requestPermission()
            setHadPermissions(permission.granted)
            setCanAskAgain(permission.canAskAgain)
        } else {
            Linking.openSettings()
        }
    }, [canAskAgain])

    const scann = useCallback(
        (data: string) => {
            if (!isScanned) {
                onScan(data)
                setIsScanned(true)
            }
        },
        [onScan, isScanned]
    )

    useEffect(() => {
        if (!isScanned) {
            return
        }
        // Пауза между распознаваниями, чтобы один QR не улетел колбэком
        // несколько раз подряд. Cleanup обязателен: без него таймер добивает
        // setState уже после размонтирования кадра.
        const timer = setTimeout(() => {
            setIsScanned(false)
        }, RESCAN_DELAY)

        return () => clearTimeout(timer)
    }, [isScanned])

    useEffect(() => {
        getPermission()
    }, [])

    if (!hadPermissions) {
        return (
            <CameraScannerHasNotPermissions
                askPermission={handlePressOnGivePermissions}
            />
        )
    }

    return (
        <View style={styles.viewport}>
            <CameraView
                onBarcodeScanned={(e) => {
                    //@ts-ignore
                    scann(e.data)
                }}
                style={StyleSheet.absoluteFill}
            />
            <ScannerOverlay hint={hint} />
        </View>
    )
})
