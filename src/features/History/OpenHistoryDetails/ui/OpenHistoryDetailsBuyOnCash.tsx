import { randomUUID } from "expo-crypto";
import { memo } from "react";
import { StyleSheet, View } from "react-native";
import { HistoryDetailsBuyOnCashItem } from "../../../../entities/History/HistoryDetailsBuyOnCashItem";
import { IHistoryDetailsBuyOnCashItem } from "../../../../entities/History/HistoryDetailsBuyOnCashItem/config/interfaces/IHistoryDetailsBuyOnCashItem";
import { SIZES, divideNumber } from "../../../../shared";
import { Typography } from "../../../../shared/Typography";
import { BonusIcon } from "../../../../shared/BonusIcon";

type Props = {
  products: IHistoryDetailsBuyOnCashItem[];
  total: number;
};

export const OpenHistoryDetailsBuyOnCash = memo(
  ({ products, total }: Props) => {
    return (
      <View style={styles.container}>
        <View style={styles.total}>
          <Typography>ИТОГ:</Typography>
          <View style={styles.row}>
            <Typography type="bodyMedium">
              {divideNumber(total)}
              <BonusIcon mt={12.5} size={17} />
            </Typography>
          </View>
        </View>
        {products.map((prod, index, arr) => (
          <HistoryDetailsBuyOnCashItem
            isFirst={index === 0}
            isLast={index === arr.length - 1}
            {...prod}
            key={randomUUID()}
          />
        ))}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {},
  total: {
    justifyContent: "space-between",
    marginBottom: SIZES.PX * 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
});
