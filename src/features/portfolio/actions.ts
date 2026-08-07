"use server";

import { readJsonData, writeJsonData } from "@/services/jsonDb";
import { contactSchema, ContactInput } from "./types/portfolioTypes";

interface ContactConfig {
  email: string;
  phone: string;
  address: string;
  availability: string;
  messages: Array<{
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    date: string;
  }>;
}

/**
 * Validates and saves a contact form submission into contact.json database file.
 */
export async function submitContactForm(data: ContactInput) {
  const result = contactSchema.safeParse(data);
  
  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }

  try {
    const contactConfig = await readJsonData<ContactConfig>("contact.json", {
      email: "abdul.askar@example.com",
      phone: "+1 (555) 019-2834",
      address: "San Francisco, CA",
      availability: "Open for full-time roles & freelance consultancies",
      messages: [],
    });

    const newMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...result.data,
      date: new Date().toISOString(),
    };

    if (!contactConfig.messages) {
      contactConfig.messages = [];
    }

    contactConfig.messages.push(newMessage);
    await writeJsonData("contact.json", contactConfig);

    return {
      success: true,
      message: "Thank you! Your message has been sent successfully.",
    };
  } catch (error) {
    console.error("Failed to write contact message:", error);
    return {
      success: false,
      message: "An unexpected database error occurred. Please try again.",
    };
  }
}
