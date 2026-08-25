import { IAzs, IColumn, IFuelOption } from "./IFuel";

export interface IFuelStore {
  state: {
    azs: IAzs | null;
    column: IColumn | null;
    fuelOption: IFuelOption | null;
    liters: number | null;
    rubles: number | null;
    fuelOnDebt: boolean;
    /** Заказ на сервере, создаётся в fuelling/start/, нужен для поллинга статуса */
    orderId: string | null;
  };
  tankVolume: number;
  changeTankVolume: (volume: number) => void;
  getTankVolume: () => Promise<void>;
  clearState: () => void;
  changeAzs: (azs: IAzs) => void;
  changeColumn: (column: IColumn) => void;
  changeFuelOption: (fuelOption: IFuelOption) => void;
  changeFuelOnDebt: (fuelOnDebt: boolean) => void;
  changeOrderId: (orderId: string) => void;
  changeLitersAndRubles: ({
    liters,
    rubles,
  }: {
    rubles: number;
    liters: number;
  }) => void;
}
