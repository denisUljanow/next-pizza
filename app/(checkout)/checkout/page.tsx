'use client';

import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";

import { Container, Title } from "@/shared/components/shared";
import { useCart } from "@/shared/hooks/use-cart";
import { CheckoutAddressForm, CheckoutCart, CheckoutFormSchema, CheckoutPersonalForm, CheckoutSidebar } from "@/shared/components/shared/checkout";
import { CheckoutFormValues } from "@/shared/components/shared/checkout/checkout-form-schema";
import { createOrder } from "@/app/actions";
import toast from "react-hot-toast";
import React from "react";

export default function CheckoutPage() {
    const [submitting, setSubmitting] = React.useState(false);
    const { totalAmount, items, removeCartItem, onClickCountButton } = useCart();
    const form = useForm<CheckoutFormValues>({
        resolver: zodResolver(CheckoutFormSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            address: '',
            comment: '',
        },
    });

    const onSubmit = async (data: CheckoutFormValues) => {
        try {
            setSubmitting(true);
            const url = await createOrder(data) as string | undefined;

            toast.success('Bestellung erfolgreich erstellt! Weiterleitung zur Zahlungsseite...', {
                icon: '✅',
            });

            if (url) {
                window.location.href = url;
            }

        } catch (error) {
            console.log(error);
            setSubmitting(false);
            toast.error('Fehler beim Erstellen der Bestellung. Bitte versuchen Sie es erneut.', {
                icon: '❌',
            });
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Container className="mt-10">
            <Title text="Bestellung-Formular" className="font-extrabold mb-8 text-[36px]" />
            
            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="flex gap-10">
                    {/* Left side */}
                        <div className="flex flex-col gap-10 flex-1 mb-20">
                            
                            <CheckoutCart 
                                items={items} 
                                onClickCountButton={onClickCountButton} 
                                removeCartItem={removeCartItem} 
                            />

                            <CheckoutPersonalForm />

                            <CheckoutAddressForm />
                        </div>

                        {/* Right side */}
                        <div className="w-[450px]">
                            <CheckoutSidebar submitting={submitting} totalAmount={totalAmount} />
                        </div>
                    </div>
                </form>
            </FormProvider>

        </Container>
    );
}
