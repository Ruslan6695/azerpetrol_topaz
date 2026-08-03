import { useRouter } from "expo-router";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { ErrorWhileFetchingForm } from "../../../../entities/ErrorWhileFetchingForm";
import { TransferBalanceConfirmInfoItem } from "../../../../entities/TransferBalanceConfirmInfoItem";
import {
  COLORS,
  ESCREENS,
  SIZES,
  ThemeStore,
  UserStore,
  divideNumber,
  useFetchData,
  useSendFetch,
} from "../../../../shared";
import { CustomButton } from "../../../../shared/CustomButton";
import { Loader } from "../../../../shared/Loader";
import { showError } from "../../../../shared/ToastComponent";
import { transferBalanceConfirmApi } from "../api/transferBalanceConfirmApi";
import { ITransferBalanceGetClientData } from "../config/interfaces/ITransferBalanceGetClientData";
import { TransferBalanceConfirmSkeleton } from "./TransferBalanceConfirmSkeleton";

type Props = {
  name?: string;
  phone: string;
  sum: number;
  onGoBack: () => void;
};

export const TransferBalanceConfirm = memo(
  ({ name, phone, sum, onGoBack }: Props) => {
    const COLORS = ThemeStore.useCOLORS();
    const setBalance = UserStore.useSetBalance();
    const balance = UserStore.useBalance();
    const [userName, setUserName] = useState(name || "");
    const router = useRouter();
    const { data, errorText, fetchData, isDataLoading } = useFetchData<
      ITransferBalanceGetClientData,
      { phone: string }
    >({
      apiCallback: transferBalanceConfirmApi.getClientInfo,
      errorText: "Не удалось получить клиента",
    });
    const {
      errorText: transferErorrtext,
      isSendFetchLoading: isTransferLoading,
      sendFetch: sendTransfer,
    } = useSendFetch<{
      transferId: number;
      sum: number;
    }>({
      apiCallback: transferBalanceConfirmApi.confirm,
      errorText: "Не удалось перевести средства",
    });

    const handleSubmit = useCallback(() => {
      if (data) {
        if (sum <= balance)
          sendTransfer({
            args: { transferId: data?.id, sum },
            afterDataCallback(data) {
              router.navigate({
                pathname: ESCREENS.SUCCESS,
                params: { text: "Перевод успешно выполнен" },
              });
            },
          });
        else {
          showError({ text: "Недостаточно средств" });
        }
      } else {
        showError({
          text: "Не удалось получить пользователя для перевода",
        });
      }
    }, [data]);

    const styles = useMemo(
      () =>
        StyleSheet.create({
          container: {
            backgroundColor: COLORS.BACKGROUND.Tertiary,
            padding: SIZES.PX * 20,
            borderRadius: 16 * SIZES.PX,
          },
        }),
      [COLORS]
    );

    useEffect(() => {
      fetchData({
        args: { phone: phone },
        hideToastOnError: true,
        afterDataCallback(data) {
          setUserName(data.name);
          setBalance({
                                balance: data.balance,
                                bonus_balance: data.bonus_balance,
                            });
        },
      });
    }, []);

    return (
      <>
        {errorText ? (
          <>
            <ErrorWhileFetchingForm margins={{ mb: 20 }} message={errorText} />
            <CustomButton
              onPress={onGoBack}
              styled={{
                type: "secondary",
                width: {
                  value: "100%",
                  type: "absolute",
                },

                marginsPaddings: { mt: 10 },
              }}
            >
              Вернуться назад
            </CustomButton>
          </>
        ) : (
          <>
            <View style={styles.container}>
              {isDataLoading ? (
                <TransferBalanceConfirmSkeleton />
              ) : (
                <>
                  <TransferBalanceConfirmInfoItem
                    title="Получатель"
                    info={userName}
                  />
                  <TransferBalanceConfirmInfoItem
                    title="Телефон"
                    info={phone}
                  />
                  <TransferBalanceConfirmInfoItem
                    bonus
                    title="Сумма"
                    info={`${divideNumber(+sum.toFixed(2))}`}
                  />
                  <TransferBalanceConfirmInfoItem
                    bonus
                    title="Остаток средств"
                    info={`${divideNumber(+(balance - sum).toFixed(2))}`}
                  />
                </>
              )}
            </View>
            {isTransferLoading ? (
              <Loader />
            ) : isDataLoading ? (
              <></>
            ) : (
              <>
                <CustomButton
                  disabled={isTransferLoading}
                  onPress={handleSubmit}
                  styled={{
                    width: {
                      value: "100%",
                      type: "absolute",
                    },
                    marginsPaddings: { mt: 20 },
                  }}
                >
                  Перевести
                </CustomButton>
                <CustomButton
                  onPress={onGoBack}
                  styled={{
                    type: "secondary",
                    width: {
                      value: "100%",
                      type: "absolute",
                    },

                    marginsPaddings: { mt: 10 },
                  }}
                >
                  Вернуться назад
                </CustomButton>
              </>
            )}
          </>
        )}
      </>
    );
  }
);
