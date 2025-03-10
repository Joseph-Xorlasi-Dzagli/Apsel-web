import * as z from "zod";

export const businessProfileSchema = z.object({
  name: z.string().min(2, "Business name must be at least 2 characters"),
  industry: z.string().min(1, "Please select an industry"),
  employeeCount: z.string().min(1, "Please select company size"),
  bio: z
    .string()
    .min(10, "Bio must be at least 10 characters")
    .max(500, "Bio must be less than 500 characters"),
});

export const businessContactSchema = z.object({
  manager: z.string().min(2, "Manager name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
});

export const paymentAccountSchema = z.object({
  cardHolderName: z
    .string()
    .min(3, "Card holder name must be at least 3 characters"),
  cardNumber: z
    .string()
    .regex(/^\d{16}$/, "Card number must be 16 digits")
    .or(
      z
        .string()
        .regex(
          /^\d{4} \d{4} \d{4} \d{4}$/,
          "Format must be XXXX XXXX XXXX XXXX"
        )
    ),
  expiryDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, "Format must be MM/YY")
    .refine((value) => {
      const [month, year] = value.split("/");
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;
      const numYear = parseInt(year, 10);
      const numMonth = parseInt(month, 10);

      return (
        numYear > currentYear ||
        (numYear === currentYear && numMonth >= currentMonth)
      );
    }, "Card expiration date must be in the future"),
  cvv: z.string().regex(/^\d{3,4}$/, "CVV must be 3 or 4 digits"),
});

export const businessAddressSchema = z.object({
  street: z.string().min(5, "Street address must be at least 5 characters"),
  country: z.string().min(2, "Country must be at least 2 characters"),
  postalCode: z.string().min(3, "Postal code must be at least 3 characters"),
  region: z.string().min(2, "Region must be at least 2 characters"),
});

export type BusinessProfileForm = z.infer<typeof businessProfileSchema>;
export type BusinessContactForm = z.infer<typeof businessContactSchema>;
export type PaymentAccountForm = z.infer<typeof paymentAccountSchema>;
export type BusinessAddressForm = z.infer<typeof businessAddressSchema>;
