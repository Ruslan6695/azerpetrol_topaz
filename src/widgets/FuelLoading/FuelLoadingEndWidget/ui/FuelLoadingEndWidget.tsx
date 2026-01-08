import { useRouter } from "expo-router";
import { memo, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { COLORS, SIZES, ThemeStore } from "../../../../shared";
import { SuccessImage } from "../../../../shared/SuccessImage";
import { Typography } from "../../../../shared/Typography";
import { FuelLoadingEndTotals } from "../../../../entities/FuelLoading/FuelLoadingEndInfoItem";

type Props = {
  rubles: number;
  volume: number;
  balance: number;
};

export const FuelLoadingEndWidget = memo(
  ({ balance, rubles, volume }: Props) => {
    const COLORS = ThemeStore.useCOLORS();
    const topValue = useSharedValue(-500 * SIZES.PX);

    const animStyle = useAnimatedStyle(() => {
      return { top: topValue.value };
    }, []);

    const styles = StyleSheet.create({
      wrapper: {
        width: SIZES.WIDTH(1),
        height: SIZES.HEIGHT(1),
        backgroundColor: COLORS.BACKGROUND.Primary,
        paddingVertical: SIZES.PX * 40,
        paddingHorizontal: SIZES.PX * 20,
        alignItems: "center",
        justifyContent: "center",
      },
      content: {
        alignItems: "center",
        justifyContent: "center",
        top: 0,
      },

      row: {
        flexDirection: "row",
        alignItems: "center",
      },
    });

    useEffect(() => {
      topValue.value = withSpring(0, { damping: 50 });
    }, []);
    return (
      <View style={styles.wrapper}>
        <Animated.View style={[styles.content, animStyle]}>
          <SuccessImage />
          <Typography marginsPaddings={{ mt: 16, mb: 8 }} type="displayMedium">
            Автомобиль заправлен
          </Typography>
          <Typography marginsPaddings={{ mb: 200 }}>
            Спасибо, что вы с нами.
          </Typography>
        </Animated.View>

        <FuelLoadingEndTotals balance={balance} sum={rubles} liters={volume} />
      </View>
    );
  }
);
