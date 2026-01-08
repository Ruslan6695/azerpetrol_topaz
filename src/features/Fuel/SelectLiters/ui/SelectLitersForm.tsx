import { memo } from "react";
import { CustomInput } from "../../../../shared/CustomInput";
import { StyleSheet, View } from "react-native";
import { SIZES, divideNumber } from "../../../../shared";
import { MPLayout } from "../../../../shared/MpLayout";
import { Typography } from "../../../../shared/Typography";
import { BonusIcon } from "../../../../shared/BonusIcon";

type Props = {
  rublesValue: string;
  onChangeRublesValue: (value: string) => void;
  litersValue: string;
  onChangeLitersValue: (value: string) => void;
};

export const SelectLitersForm = memo(
  ({
    onChangeLitersValue,
    litersValue,
    onChangeRublesValue,
    rublesValue,
  }: Props) => {
    return (
      <View style={styles.container}>
        <View>
          <CustomInput
            keyboardType="numeric"
            placeholder="Введите литры"
            styled={{
              marginsPaddings: { mb: 10 },
              width: {
                value: SIZES.WIDTH(0.5),
                type: "absolute",
              },
              height: { value: 45, type: "px" },
            }}
            value={litersValue}
            onChangeText={onChangeLitersValue}
          />
          <CustomInput
            keyboardType="numeric"
            placeholder="Введите рубли"
            styled={{
              width: {
                value: SIZES.WIDTH(0.5),
                type: "absolute",
              },
              height: { value: 45, type: "px" },
            }}
            value={rublesValue}
            onChangeText={onChangeRublesValue}
          />
        </View>

        <View style={styles.totalBlock}>
          <Typography type="headlineMedium">
            {divideNumber(+litersValue)} л
          </Typography>
          <View style={styles.row}>
            <Typography type="headlineMedium">
              {divideNumber(+rublesValue)}
            </Typography>
            <BonusIcon bold size={35} mt={9} />
          </View>
        </View>
      </View>
    );
  }
);
const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    height: 280 * SIZES.PX,
    alignItems: "flex-end",
  },
  totalBlock: {
    alignItems: "flex-end",
    marginBottom: SIZES.PX * 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
});
