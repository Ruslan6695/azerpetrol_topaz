import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { ProfileImg } from '../../../../entities/Profile/ProfileImg'
import { Typography } from '../../../../shared/Typography'
import { ProfileWidgetSkeleton } from './ProfileWidgetSkeleton'
import { ChangeColorTheme } from '../../../../features/ChangeColorTheme'

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
                    <Typography
                        marginsPaddings={{ mb: 8 }}
                        type="displayMedium"
                    >
                        {name}
                    </Typography>
                    <Typography marginsPaddings={{ mb: 16 }}>
                        {phone}
                    </Typography>
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
