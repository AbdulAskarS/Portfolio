"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { submitContactForm } from "../actions";
import { contactSchema, ContactInput } from "../types/portfolioTypes";

export function useContact() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitResult, setSubmitResult] = React.useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const form = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactInput) => {
    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      const response = await submitContactForm(data);
      if (response.success) {
        setSubmitResult({ success: true, message: response.message || "Message sent successfully!" });
        form.reset();
      } else {
        if (response.errors) {
          // Set validation errors on specific fields
          Object.entries(response.errors).forEach(([field, messages]) => {
            if (messages && messages.length > 0) {
              form.setError(field as keyof ContactInput, {
                type: "server",
                message: messages[0],
              });
            }
          });
          setSubmitResult({
            success: false,
            message: "Validation failed. Please verify your inputs.",
          });
        } else {
          setSubmitResult({
            success: false,
            message: response.message || "An unexpected error occurred.",
          });
        }
      }
    } catch (err) {
      setSubmitResult({
        success: false,
        message: "Failed to connect to the server. Please check your internet connection.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    submitResult,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
