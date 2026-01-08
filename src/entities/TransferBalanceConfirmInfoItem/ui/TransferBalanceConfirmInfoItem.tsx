import { memo } from "react";
import { MPLayout } from "../../../shared/MpLayout";
import { Typography } from "../../../shared/Typography";
import { StyleSheet, View } from "react-native";
import { BonusIcon } from "../../../shared/BonusIcon";

type Props = {
  title: string;
  info: string;
  bonus?: boolean;
};

export const TransferBalanceConfirmInfoItem = memo(
  ({ info, title, bonus }: Props) => {
    return (
      <MPLayout mt={5} mb={5}>
        <Typography type="caption" color="secondary">
          {title}
        </Typography>
        <View style={styles.row}>
          <Typography>{info}</Typography>
          {bonus && <BonusIcon mt={3} size={13.5} />}
        </View>
      </MPLayout>
    );
  }
);

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
});
