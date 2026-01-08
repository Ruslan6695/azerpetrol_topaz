import { memo, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { SIZES, ThemeStore, divideNumber } from "../../../../shared";
import { Typography } from "../../../../shared/Typography";
import { IHistoryDetailsBuyOnCashItem } from "../config/interfaces/IHistoryDetailsBuyOnCashItem";

interface IProps extends IHistoryDetailsBuyOnCashItem {
  isFirst: boolean;
  isLast: boolean;
}

export const HistoryDetailsBuyOnCashItem = memo(
  ({ name, sum, unit, price_one, isFirst, isLast }: IProps) => {
    const COLORS = ThemeStore.useCOLORS();

    const styles = useMemo(
      () =>
        StyleSheet.create({
          container: {
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: COLORS.BACKGROUND.Tertiary,
            paddingVertical: SIZES.PX * 10,
            paddingHorizontal: SIZES.PX * 14,
            borderTopLeftRadius: isFirst ? 16 * SIZES.PX : 0,
            borderTopRightRadius: isFirst ? 16 * SIZES.PX : 0,
            borderBottomLeftRadius: isLast ? 16 * SIZES.PX : 0,
            borderBottomRightRadius: isLast ? 16 * SIZES.PX : 0,
          },
          name: {
            flex: 3,
            marginRight: 10,
          },
          unit: {
            flex: 1,
          },
          totalBlock: {
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
          },
        }),
      [COLORS]
    );

    return (
      <View style={styles.container}>
        <View style={styles.name}>
          <Typography type="captionAccent">{name}</Typography>
        </View>
        <Typography type="caption" marginsPaddings={{ mr: 20 }}>
          {unit.count} {unit.name} x {divideNumber(+price_one.toFixed(2))}
        </Typography>
        <View style={styles.totalBlock}>
          <Typography type="caption">
            {divideNumber(+sum.toFixed(2))}
          </Typography>
        </View>
      </View>
    );
  }
);
