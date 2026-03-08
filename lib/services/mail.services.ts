import { EmailTemplate } from "@/components/email-template";
import { Resend } from "resend";
import { render } from "@react-email/render";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendInviteEmail({
  email,
  inviteToken,
  inviterName,
}: {
  email: string;
  inviteToken: string;
  inviterName: string;
}) {
  try {
    console.log("Attempting to send invite email:", {
      email,
      inviterName,
      hasApiKey: !!process.env.RESEND_API_KEY,
    });

    const { data, error } = await resend.emails.send({
      from: "TEDx New Cairo STEM Youth <no-reply@updates.rashadhussein.com>",
      to: [email],
      subject: "You've been invited to join CommitHub",
      html: await render(
        EmailTemplate({ firstName: inviterName, inviteToken }),
      ),
    });

    if (error) {
      console.error("Resend API error:", error);
      return Response.json({ error }, { status: 500 });
    }

    console.log("Email sent successfully:", data);
    return Response.json(data);
  } catch (error) {
    console.error("Error sending email:", error);
    return Response.json({ error }, { status: 500 });
  }
}
