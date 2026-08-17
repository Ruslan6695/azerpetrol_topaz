import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { SIZES } from '../../../../shared'
import { Glass } from '../../../../shared/GlassCard'
import { Icon } from '../../../../shared/Icons'
import { Typography } from '../../../../shared/Typography'
import { ProfileWidgetSkeleton } from './ProfileWidgetSkeleton'
import { ContentIn } from '../../../../shared/ContentIn'

type Props = {
    name: string | undefined
    phone: string | undefined
    isDataLoading: boolean
}

const AVATAR_SIZE = 86

// Шапка профиля из макета: стеклянный круг 86 с иконкой person, имя, телефон.
// Аватара как картинки в API нет — в макете тоже везде иконка.
export const ProfileWidget = memo(({ name, phone, isDataLoading }: Props) => {
    const styles = StyleSheet.create({
        container: {
            alignItems: 'center',
            gap: 6 * SIZES.PX,
            paddingTop: 6 * SIZES.PX,
        },
        avatar: {
            width: AVATAR_SIZE * SIZES.PX,
            height: AVATAR_SIZE * SIZES.PX,
            alignItems: 'center',
            justifyContent: 'center',
        },
    })

    return (
        <ContentIn style={styles.container}>
            <Glass level="secondary" radius={(AVATAR_SIZE / 2) * SIZES.PX}>
                <View style={styles.avatar}>
                    <Icon name="person" size={40} />
                </View>
            </Glass>

            {isDataLoading ? (
                <ProfileWidgetSkeleton />
            ) : (
                <>
                    <Typography type="h5">{name}</Typography>
                    <Typography type="body14" color="secondary">
                        {phone}
                    </Typography>
                </>
            )}
        </ContentIn>
    )
})
