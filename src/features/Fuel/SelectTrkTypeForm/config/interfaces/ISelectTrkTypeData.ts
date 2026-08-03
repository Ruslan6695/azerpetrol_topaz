import { ITrkType } from "../../../../../shared";

export interface ISelectTrkTypeData {
  trc_types: ITrkType[];
  balance: number;
  bonus_balance: number;
  fuel_on_debt: boolean;
}
