import { Resend } from "resend";

export const sendEmail = async (
    to: string,
    subject: string,
    template: React.ReactNode,
    text = 'Next Pizza Bestellung'
) => {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
        throw new Error('RESEND_API_KEY is not configured');
    }

    const resend = new Resend(apiKey);

    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to,
      subject,
      text,
      react: template,
    });

    if (error) {
        throw new Error(`[Resend] ${error.name}: ${error.message}`, { cause: error });
    }

    return data;
};
