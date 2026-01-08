import { Link } from 'expo-router'
import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { COLORS } from '../../../common/config/constants/COLORS'
import { SIZES } from '../../../common/config/constants/sizes'
import { Typography } from '../../../Typography'
import { IBottomMenuItem } from '../config/interfaces/IBottomMenuItem'

interface IProps extends IBottomMenuItem {
    isActive: boolean
    isMain: boolean
}
export const BottomMenuItem = memo(
    ({ icon: Icon, isActive, link, title, activeIcon: ActiveIcon }: IProps) => {
        const styles = StyleSheet.create({
            container: {
                alignItems: 'center',
                padding: 5 * SIZES.PX,
                justifyContent: 'center',
            },
            homeEllipse: {
                backgroundColor: COLORS.BRAND.Primary,
                width: 8 * SIZES.PX,
                height: 8 * SIZES.PX,
                borderRadius: 999,
                marginBottom: -10 * SIZES.PX,
                marginTop: 2 * SIZES.PX,
            },
        })
        return (
            <Link href={link}>
                <>
                    <View style={styles.container}>
                        {isActive ? (
                            <ActiveIcon
                                width={24 * SIZES.PX}
                                height={24 * SIZES.PX}
                            />
                        ) : (
                            <>
                                <Icon
                                    width={24 * SIZES.PX}
                                    height={24 * SIZES.PX}
                                />
                            </>
                        )}
                        <Typography
                            color={isActive ? 'primary' : 'secondary'}
                            marginsPaddings={{ mt: 4 }}
                            type={'caption'}
                        >
                            {title}
                        </Typography>
                    </View>
                </>
            </Link>
        )
    }
)
