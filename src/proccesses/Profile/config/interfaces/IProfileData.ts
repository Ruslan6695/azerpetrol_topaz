import { IProfileJoinAccountItem } from '../../../../entities/Profile/ProfileJoinAccountItem'

export interface IProfileData {
    name: string
    id: number
    phone: string
    balance_creator_id: number
    join_accounts: IProfileJoinAccountItem[]
    balance: number
}
