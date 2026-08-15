import { memo } from 'react'
import { CameraScanner } from '../../../../shared/CameraScanner'

type Props = {
    onScan: (text: string) => void
}

// Кадр сканера. Кнопки «Вернуться назад» здесь нет: возврат даёт
// StepHeader над кадром, а распознавание запускает колбэк камеры.
export const ScanCoffeeMachine = memo(({ onScan }: Props) => {
    return <CameraScanner onScan={onScan} />
})
