import { useCallback, useState } from 'react'

export function useModal(defauiltValue?: boolean) {
  const [isShowModal, setIsShowModal] = useState(defauiltValue || false)
  const handleCloseModal = useCallback(() => {
    setIsShowModal(false)
  }, [])
  const handleOpenModal = useCallback(() => {
    setIsShowModal(true)
  }, [])

  return { isShowModal, handleCloseModal, handleOpenModal }
}
