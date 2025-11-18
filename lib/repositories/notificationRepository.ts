import { database } from '@/lib/db'
import Notification from '@/lib/db/models/Notification'
import { Q } from '@nozbe/watermelondb'

const notificationsCollection = database.collections.get<Notification>('notifications')

export const notificationRepository = {
  observeNotifications: () => notificationsCollection.query(Q.where('deleted_at', Q.eq(null))).observe(),

  observeNotification: (id: string) => notificationsCollection.findAndObserve(id),

  observeNotificationsByUser: (userId: string) =>
    notificationsCollection.query(
      Q.where('user_id', userId),
      Q.where('deleted_at', Q.eq(null)),
      Q.sortBy('created_at', Q.desc)
    ).observe(),

  observeUnreadNotifications: (userId: string) =>
    notificationsCollection.query(
      Q.where('user_id', userId),
      Q.where('is_read', false),
      Q.where('deleted_at', Q.eq(null)),
      Q.sortBy('created_at', Q.desc)
    ).observe(),

  createNotification: async (data: {
    userId: string
    title: string
    message: string
    type: 'info' | 'warning' | 'error' | 'success'
    isRead?: boolean
    data?: string // JSON string
  }) => {
    await database.write(async () => {
      await notificationsCollection.create(notification => {
        notification.userId = data.userId
        notification.title = data.title
        notification.message = data.message
        notification.type = data.type
        notification.isRead = data.isRead || false
        notification.data = data.data
        ;(notification as any).syncStatus = 'created'
      })
    })
  },

  updateNotification: async (id: string, updates: Partial<{
    title: string
    message: string
    type: 'info' | 'warning' | 'error' | 'success'
    isRead: boolean
    data: string
  }>) => {
    await database.write(async () => {
      const notification = await notificationsCollection.find(id)
      await notification.update(record => {
        Object.assign(record, updates)
        // Mark as needing sync to server if not already synced
        if ((record as any).syncStatus === 'synced') {
          ;(record as any).syncStatus = 'updated'
        }
      })
    })
  },

  markAsRead: async (id: string) => {
    await database.write(async () => {
      const notification = await notificationsCollection.find(id)
      await notification.update(record => {
        record.isRead = true
        // Mark as needing sync to server if not already synced
        if ((record as any).syncStatus === 'synced') {
          ;(record as any).syncStatus = 'updated'
        }
      })
    })
  },

  markAllAsRead: async (userId: string) => {
    await database.write(async () => {
      const unreadNotifications = await notificationsCollection.query(
        Q.where('user_id', userId),
        Q.where('is_read', false)
      ).fetch()

      for (const notification of unreadNotifications) {
        await notification.update(record => {
          record.isRead = true
          // Mark as needing sync to server if not already synced
          if ((record as any).syncStatus === 'synced') {
            ;(record as any).syncStatus = 'updated'
          }
        })
      }
    })
  },

  deleteNotification: async (id: string) => {
    await database.write(async () => {
      const notification = await notificationsCollection.find(id)
      await notification.update(record => {
        record.deletedAt = Date.now()
        // Mark as needing sync to server
        ;(record as any).syncStatus = 'deleted'
      })
    })
  },
}
