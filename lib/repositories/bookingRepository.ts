import { database } from '@/lib/db'
import Booking from '@/lib/db/models/Booking'
import { Q } from '@nozbe/watermelondb'

const bookingsCollection = database.collections.get<Booking>('bookings')

export const bookingRepository = {
  observeBookings: () => bookingsCollection.query(Q.where('deleted_at', Q.eq(null))).observe(),

  observeBooking: (id: string) => bookingsCollection.findAndObserve(id),

  observeBookingsByClient: (clientId: string) =>
    bookingsCollection.query(
      Q.where('client_id', clientId),
      Q.where('deleted_at', Q.eq(null)),
      Q.sortBy('created_at', Q.desc)
    ).observe(),

  observeBookingsByTrainer: (trainerId: string) =>
    bookingsCollection.query(
      Q.where('trainer_id', trainerId),
      Q.where('deleted_at', Q.eq(null)),
      Q.sortBy('session_date', Q.desc)
    ).observe(),

  observeUpcomingBookings: (userId: string, isTrainer: boolean = false) => {
    const now = Date.now()
    const query = isTrainer
      ? Q.where('trainer_id', userId)
      : Q.where('client_id', userId)

    return bookingsCollection.query(
      query,
      Q.where('session_date', Q.gte(now)),
      Q.where('status', Q.oneOf(['pending', 'confirmed'])),
      Q.where('deleted_at', Q.eq(null)),
      Q.sortBy('session_date', Q.asc)
    ).observe()
  },

  createBooking: async (data: {
    clientId: string
    trainerId: string
    sessionDate: number
    sessionTime: string
    status?: string
    packageId?: string
    notes?: string
  }) => {
    await database.write(async () => {
      await bookingsCollection.create(booking => {
        booking.clientId = data.clientId
        booking.trainerId = data.trainerId
        booking.sessionDate = data.sessionDate
        booking.sessionTime = data.sessionTime
        booking.status = data.status || 'pending'
        booking.packageId = data.packageId
        booking.notes = data.notes
        ;(booking as any).syncStatus = 'created'
      })
    })
  },

  updateBooking: async (id: string, updates: Partial<{
    sessionDate: number
    sessionTime: string
    status: string
    packageId: string
    notes: string
  }>) => {
    await database.write(async () => {
      const booking = await bookingsCollection.find(id)
      await booking.update(record => {
        Object.assign(record, updates)
        // Mark as needing sync to server if not already synced
        if ((record as any).syncStatus === 'synced') {
          ;(record as any).syncStatus = 'updated'
        }
      })
    })
  },

  confirmBooking: async (id: string) => {
    await database.write(async () => {
      const booking = await bookingsCollection.find(id)
      await booking.update(record => {
        record.status = 'confirmed'
        // Mark as needing sync to server if not already synced
        if ((record as any).syncStatus === 'synced') {
          ;(record as any).syncStatus = 'updated'
        }
      })
    })
  },

  declineBooking: async (id: string) => {
    await database.write(async () => {
      const booking = await bookingsCollection.find(id)
      await booking.update(record => {
        record.status = 'declined'
        // Mark as needing sync to server if not already synced
        if ((record as any).syncStatus === 'synced') {
          ;(record as any).syncStatus = 'updated'
        }
      })
    })
  },

  cancelBooking: async (id: string) => {
    await database.write(async () => {
      const booking = await bookingsCollection.find(id)
      await booking.update(record => {
        record.status = 'cancelled'
        // Mark as needing sync to server if not already synced
        if ((record as any).syncStatus === 'synced') {
          ;(record as any).syncStatus = 'updated'
        }
      })
    })
  },

  deleteBooking: async (id: string) => {
    await database.write(async () => {
      const booking = await bookingsCollection.find(id)
      await booking.update(record => {
        record.deletedAt = Date.now()
        // Mark as needing sync to server
        ;(record as any).syncStatus = 'deleted'
      })
    })
  },
}
