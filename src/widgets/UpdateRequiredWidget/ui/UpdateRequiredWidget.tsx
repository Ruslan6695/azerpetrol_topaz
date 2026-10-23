import { memo } from 'react'
import { View } from 'react-native'
import { OpenAppUpdateLink } from '../../../features/OpenAppUpdateLink'
import { IAppUpdate, ThemeStore } from '../../../shared'
import { CenteredState } from '../../../shared/CenteredState'

type Props = { appUpdate: IAppUpdate }

// Тот же текст, что отдаёт сервер, когда свой в панели не задан.
const DEFAULT_MESSAGE =
    'Вышла новая версия приложения. Обновите его, чтобы продолжить'

// Версия ниже минимальной из панели: приложением пользоваться нельзя, только
// перейти по ссылке на новую версию. Корневой layout ставит его вместо всех
// экранов (как CheckNetworkWidget без сети).
export const UpdateRequiredWidget = memo(({ appUpdate }: Props) => {
    const COLORS = ThemeStore.useCOLORS()

    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                backgroundColor: COLORS.BACKGROUND.Primary,
            }}
        >
            <CenteredState
                variant="error"
                title="Обновите приложение"
                description={
                    appUpdate.message !== ''
                        ? appUpdate.message
                        : DEFAULT_MESSAGE
                }
            />
            {appUpdate.url !== '' && <OpenAppUpdateLink url={appUpdate.url} />}
        </View>
    )
})
