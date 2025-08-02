import { memo } from 'react'
import { CustomText } from '../../../shared/CustomText'
import { COLORS, USE_TERMS_LINK } from '../../../shared'
import { CustomTouchableOpacity } from '../../../shared/CustomTouchableOpacity'
import { Linking } from 'react-native'

type Props = {}

export const OpenUseTerms = memo((props: Props) => {
    return (
        <>
            <CustomText fw="300" textAlign="center">
                Продолжая, я принимаю условия{' '}
                <CustomTouchableOpacity
                    onPress={() => {
                        Linking.openURL(USE_TERMS_LINK)
                    }}
                    activeOpacity={0.6}
                >
                    <CustomText
                        style={{
                            textDecorationLine: 'underline',
                            textDecorationColor: COLORS.TEXT,
                        }}
                        fw="700"
                        textAlign="center"
                    >
                        Пользовательского соглашения
                    </CustomText>
                </CustomTouchableOpacity>
            </CustomText>
        </>
    )
})
