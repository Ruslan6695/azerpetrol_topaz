import { memo } from 'react'
import { IInfoBlock, InfoBlock } from '../../../entities/InfoBlock'
import { MPLayout } from '../../../shared/MpLayout'

type Props = {
    infoBlocks: IInfoBlock[]
}

export const MapInfoBlocks = ({ infoBlocks }: Props) => {
    return (
        <MPLayout mt={15}>
            {infoBlocks.map((block) => (
                <InfoBlock
                    marginsPaddings={{ mt: 7, mb: 7 }}
                    key={block.title}
                    {...block}
                />
            ))}
        </MPLayout>
    )
}
