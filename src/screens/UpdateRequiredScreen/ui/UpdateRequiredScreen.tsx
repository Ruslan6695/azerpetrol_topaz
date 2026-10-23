import { memo } from 'react'
import { IAppUpdate } from '../../../shared'
import { UpdateRequiredWidget } from '../../../widgets/UpdateRequiredWidget'

type Props = { appUpdate: IAppUpdate }

export const UpdateRequiredScreen = memo(({ appUpdate }: Props) => {
    return <UpdateRequiredWidget appUpdate={appUpdate} />
})
