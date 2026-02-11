import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SignupScreen() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSignup = () => {
    console.log({ email: form.email, password: form.password });
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className='flex-1 bg-white px-6 justify-center'>
      <View className='space-y-4'>
        <View>
          <Text className='text-gray-600 mb-2'>이메일</Text>
          <TextInput
            className='border border-gray-200 p-4 rounded-xl'
            placeholder='email@example.com'
            keyboardType='email-address'
            value={form.email}
            onChangeText={(v) => setForm((prev) => ({ ...prev, email: v }))}
          />
        </View>
        <View>
          <Text className='text-gray-600 mb-2'>비밀번호</Text>
          <TextInput
            className='border border-gray-200 p-4 rounded-xl'
            placeholder='email@example.com'
            secureTextEntry
            value={form.password}
            onChangeText={(v) => setForm((prev) => ({ ...prev, password: v }))}
          />
        </View>
        <TouchableOpacity
          className='mt-6 p-4 rounded-xl items-center'
          onPress={handleSignup}>
          <Text>시작하기</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
