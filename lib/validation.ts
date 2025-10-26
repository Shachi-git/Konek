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

export const signUpSchema = z.object({
  name: z.string().min(3, "Full Name must be at least 3 characters").max(100),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  email: z.string().email("Invalid email address"),
  bio: z.string().max(500).optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  image: z
    .any()
    .refine((file) => file instanceof File, "Profile image is required")
    .refine(
      (file) =>
        file instanceof File &&
        ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp'].includes(file.type),
      "Unsupported file type. Allowed: jpg, png, gif, svg, webp"
    )
    .refine(
      (file) => file instanceof File && file.size <= 5 * 1024 * 1024, // 5 MB limit
      "File size must be less than 5MB"
    ),
})