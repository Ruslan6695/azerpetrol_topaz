/** Ответ легаси-эндпоинта get_azs_geo/ — свой тип, НЕ IAzs: у старого
 * бэкенда id станции числовой, у Топаз — строка. Смешивать нельзя. */
export interface IAzsGeo {
    id: number
    name: string
}

export interface IGetLocationOfAzsData {
    azs: IAzsGeo
}
