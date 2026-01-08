import { memo } from 'react'
import { Linking } from 'react-native'
import { USE_TERMS_LINK } from '../../../shared'
import { CustomTouchableOpacity } from '../../../shared/CustomTouchableOpacity'
import { Typography } from '../../../shared/Typography'

type Props = {}

export const OpenUseTerms = memo((props: Props) => {
    return (
        <>
            <Typography type="caption" color="secondary">
                Продолжая, я принимаю условия{' '}
            </Typography>
            <CustomTouchableOpacity
                onPress={() => {
                    Linking.openURL(USE_TERMS_LINK)
                }}
                activeOpacity={0.6}
            >
                <Typography type="caption">
                    Пользовательского соглашения
                </Typography>
            </CustomTouchableOpacity>
        </>
    )
})
