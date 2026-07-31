import Toast from 'react-native-toast-message'
import { TToastTypes } from '../../config/types/TToastTypes'

export async function showToast({
    text,
    type,
}: {
    type: TToastTypes
    text: string
}) {
    Toast.show({
        type: type,
        text1: text,
        visibilityTime: 4000,
    })
}

export function showError({ text, error }: { text: string; error?: any }) {
    showToast({
        text: error?.response?.data
            ? error.response?.data
            : text
              ? text
              : 'Произошла непредвиденная ошибка',
        type: 'error',
    })
}
