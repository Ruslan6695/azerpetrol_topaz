export interface ICallcheckLoginInitResponse {
    login_session?: string
    check_id: string
    call_phone: string
    call_phone_pretty: string
    call_phone_html?: string
}

export interface ICallcheckRegistrationInitResponse {
    reg_session?: string
    check_id: string
    call_phone: string
    call_phone_pretty: string
    call_phone_html?: string
}
