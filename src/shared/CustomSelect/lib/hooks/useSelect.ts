import { useCallback, useState } from 'react'
import { ISelectOption } from '../../config/interfaces/ISelectOption'

export function useSelect(props?: {
    options?: ISelectOption[]
    onChangeOption?: (option: ISelectOption | null) => void
    defaultValue?: ISelectOption
}) {
    const [optionList, setOptionList] = useState<ISelectOption[] | null>(
        props?.options || null
    )
    const [selectedOption, setSelectedOption] = useState<ISelectOption | null>(
      props?.defaultValue ||  null
    )

    const handleChangeSelectOption = useCallback(
        (option: ISelectOption | null) => {
            setSelectedOption(option)
            props?.onChangeOption?.(option)
        },
        []
    )
    return {
        selectedOption,
        setSelectedOption,
        handleChangeSelectOption,
        options: optionList,
        setOptions: setOptionList,
    }
}
