import {z} from 'zod'

export const formSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(20).max(500),
  category: z.string().min(3).max(20),
  link: z
    .string()
    .url()
  .refine(url => /\.(jpg|jpeg|png|gif|svg|webp)$/.test(url.toLowerCase()), {
     message: "URL does not seem to be an image",
  }),
  pitch: z.string().min(10)
})