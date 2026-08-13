import { IAzs, IColumn, ITrkType } from "./IFuel";

export interface IFuelStore {
  state: {
    azs: IAzs | null;
    column: IColumn | null;
    trkType: ITrkType | null;
    liters: number | null;
    rubles: number | null;
    fuelOnDebt: boolean;
  };
  /**
   * Объём бака пользователя из Настроек. Лежит рядом со state, а не внутри:
   * clearState() чистит параметры налива, а настройка переживает заправку.
   */
  tankVolume: number;
  changeTankVolume: (volume: number) => void;
  getTankVolume: () => Promise<void>;
  clearState: () => void;
  changeAzs: (azs: IAzs) => void;
  changeColumn: (column: IColumn) => void;
  changeTrkType: (trkType: ITrkType) => void;
  changeFuelOnDebt: (fuelOnDebt: boolean) => void;
  changeLitersAndRubles: ({
    liters,
    rubles,
  }: {
    rubles: number;
    liters: number;
  }) => void;
}
