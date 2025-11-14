import { database } from '@/lib/db'
import TrainerTestimonial from '@/lib/db/models/TrainerTestimonial'
import { Q } from '@nozbe/watermelondb'

const trainerTestimonialsCollection = database.collections.get<TrainerTestimonial>('trainer_testimonials')

export const trainerTestimonialRepository = {
  observeTrainerTestimonials: () => trainerTestimonialsCollection.query(Q.where('deleted_at', Q.eq(null))).observe(),

  observeTrainerTestimonial: (id: string) => trainerTestimonialsCollection.findAndObserve(id),

  observeTestimonialsByTrainer: (trainerId: string) =>
    trainerTestimonialsCollection.query(
      Q.where('trainer_id', trainerId),
      Q.where('deleted_at', Q.eq(null)),
      Q.where('is_active', true),
      Q.sortBy('created_at', Q.desc)
    ).observe(),

  createTrainerTestimonial: async (data: {
    trainerId: string
    clientName: string
    content: string
    rating: number
    isActive?: boolean
  }) => {
    await database.write(async () => {
      await trainerTestimonialsCollection.create(testimonial => {
        testimonial.trainerId = data.trainerId
        testimonial.clientName = data.clientName
        testimonial.content = data.content
        testimonial.rating = data.rating
        testimonial.isActive = data.isActive ?? true
      })
    })
  },

  updateTrainerTestimonial: async (id: string, updates: Partial<{
    clientName: string
    content: string
    rating: number
    isActive: boolean
  }>) => {
    await database.write(async () => {
      const testimonial = await trainerTestimonialsCollection.find(id)
      await testimonial.update(record => {
        Object.assign(record, updates)
      })
    })
  },

  deleteTrainerTestimonial: async (id: string) => {
    await database.write(async () => {
      const testimonial = await trainerTestimonialsCollection.find(id)
      await testimonial.update(record => {
        record.deletedAt = Date.now()
      })
    })
  },
}
