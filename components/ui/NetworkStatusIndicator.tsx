import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { HStack } from '@/components/ui/Stack';
import { Text as UIText } from '@/components/ui/Text';
import { useTheme, useTokens } from '@/hooks/useTheme';
import NetInfo from '@react-native-community/netinfo';

interface NetworkStatusIndicatorProps {
  showText?: boolean;
  compact?: boolean;
}

export default function NetworkStatusIndicator({ showText = true, compact = false }: NetworkStatusIndicatorProps) {
  const [isConnected, setIsConnected] = useState(true);
  const [connectionType, setConnectionType] = useState<string>('unknown');
  const theme = useTheme();
  const tokens = useTokens();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected ?? true);
      setConnectionType(state.type);
    });

    // Get initial state
    NetInfo.fetch().then(state => {
      setIsConnected(state.isConnected ?? true);
      setConnectionType(state.type);
    });

    return unsubscribe;
  }, []);

  if (isConnected && !compact) {
    return null; // Don't show anything when connected and not in compact mode
  }

  const getStatusColor = () => {
    if (!isConnected) return theme.danger;
    if (connectionType === 'wifi') return theme.primary;
    if (connectionType === 'cellular') return '#FFA500'; // Orange
    return theme.textSecondary;
  };

  const getStatusText = () => {
    if (!isConnected) return 'Offline';
    if (connectionType === 'wifi') return 'Online (WiFi)';
    if (connectionType === 'cellular') return 'Online (Cellular)';
    return 'Online';
  };

  const getIcon = () => {
    if (!isConnected) return '❌';
    if (connectionType === 'wifi') return '📶';
    if (connectionType === 'cellular') return '📱';
    return '✅';
  };

  return (
    <View style={[styles.container, { backgroundColor: getStatusColor() + '20' }]}>
      <HStack style={{ alignItems: 'center', gap: tokens.spacing.sm }}>
        <Text style={{ fontSize: compact ? 14 : 16 }}>
          {getIcon()}
        </Text>
        {showText && (
          <UIText
            variant={compact ? "caption" : "body"}
            style={{ color: getStatusColor(), fontWeight: '500' }}
          >
            {getStatusText()}
          </UIText>
        )}
      </HStack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
});
