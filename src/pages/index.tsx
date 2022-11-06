import { zodResolver } from '@hookform/resolvers/zod'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { trpc } from '../utils/trpc'

const Home = () => {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">Home</h1>
      {session ? (
        <>
          <GuestbookForm />
          <div className="flex gap-4">
            <p>Signed in as {session.user?.email}</p>
            <button
              onClick={() => {
                signOut()
              }}
              className="w-fit rounded-lg bg-error-500 px-2 py-1 hover:bg-error-600"
            >
              Sign out
            </button>
          </div>
        </>
      ) : (
        <button
          onClick={() => signIn('discord')}
          className="w-fit rounded-lg bg-primary-500 px-2 py-1 hover:bg-primary-600"
        >
          Sign in
        </button>
      )}
      <Messages />
    </main>
  )
}

export default Home

const Messages = () => {
  const { data: messages, isLoading } = trpc.guestbook.getAll.useQuery()

  if (isLoading) return <div>Fetching messages...</div>

  return (
    <div className="flex flex-col">
      {messages?.map((msg) => {
        return (
          <div key={msg.id}>
            <p>{msg.message}</p>
            <span>- {msg.name}</span>
          </div>
        )
      })}
    </div>
  )
}

export const guestbookInput = z.object({
  name: z.string().min(2),
  message: z.string().min(2, 'Message must be at least 2 characters'),
})

export type GuestbookFormValues = z.infer<typeof guestbookInput>

const GuestbookForm = () => {
  const { data: session } = useSession()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GuestbookFormValues>({
    resolver: zodResolver(guestbookInput),
    defaultValues: { name: session?.user?.name ?? undefined },
  })

  const onSubmit = async (data: GuestbookFormValues) => {
    await postMessage.mutateAsync(data)
  }

  const utils = trpc.useContext()
  const postMessage = trpc.guestbook.postMessage.useMutation({
    onMutate: async (newMessage) => {
      await utils.guestbook.getAll.cancel()
      const optimisticMessage = [
        { ...newMessage, id: Math.random().toString() },
        ...(utils.guestbook.getAll.getData() ?? []),
      ]

      if (optimisticMessage) {
        utils.guestbook.getAll.setData(optimisticMessage)
      }
    },
    onSettled: () => {
      utils.guestbook.getAll.invalidate()
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
      <label htmlFor="message">Message</label>
      {errors.message && <p>{errors.message.message}</p>}
      <input
        type="text"
        className="rounded-lg px-2 text-black"
        {...register('message')}
      />
      <button
        className="max-w-fit self-end rounded-lg bg-primary-500 px-2 py-1 hover:bg-primary-600"
        type="submit"
      >
        Send
      </button>
    </form>
  )
}
