import { memo, useCallback, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { ErrorWhileFetchingForm } from "../../../../entities/ErrorWhileFetchingForm";
import { TrkTypeBlock } from "../../../../entities/Fuel/TrkTypeBlock";
import {
  IAzs,
  IColumn,
  ITrkType,
  SIZES,
  UserStore,
  useFetchData,
} from "../../../../shared";
import { CustomButton } from "../../../../shared/CustomButton";
import { selectTrkTypeApi } from "../api/selectTrkTypeApi";
import { SelectTrkTypeFormSkeleton } from "./SelectTrkTypeFormSkeleton";
import { FuelStore } from "../../../../shared/common/model/fuelStore";

type Props = {
  column: IColumn;
  azs: IAzs;
  onSelectTrkType: (trkType: ITrkType) => void;
  selectedTrkType: ITrkType | null;
  onGoBack: () => void;
};

export const SelectTrkTypeForm = memo(
  ({ azs, column, onSelectTrkType, selectedTrkType, onGoBack }: Props) => {
    const setBalance = UserStore.useSetBalance();
    const changeFuelOnDebt = FuelStore.useChangeFuelOnDebt();

    const { data, errorText, fetchData, isDataLoading } = useFetchData({
      apiCallback: selectTrkTypeApi.getTrkTypes,
      errorText: "Не удалось получить типы топлива",
    });

    const handleReloadData = useCallback(() => {
      fetchData({
        args: { azsId: azs.id, columnId: column.id },
        hideToastOnError: true,
        afterDataCallback(data) {
          setBalance({ balance: data.balance });
          changeFuelOnDebt(data.fuel_on_debt);
        },
      });
    }, [azs, column]);

    useEffect(() => {
      handleReloadData();
    }, []);

    return (
      <>
        <View style={styles.selectTrkTypeBlock}>
          {errorText ? (
            <ErrorWhileFetchingForm
              buttonProps={{
                width: { type: "absolute", value: "100%" },
              }}
              onReload={handleReloadData}
              margins={{ mt: -30 }}
              message={errorText}
            />
          ) : isDataLoading ? (
            <SelectTrkTypeFormSkeleton />
          ) : (
            data?.trc_types?.map((trk) => (
              <TrkTypeBlock
                isSelected={trk.id === selectedTrkType?.id}
                onPress={onSelectTrkType}
                key={trk.id}
                {...trk}
              />
            ))
          )}
        </View>

        <CustomButton
          onPress={onGoBack}
          styled={{
            type: "secondary",
            marginsPaddings: { mt: 16 },
          }}
        >
          ВЕРНУТЬСЯ НАЗАД
        </CustomButton>
      </>
    );
  }
);

const styles = StyleSheet.create({
  selectTrkTypeBlock: {
    gap: 8 * SIZES.PX,
  },
});
