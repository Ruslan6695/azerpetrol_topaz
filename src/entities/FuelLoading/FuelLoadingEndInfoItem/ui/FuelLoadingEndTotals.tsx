import { useRouter } from "expo-router";
import { memo, useCallback, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import {
  COLORS,
  divideNumber,
  ESCREENS,
  SIZES,
  ThemeStore,
} from "../../../../shared";
import { CustomButton } from "../../../../shared/CustomButton";
import { Typography } from "../../../../shared/Typography";
import { BonusIcon } from "../../../../shared/BonusIcon";

type Props = {
  sum: number;
  liters: number;
  balance: number;
};

export const FuelLoadingEndTotals = memo(({ sum, balance, liters }: Props) => {
  const COLORS = ThemeStore.useCOLORS();
  const bottomValue = useSharedValue(-150);
  const router = useRouter();

  const handleSubmit = useCallback(() => {
    router.navigate(ESCREENS.HOME);
  }, []);

  const animStyle = useAnimatedStyle(() => {
    return {
      bottom: bottomValue.value,
    };
  }, []);

  const styles = StyleSheet.create({
    wrapper: {
      position: "absolute",
      width: "100%",
    },
    container: {
      backgroundColor: COLORS.BACKGROUND.Tertiary,
      width: "100%",
      borderRadius: 16 * SIZES.PX,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: SIZES.PX * 16,
      paddingVertical: SIZES.PX * 18,
    },
    sumRow: {
      flexDirection: "row",
      alignItems: "center",
    },
  });

  useEffect(() => {
    bottomValue.value = withSpring(50 * SIZES.PX);
  }, []);

  return (
    <Animated.View style={[styles.wrapper, animStyle]}>
      <View style={styles.container}>
        <View style={styles.row}>
          <Typography type="displaySmall">Списано</Typography>
          <View style={styles.sumRow}>
            <Typography type="displaySmall">{divideNumber(sum)}</Typography>
            <BonusIcon mt={2} size={13.5} ml={1} />
          </View>
        </View>
        <View style={styles.row}>
          <Typography type="displaySmall">Заправлено</Typography>
          <Typography type="displaySmall">{divideNumber(liters)} л.</Typography>
        </View>
        <View style={styles.row}>
          <Typography type="displaySmall">Остаток</Typography>
          <View style={styles.sumRow}>
            <Typography type="displaySmall">{divideNumber(balance)}</Typography>
            <BonusIcon mt={2} size={13.5} ml={1} />
          </View>
        </View>
      </View>
      <CustomButton
        onPress={handleSubmit}
        styled={{ marginsPaddings: { mt: 34 } }}
      >
        Готово
      </CustomButton>
    </Animated.View>
  );
});
