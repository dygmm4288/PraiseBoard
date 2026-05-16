import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Icon } from "@/assets/icons";
import { AppButton, AppInput, AppText, Screen } from "@/shared/ui";
import { useNavigation } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from "react-native";

type SignupProviderButtonProps = {
  label: string;
  icon: React.ReactNode;
};

const SignupProviderButton = ({ label, icon }: SignupProviderButtonProps) => {
  return (
    <AppButton
      fullWidth
      variant="tertiary"
      className="justify-between px-[18px]"
      leftSlot={<View className="w-[24px] items-center">{icon}</View>}
      rightSlot={<View className="w-[24px]" />}
    >
      <AppText variant="button1" className="text-gray-700">
        {label}
      </AppText>
    </AppButton>
  );
};

const Signup = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");

  return (
    <Screen className="bg-white px-[20px] pt-[12px]">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          bounces={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View className="flex-1 justify-between pb-[24px]">
            <View className="gap-[28px]">
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="뒤로 가기"
                className="h-[32px] w-[32px] items-center justify-center"
                onPress={() => navigation.goBack()}
              >
                <Icon name="ChevronLeft" />
              </Pressable>

              <View className="gap-[14px]">
                <View className="self-start rounded-full bg-primary-100 px-[12px] py-[6px]">
                  <AppText variant="caption2" className="text-primary-700">
                    회원가입
                  </AppText>
                </View>
                <View className="gap-[6px]">
                  <AppText variant="title2" className="text-gray-700">
                    계정을 만들고
                  </AppText>
                  <AppText variant="title2" className="text-gray-700">
                    칭찬 보드를 안전하게 이어가세요
                  </AppText>
                </View>
                <AppText variant="body3" className="text-gray-400">
                  지금까지 이 기기에 저장된 보드 데이터를 그대로 유지한 채
                  회원으로 전환할 수 있어요.
                </AppText>
              </View>

              <View className="rounded-[24px] bg-gray-100 p-[18px]">
                <View className="gap-[14px]">
                  <View className="gap-[6px]">
                    <AppText variant="caption1" className="text-gray-400">
                      이메일
                    </AppText>
                    <AppInput
                      value={email}
                      placeholder="email@example.com"
                      autoCapitalize="none"
                      keyboardType="email-address"
                      autoCorrect={false}
                      onChangeText={setEmail}
                      className="bg-white"
                    />
                  </View>
                  <AppButton fullWidth variant="primary" label="이메일로 계속하기" />
                </View>
              </View>

              <View className="flex-row items-center gap-[12px]">
                <View className="h-[1px] flex-1 bg-gray-200" />
                <AppText variant="caption2" className="text-gray-400">
                  또는
                </AppText>
                <View className="h-[1px] flex-1 bg-gray-200" />
              </View>

              <View className="gap-[12px]">
                <SignupProviderButton
                  label="Apple로 계속하기"
                  icon={<FontAwesome name="apple" size={18} color="#111111" />}
                />
                <SignupProviderButton
                  label="Google로 계속하기"
                  icon={<FontAwesome name="google" size={17} color="#4285F4" />}
                />
              </View>
            </View>

            <AppText variant="caption2" className="px-[4px] text-center text-gray-400">
              계속 진행하면 서비스 이용약관과 개인정보 처리방침에 동의하는 것으로
              간주됩니다.
            </AppText>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
};

export default Signup;
