"use server";

import * as z from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { RESERVED_SUBDOMAINS, SUBDOMAIN_PATTERN } from "@/lib/subdomain";
import { signIn } from "@/auth";
import { BusinessType } from "@/lib/generated/prisma/enums";

const SignupSchema = z
  .object({
    businessName: z.string().trim().min(2, "Business name must be at least 2 characters."),
    subdomain: z
      .string()
      .trim()
      .toLowerCase()
      .min(3, "Domain must be at least 3 characters.")
      .max(63, "Domain must be at most 63 characters.")
      .regex(
        SUBDOMAIN_PATTERN,
        "Use lowercase letters, numbers, and hyphens only.",
      ),
    businessType: z.enum(BusinessType, "Choose a business type."),
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
        subdomain?: string[];
        businessType?: string[];
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
    subdomain: formData.get("subdomain"),
    businessType: formData.get("businessType"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!validatedFields.success) {
    return { errors: z.flattenError(validatedFields.error).fieldErrors };
  }

  const { businessName, subdomain, businessType, email, password } = validatedFields.data;

  if (RESERVED_SUBDOMAINS.has(subdomain)) {
    return { errors: { subdomain: ["This domain is reserved."] } };
  }

  const [existingBusiness, existingUser] = await Promise.all([
    prisma.business.findUnique({ where: { subdomain } }),
    prisma.user.findUnique({ where: { email } }),
  ]);

  if (existingBusiness) {
    return { errors: { subdomain: ["This domain is already taken."] } };
  }
  if (existingUser) {
    return { errors: { email: ["An account with this email already exists."] } };
  }

  const hashedPassword = await hashPassword(password);

  await prisma.business.create({
    data: {
      name: businessName,
      subdomain,
      businessType,
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
