import { useCallback, useState } from 'react'

export function useRangePicker() {
    const [dates, setDates] = useState<{
        startDate: undefined | string
        endDate: undefined | string
    }>({
        startDate: undefined,
        endDate: undefined,
    })
    const handleChangeDates = useCallback(
        (dates: { startDate: string; endDate: string }) => {
            setDates(dates)
        },
        []
    )

    const handleResetDate = useCallback(() => {
        setDates({ endDate: undefined, startDate: undefined })
    }, [])
    return { dates, handleChangeDates, setDates, handleResetDate }
}
