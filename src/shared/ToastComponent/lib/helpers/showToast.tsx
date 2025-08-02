import Toast from 'react-native-toast-message'

export async function showToast({
    text,
    type,
}: {
    type: 'success' | 'error' | 'warning'
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
