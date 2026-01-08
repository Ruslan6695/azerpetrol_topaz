import { memo } from 'react'
import { IInfoBlock, InfoBlock } from '../../../entities/InfoBlock'
import { MPLayout } from '../../../shared/MpLayout'

type Props = {
    infoBlocks: IInfoBlock[]
    mt?: number
}

export const MapInfoBlocks = ({ infoBlocks, mt }: Props) => {
    return (
        <MPLayout mt={mt || 32}>
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
