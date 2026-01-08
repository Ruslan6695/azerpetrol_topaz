import React from "react";
import { StyleSheet, View } from "react-native";
import { Typography } from "../../../../shared/Typography";
import { BonusIcon } from "../../../../shared/BonusIcon";

type Props = {
  title: string;
  info: string;
  bonus?: boolean;
};

export const HistoryDetailsTransferBalanceItem = ({
  info,
  title,
  bonus,
}: Props) => {
  return (
    <View>
      <Typography type="caption" color="secondary">
        {title}
      </Typography>
      <View style={styles.row}>
        <Typography>{info}</Typography>
        {bonus && <BonusIcon mt={2} size={14} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
});
