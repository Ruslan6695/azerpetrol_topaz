import { memo } from 'react'
import Toast from 'react-native-toast-message'
import { ToastBody } from './ToastBody'

// ВАЖНО: записи config библиотека вызывает как обычную функцию
// (ToastUI.js: `ToastComponent({...})`), а не рендерит как JSX. Хуки прямо
// внутри этих функций сломали бы порядок хуков ToastUI, поэтому тело тоста
// вынесено в настоящий компонент ToastBody — он и читает тему.
const toastConfig = {
    success: ({ text1 }: { text1?: string }) => (
        <ToastBody type="success" text={text1 ?? ''} />
    ),
    error: ({ text1 }: { text1?: string }) => (
        <ToastBody type="error" text={text1 ?? ''} />
    ),
    warning: ({ text1 }: { text1?: string }) => (
        <ToastBody type="warning" text={text1 ?? ''} />
    ),
}

type Props = {}

export const ToastComponent = memo((props: Props) => {
    // Позиционирует AnimatedContainer библиотеки; собственный
    // position:'absolute' в теле тоста с ним конфликтует.
    return <Toast config={toastConfig} topOffset={60} />
})
