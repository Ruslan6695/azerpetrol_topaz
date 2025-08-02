import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { CustomText } from '../../../../shared/CustomText'
import { ProfileImg } from '../../../../entities/Profile/ProfileImg'
import { ProfileWidgetSkeleton } from './ProfileWidgetSkeleton'

type Props = {
    name: string | undefined
    phone: string | undefined
    isDataLoading: boolean
}

export const ProfileWidget = memo(({ name, phone, isDataLoading }: Props) => {
    return (
        <View style={styles.container}>
            <ProfileImg />
            {isDataLoading ? (
                <ProfileWidgetSkeleton />
            ) : (
                <>
                    <CustomText marginsPaddings={{ mt: 10 }} fz={22} fw="600">
                        {name}
                    </CustomText>
                    <CustomText marginsPaddings={{ mb: 20 }}>
                        {phone}
                    </CustomText>
                </>
            )}
        </View>
    )
})

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
})
