import { useRouter } from "expo-router";
import { memo, useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { FuelLitersSelector } from "../../../../entities/Fuel/FuelLitersSelector";
import {
  ESCREENS,
  FuelStore,
  IAzs,
  IColumn,
  ITrkType,
  SIZES,
  UserStore,
} from "../../../../shared";
import { CustomButton } from "../../../../shared/CustomButton";
import { useInput } from "../../../../shared/CustomInput";
import { showError } from "../../../../shared/ToastComponent";
import { Typography } from "../../../../shared/Typography";
import { SelectLitersForm } from "./SelectLitersForm";

type Props = {
  column: IColumn;
  azs: IAzs;
  trkType: ITrkType;
  onSubmit: (props: { liters: number; rubles: number }) => void;
  onGoBack: () => void;
};

export const SelectLiters = memo(
  ({ azs, column, trkType, onSubmit, onGoBack }: Props) => {
    const fuelOnDebt = FuelStore.useState().fuelOnDebt;

    const balance = UserStore.useBalance();
    const router = useRouter();
    const {
      handleChangeInputValue: handleChangeLitersValue,
      inputValue: litersValue,
      setInputValue: setLitersValue,
    } = useInput({
      onChangeValue(value) {
        setRublesValue((+value * trkType.price).toFixed(2));
      },
    });

    const {
      inputValue: rublesValue,
      setInputValue: setRublesValue,
      handleChangeInputValue: handleChangeRublesValue,
    } = useInput({
      onChangeValue(value) {
        setLitersValue((+value / trkType.price).toFixed(2));
      },
    });

    const handleSubmit = useCallback(() => {
      let rubles = +rublesValue;
      let liters = +litersValue;
      if (liters >= 1) {
        if (rubles <= balance || fuelOnDebt) {
          onSubmit({
            rubles: +rublesValue,
            liters: +litersValue,
          });
        } else {
          showError({ text: "Недостаточно средств" });
          router.navigate({
            pathname: ESCREENS.PAY_BALANCE,
            params: {
              sum: Math.ceil(rubles - balance),
              backLink: ESCREENS.FUEL,
            },
          });
        }
      } else {
        showError({ text: "Минимальная сумма для налива - 1 л." });
      }
    }, [onSubmit, rublesValue, litersValue, balance]);

    return (
      <View style={styles.container}>
        <Typography type="displayMedium">{trkType.name}</Typography>
        <Typography marginsPaddings={{ mb: 44 }}>
          Колонка {column.name}
        </Typography>
        <View style={styles.row}>
          <FuelLitersSelector
            litersValue={litersValue}
            fuelPrice={trkType.price}
            onChangeLitersValue={handleChangeLitersValue}
          />
          <SelectLitersForm
            rublesValue={rublesValue}
            onChangeRublesValue={handleChangeRublesValue}
            litersValue={litersValue}
            onChangeLitersValue={handleChangeLitersValue}
          />
        </View>

        <CustomButton
          onPress={handleSubmit}
          styled={{
            marginsPaddings: { mb: 10, mt: 50 },
          }}
        >
          Начать налив
        </CustomButton>
        <CustomButton
          onPress={onGoBack}
          styled={{
            type: "secondary",
          }}
        >
          Вернуться назад
        </CustomButton>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: SIZES.WIDTH(1) - SIZES.PX * 40,
  },
});
