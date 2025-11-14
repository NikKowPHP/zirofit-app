import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { VStack, HStack } from '@/components/ui/Stack';
import { Text as UIText } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useTheme, useTokens } from '@/hooks/useTheme';
import { useAssetUploadQueue } from '@/hooks/useAssetUploadQueue';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface AssetUploadQueueProps {
  compact?: boolean;
}

export default function AssetUploadQueue({ compact = false }: AssetUploadQueueProps) {
  const { queue, retryAsset, removeAsset } = useAssetUploadQueue();
  const theme = useTheme();
  const tokens = useTokens();

  const pendingCount = queue.filter(asset => asset.status === 'pending').length;
  const uploadingCount = queue.filter(asset => asset.status === 'uploading').length;
  const failedCount = queue.filter(asset => asset.status === 'failed').length;

  if (queue.length === 0) {
    return null;
  }

  if (compact) {
    return (
      <TouchableOpacity style={[styles.compactContainer, { backgroundColor: theme.surface }]}>
        <HStack style={{ alignItems: 'center', gap: tokens.spacing.sm }}>
          <FontAwesome name="cloud-upload" size={16} color={theme.primary} />
          <UIText variant="caption">
            {pendingCount > 0 && `${pendingCount} pending`}
            {uploadingCount > 0 && `, ${uploadingCount} uploading`}
            {failedCount > 0 && `, ${failedCount} failed`}
          </UIText>
        </HStack>
      </TouchableOpacity>
    );
  }

  const handleRetry = (assetId: string) => {
    retryAsset(assetId);
  };

  const handleRemove = (assetId: string) => {
    const asset = queue.find(a => a.id === assetId);
    Alert.alert(
      'Remove Upload',
      `Remove ${asset?.fileName} from upload queue?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => removeAsset(assetId) },
      ]
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'uploading': return '📤';
      case 'completed': return '✅';
      case 'failed': return '❌';
      default: return '❓';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return theme.textSecondary;
      case 'uploading': return theme.primary;
      case 'completed': return '#10B981'; // Green
      case 'failed': return theme.danger;
      default: return theme.textSecondary;
    }
  };

  return (
    <Card style={{ margin: tokens.spacing.md }}>
      <VStack style={{ gap: tokens.spacing.md }}>
        <HStack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <UIText variant="h5">Upload Queue</UIText>
          <UIText variant="caption" style={{ color: theme.textSecondary }}>
            {queue.length} items
          </UIText>
        </HStack>

        {queue.map((asset) => (
          <View key={asset.id} style={[styles.assetItem, { borderLeftColor: getStatusColor(asset.status) }]}>
            <HStack style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <VStack style={{ flex: 1, gap: tokens.spacing.xs }}>
                <HStack style={{ alignItems: 'center', gap: tokens.spacing.sm }}>
                  <Text style={{ fontSize: 16 }}>{getStatusIcon(asset.status)}</Text>
                  <UIText variant="body" numberOfLines={1} style={{ flex: 1 }}>
                    {asset.fileName}
                  </UIText>
                </HStack>

                <UIText variant="caption" style={{ color: theme.textSecondary }}>
                  {(asset.size / 1024 / 1024).toFixed(2)} MB • {asset.retryCount}/3 attempts
                </UIText>

                {asset.error && (
                  <UIText variant="caption" style={{ color: theme.danger }}>
                    {asset.error}
                  </UIText>
                )}
              </VStack>

              <HStack style={{ gap: tokens.spacing.sm }}>
                {asset.status === 'failed' && (
                  <TouchableOpacity
                    onPress={() => handleRetry(asset.id)}
                    style={[styles.actionButton, { backgroundColor: theme.primary }]}
                  >
                    <FontAwesome name="refresh" size={14} color="white" />
                  </TouchableOpacity>
                )}

                {(asset.status === 'completed' || asset.status === 'failed') && (
                  <TouchableOpacity
                    onPress={() => handleRemove(asset.id)}
                    style={[styles.actionButton, { backgroundColor: theme.textSecondary }]}
                  >
                    <FontAwesome name="trash" size={14} color="white" />
                  </TouchableOpacity>
                )}
              </HStack>
            </HStack>
          </View>
        ))}
      </VStack>
    </Card>
  );
}

const styles = StyleSheet.create({
  compactContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    margin: 8,
  },
  assetItem: {
    padding: 12,
    borderLeftWidth: 3,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
