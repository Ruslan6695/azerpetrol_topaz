import { useCallback, useState } from 'react'

export function useInput(props?: {
    onChangeValue?: (value: string) => void
    defaultValue?: string
}) {
    const [inputValue, setInputValue] = useState(props?.defaultValue || '')
    const handleChangeInputValue = useCallback(
        (value: string) => {
            props?.onChangeValue?.(value)
            setInputValue(value)
        },
        [props?.onChangeValue]
    )
    return { inputValue, setInputValue, handleChangeInputValue }
}
