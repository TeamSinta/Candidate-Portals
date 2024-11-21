"use server";

import { type SendVerificationRequestParams } from "next-auth/providers/email";
import { resend } from "@/server/resend";
import { siteConfig } from "@/config/site";
import { siteUrls } from "@/config/urls";

interface SendVerificationEmailProps {
    params: SendVerificationRequestParams;
}

// Send a verification email to the user
export async function sendVerificationEmail({
    params,
}: SendVerificationEmailProps) {
    try {
        // Send email to user via resend
        await resend.emails.send({
            from: siteConfig.noReplyEmail,
            to: params.identifier,
            subject: `Verify | Sign into ${siteConfig.name}`,
            html: `
         <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 40px; background-color: #ffffff;">
          <div style="margin-bottom: 30px; text-align: start;">
            <a href="${siteUrls.teamsinta}" style="text-decoration: none;">
              <div style="display: inline-block; padding: 15px; border-radius: 20%; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); background-color: #f4f4f4;">
                <img src="https://cdn.prod.website-files.com/6457f112b965721ffc2b0777/653e865d87d06c306e2b5147_Group%201321316944.png" alt="${siteConfig.name} Logo" style="width: 80px; height: 80px;" />
              </div>
            </a>
          </div>
          <h1 style="color: #000000; font-size: 26px; font-weight: bold; margin-bottom: 10px; text-align: start;">
            Sign in to ${siteConfig.name}
          </h1>
          <p style="color: #666; font-size: 16px; margin-bottom: 30px; text-align: start;">
            Click the button below to securely sign in. This button will expire in 20 minutes.
          </p>
          <div style="margin-bottom: 30px; text-align: start;">
            <a href="${params.url}" style="background-color: #6c5ce7; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 5px; font-size: 18px; font-weight: bold; display: inline-block; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);">
              Sign In to ${siteConfig.name}
            </a>
          </div>
          <p style="color: #999; font-size: 14px; margin-bottom: 20px; text-align: start;">
            Button not showing? <a href="${params.url}" style="color: #6c5ce7; text-decoration: underline;">Click here</a>
          </p>
          <p style="color: #999; font-size: 14px; text-align: start;">
            Confirming this request will securely log you in using <span style="color: #6c5ce7;">${params.identifier}</span>.
          </p>
        </div>
      `,
            text: `Sign in to ${siteConfig.name} using this link: ${params.url}`,
            tags: [
                {
                    name: "category",
                    value: "confirm_email",
                },
            ],
        });
    } catch (error) {
        throw new Error("Failed to send verification email");
    }
}
