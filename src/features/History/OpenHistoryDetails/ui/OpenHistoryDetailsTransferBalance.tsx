import { memo, useMemo } from "react";
import {
  HistoryDetailsTransferBalanceItem,
  IHistoryDetailsTransferBalanceItem,
} from "../../../../entities/History/HistoryDetailsTransferBalanceItem";
import { StyleSheet, View } from "react-native";
import { COLORS, SIZES, ThemeStore, divideNumber } from "../../../../shared";
import { PersonIcon } from "../../../../shared/Icons/PersonIcon";
import { PhoneIcon } from "../../../../shared/PhoneIcon";
import { SumIcon } from "../../../../shared/SumIcon";

type Props = {
  info: IHistoryDetailsTransferBalanceItem;
};

export const OpenHistoryDetailsTransferBalance = ({ info }: Props) => {
  const COLORS = ThemeStore.useCOLORS();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          backgroundColor: COLORS.BACKGROUND.Tertiary,
          padding: SIZES.PX * 20,
          borderRadius: 16 * SIZES.PX,
          gap: 16 * SIZES.PX,
          marginTop: SIZES.PX * 20,
        },
      }),
    [COLORS]
  );
  return (
    <View style={styles.container}>
      <HistoryDetailsTransferBalanceItem
        info={info.transfer_name}
        title="Получатель"
      />
      <HistoryDetailsTransferBalanceItem
        info={info.transfer_phone}
        title="Телефон"
      />
      <HistoryDetailsTransferBalanceItem
        bonus
        info={`${divideNumber(-1 * info.sum)}`}
        title="Cумма"
      />
    </View>
  );
};
