"use server";

import * as z from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { RESERVED_SLUGS, SLUG_PATTERN } from "@/lib/slug";
import { signIn } from "@/auth";

const SignupSchema = z
  .object({
    businessName: z.string().trim().min(2, "Business name must be at least 2 characters."),
    slug: z
      .string()
      .trim()
      .toLowerCase()
      .min(3, "URL must be at least 3 characters.")
      .max(63, "URL must be at most 63 characters.")
      .regex(SLUG_PATTERN, "Use lowercase letters, numbers, and hyphens only."),
    email: z.email("Please enter a valid email.").trim().toLowerCase(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .regex(/[a-zA-Z]/, "Password must contain at least one letter.")
      .regex(/[0-9]/, "Password must contain at least one number."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type SignupState =
  | {
      errors?: {
        businessName?: string[];
        slug?: string[];
        email?: string[];
        password?: string[];
        confirmPassword?: string[];
      };
      message?: string;
    }
  | undefined;

export async function signup(
  _state: SignupState,
  formData: FormData,
): Promise<SignupState> {
  const validatedFields = SignupSchema.safeParse({
    businessName: formData.get("businessName"),
    slug: formData.get("slug"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!validatedFields.success) {
    return { errors: z.flattenError(validatedFields.error).fieldErrors };
  }

  const { businessName, slug, email, password } = validatedFields.data;

  if (RESERVED_SLUGS.has(slug)) {
    return { errors: { slug: ["This URL is reserved."] } };
  }

  const [existingBusiness, existingUser] = await Promise.all([
    prisma.business.findUnique({ where: { slug } }),
    prisma.user.findUnique({ where: { email } }),
  ]);

  if (existingBusiness) {
    return { errors: { slug: ["This URL is already taken."] } };
  }
  if (existingUser) {
    return { errors: { email: ["An account with this email already exists."] } };
  }

  const hashedPassword = await hashPassword(password);

  await prisma.business.create({
    data: {
      name: businessName,
      slug,
      users: {
        create: {
          email,
          password: hashedPassword,
        },
      },
    },
  });

  await signIn("credentials", {
    email,
    password,
    redirectTo: "/dashboard",
  });
}
