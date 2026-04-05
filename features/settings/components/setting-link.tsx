import { Icon } from '@/assets/icons';
import { AppText } from '@/shared/ui';
import { PropsWithChildren } from 'react';
import { View } from 'react-native'

type SettingLinkProps = {
    onLink: () => void;
    
} & PropsWithChildren;

const SettingLink= ({children, onLink}:SettingLinkProps) => {
    return <View className="flex flex-row justify-between">
        <AppText variant="body2" className="text-gray-700">
            {children}
        </AppText>
        <Icon name="ChevronRightSmall" width={5} height={10} />
      </View>
};

export default SettingLink; 