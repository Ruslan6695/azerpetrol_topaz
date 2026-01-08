import { CameraView, useCameraPermissions } from 'expo-camera'

import { useCallback, useEffect, useState } from 'react'
import { Linking, StyleSheet, View } from 'react-native'
import { COLORS, SIZES } from '../../../shared'
import { CameraScannerHasNotPermissions } from './CameraScannerHasNotPermissions'

type Props = {
    onScan: (scannedText: string) => void
}
export function CameraScanner({ onScan }: Props) {
    const [facing, setFacing] = useState<'back' | 'front'>('back')
    const [loadings, setLoadings] = useState({
        isCameraPermissionLoading: false,
    })
    const [canAskAgain, setCanAskAgain] = useState(true)
    const [hadPermissions, setHadPermissions] = useState(true)
    const [permission, requestPermission] = useCameraPermissions()
    const [isScanned, setIsScanned] = useState(false)

    const getPermission = useCallback(async () => {
        const { canAskAgain, expires, granted, status } =
            await requestPermission()
        setIsScanned(canAskAgain)
        setHadPermissions(granted)
    }, [])

    const handlePressOnGivePermissions = async () => {
        if (canAskAgain) {
            const { canAskAgain, expires, granted, status } =
                await requestPermission()
            setHadPermissions(granted)
            setCanAskAgain(canAskAgain)
        } else {
            Linking.openSettings()
        }
    }

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
        if (isScanned) {
            setTimeout(() => {
                setIsScanned(false)
            }, 2000)
        }
    }, [isScanned])

    useEffect(() => {
        getPermission()
    }, [])

    return (
        <View>
            {hadPermissions ? (
                <CameraView
                    onBarcodeScanned={(e) => {
                        //@ts-ignore
                        scann(e.data)
                    }}
                    style={{
                        width: SIZES.WIDTH(1.1),
                        height: SIZES.HEIGHT(0.4),
                        marginLeft: -SIZES.WIDTH(0.1),
                    }}
                >
                    {/*  <View
                        style={[
                            styled.box,
                            {
                                top: boundingBox.x,
                                left: boundingBox.y,
                                width: boundingBox.height,
                                height: boundingBox.width,
                            },
                        ]}
                    /> */}
                </CameraView>
            ) : (
                <CameraScannerHasNotPermissions
                    askPermission={handlePressOnGivePermissions}
                />
            )}
        </View>
    )
}
