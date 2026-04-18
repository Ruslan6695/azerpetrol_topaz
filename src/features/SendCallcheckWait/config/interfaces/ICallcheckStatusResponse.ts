import { IUser } from '../../../../shared'

export interface ICallcheckWaitingResponse {
    check_status: number
    waiting: true
}

export type TCallcheckStatusResponse = ICallcheckWaitingResponse | IUser
