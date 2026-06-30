import {z} from 'zod';

export const CheckoutFormSchema = z.object({
    firstName: z.string().min(1, { message: 'Vorname ist erforderlich' }),
    lastName: z.string().min(1, { message: 'Nachname ist erforderlich' }),
    email: z.email({ message: 'Ungültige E-Mail-Adresse' }),
    phone: z.string().min(1, { message: 'Telefonnummer ist erforderlich' }),
    address: z.string().min(1, { message: 'Adresse ist erforderlich' }),
    comment: z.string().optional(),
});

export type CheckoutFormValues = z.infer<typeof CheckoutFormSchema>;
