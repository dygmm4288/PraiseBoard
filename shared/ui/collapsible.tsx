import { PropsWithChildren, useState } from "react";
import { TouchableOpacity, View } from "react-native";

import { AppText } from "./text";
import { IconSymbol } from "./icon-symbol";

export function Collapsible({
  children,
  title,
}: PropsWithChildren & { title: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View>
      <TouchableOpacity
        className='flex-row items-center gap-1.5'
        onPress={() => setIsOpen((value) => !value)}
        activeOpacity={0.8}>
        <IconSymbol
          name='chevron.right'
          size={18}
          weight='medium'
          color='#6b7280'
          style={{ transform: [{ rotate: isOpen ? "90deg" : "0deg" }] }}
        />

        <AppText variant='body' weight='semibold'>
          {title}
        </AppText>
      </TouchableOpacity>
      {isOpen ? <View className='mt-1.5 ml-6'>{children}</View> : null}
    </View>
  );
}
