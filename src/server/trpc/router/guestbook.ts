import { guestbookInput } from '../../../pages'
import { protectedProcedure, publicProcedure, router } from '../trpc'

export const guestbookRouter = router({
  postMessage: protectedProcedure
    .input(guestbookInput)
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.guestbook.create({
          data: {
            name: input.name,
            message: input.message,
          },
          select: {
            id: true,
            name: true,
            message: true,
          },
        })
      } catch (error) {
        console.log(error)
      }
    }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.prisma.guestbook.findMany({
        select: {
          id: true,
          name: true,
          message: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    } catch (error) {
      console.log(error)
    }
  }),
})
