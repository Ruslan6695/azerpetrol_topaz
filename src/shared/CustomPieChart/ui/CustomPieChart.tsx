import { randomUUID } from "expo-crypto";
import { memo } from "react";
import { StyleSheet, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { SIZES } from "../../common/config/constants/sizes";
import { divideNumber } from "../../common/config/lib/helpers/divideNumber";
import { Typography } from "../../Typography";
import { ICustomPieChartData } from "../config/interfaces/ICustomPieChartData";
import { CustomPieChartLegendItem } from "./CustomPieChartLegendItem";
import { ThemeStore } from "../../common/model/themeStore";
import { BonusIcon } from "../../BonusIcon";

type Props = {
  data: ICustomPieChartData[];
  centerTotal?: number;
};

export const CustomPieChart = memo(({ data, centerTotal }: Props) => {
  const COLORS = ThemeStore.useCOLORS();
  return (
    <View style={styles.container}>
      <PieChart
        backgroundColor={COLORS.BACKGROUND.Tertiary}
        innerRadius={45 * SIZES.PX}
        radius={70 * SIZES.PX}
        donut
        centerLabelComponent={
          centerTotal
            ? () => (
                <View style={styles.row}>
                  <Typography type="caption">
                    {divideNumber(centerTotal)}
                  </Typography>
                  <BonusIcon ml={1} mt={2} size={11} />
                </View>
              )
            : undefined
        }
        data={data}
      />
      <View style={styles.legendContainer}>
        {data.map((item) => (
          <CustomPieChartLegendItem key={randomUUID()} {...item} />
        ))}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    height: 140 * SIZES.PX,
    marginTop: SIZES.PX * -15,
  },
  legendContainer: {
    gap: SIZES.PX * 10,
    height: "100%",
    marginLeft: SIZES.PX * 20,
    justifyContent: "space-evenly",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
});
