import { memo } from 'react'
import { CustomModal } from '../../../shared/CustomModal'
import { CustomText } from '../../../shared/CustomText'
import { CustomButton } from '../../../shared/CustomButton'
import { SIZES } from '../../../shared'

type Props = {
    isModalOpened: boolean
    handleClose: () => void
    title: string
    description: string
    onSubmit: () => void
}

export const GivePermissionModal = memo(
    ({ handleClose, isModalOpened, title, description, onSubmit }: Props) => {
        return (
            <CustomModal
                bgDark
                isModalOpened={isModalOpened}
                handleClose={handleClose}
            >
                <CustomText
                    marginsPaddings={{ mt: -20, mb: 10 }}
                    fw="600"
                    fz={18}
                >
                    {title}
                </CustomText>
                <CustomText>{description}</CustomText>
                <CustomButton
                    onPress={handleClose}
                    styled={{
                        type: 'OUTLINED',
                        height: { value: 50, type: 'px' },
                        marginsPaddings: { mt: 20, mb: 10 },
                    }}
                >
                    Отклонить
                </CustomButton>
                <CustomButton
                    onPress={onSubmit}
                    styled={{
                        type: 'SUCCES',
                        height: { value: 50, type: 'px' },
                    }}
                >
                    Подтвердить
                </CustomButton>
            </CustomModal>
        )
    }
)
