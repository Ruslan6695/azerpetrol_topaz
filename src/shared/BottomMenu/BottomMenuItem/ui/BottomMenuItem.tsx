import { memo, useCallback, ReactNode } from 'react'
import { IBottomMenuItem } from '../config/interfaces/IBottomMenuItem'
import { CustomTouchableOpacity } from '../../../CustomTouchableOpacity'
import { Link, useNavigation, useRouter } from 'expo-router'
import { ESCREENS } from '../../../common/config/enums/EScreens'
import { StyleSheet, View } from 'react-native'
import { SIZES } from '../../../common/config/constants/sizes'
import { COLORS } from '../../../common/config/constants/COLORS'
import { CustomText } from '../../../CustomText'

interface IProps extends IBottomMenuItem {
    isActive: boolean
}
export const BottomMenuItem = memo(
    ({ icon: Icon, isActive, link, title, activeIcon: ActiveIcon }: IProps) => {
        const styles = StyleSheet.create({
            container: {
                alignItems: 'center',
                padding: 10 * SIZES.PX,
                borderRadius: 8,
                justifyContent: 'center',
            },
            homeIconWrapper: {
                backgroundColor: 'white',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 10000,
            },
        })
        return (
            <Link href={link}>
                {title ? (
                    <View style={styles.container}>
                        {isActive ? (
                            <ActiveIcon
                                width={28 * SIZES.PX}
                                height={28 * SIZES.PX}
                            />
                        ) : (
                            <>
                                <Icon
                                    width={28 * SIZES.PX}
                                    height={28 * SIZES.PX}
                                />
                            </>
                        )}
                        <CustomText
                            color={isActive ? COLORS.GREEN : undefined}
                            marginsPaddings={{ mb: 5 }}
                            fz={8}
                        >
                            {title}
                        </CustomText>
                    </View>
                ) : (
                    <View style={styles.homeIconWrapper}>
                        <View
                            style={[
                                styles.container,
                                {
                                    backgroundColor: isActive
                                        ? COLORS.GREEN
                                        : COLORS.GRAY,
                                    margin: 10,
                                    borderRadius: 1000,
                                },
                            ]}
                        >
                            <Icon
                                width={28 * SIZES.PX}
                                height={28 * SIZES.PX}
                            />
                        </View>
                    </View>
                )}
            </Link>
        )
    }
)
