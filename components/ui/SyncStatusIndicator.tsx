import { View, Text } from '@/components/Themed'
import { useSyncStore } from '@/store/syncStore'
import { StyleSheet } from 'react-native'

export function SyncStatusIndicator() {
  const { status, lastSyncedAt, lastError } = useSyncStore()

  const getStatusText = () => {
    switch (status) {
      case 'syncing':
        return 'Syncing...'
      case 'offline':
        return 'Offline'
      case 'error':
        return lastError || 'Sync Error'
      case 'never_synced':
        return 'Never synced'
      default:
        if (lastSyncedAt) {
          const now = new Date()
          const diff = now.getTime() - lastSyncedAt.getTime()
          const minutes = Math.floor(diff / 60000)
          if (minutes < 1) return 'Synced just now'
          if (minutes < 60) return `Synced ${minutes}m ago`
          const hours = Math.floor(minutes / 60)
          return `Synced ${hours}h ago`
        }
        return 'Not synced'
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'syncing':
        return '#ffa500'
      case 'offline':
      case 'error':
      case 'never_synced':
        return '#ff0000'
      default:
        return '#00ff00'
    }
  }

  return (
    <View style={styles.container}>
      <View style={[styles.dot, { backgroundColor: getStatusColor() }]} />
      <Text style={styles.text}>{getStatusText()}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  text: {
    fontSize: 12,
    color: '#666',
  },
})
