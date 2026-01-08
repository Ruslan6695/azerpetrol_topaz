import { memo } from "react";
import { divideNumber } from "../../../../shared";
import { Typography } from "../../../../shared/Typography";
import { StyleSheet, View } from "react-native";
import { BonusIcon } from "../../../../shared/BonusIcon";

type Props = {
  sum: number;
};

export const OpenHistoryDetailsPayBalance = memo(({ sum }: Props) => {
  return (
    <>
      <Typography marginsPaddings={{ mt: 20 }}>ИТОГ</Typography>
      <View style={styles.row}>
        <Typography type="bodyMedium">{divideNumber(sum)}</Typography>
        <BonusIcon size={16} mt={2} />
      </View>
    </>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
});
