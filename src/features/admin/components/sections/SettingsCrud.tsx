"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Profile } from "@/types/portfolio";
import { profileSchema, ProfileInput } from "../../types/adminTypes";
import { updateProfile } from "../../actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/ui/form-field";
import { Save, CheckCircle2, AlertCircle } from "lucide-react";

interface SettingsCrudProps {
  profile: Profile;
}

export function SettingsCrud({ profile }: SettingsCrudProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [result, setResult] = React.useState<{ success: boolean; message: string } | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile.name,
      title: profile.title,
      subtitle: profile.subtitle,
      bio: profile.bio,
      avatar: profile.avatar,
      email: profile.email,
      phone: profile.phone,
      location: profile.location,
      cvUrl: profile.cvUrl || "",
    },
  });

  const onSubmit = async (data: ProfileInput) => {
    setIsSubmitting(true);
    setResult(null);
    try {
      const response = await updateProfile(data);
      setResult(response);
    } catch (err) {
      setResult({ success: false, message: "A network connection error occurred." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border border-border/60 bg-muted/10 max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Profile Settings</CardTitle>
        <CardDescription>
          Modify personal info, title, and contact details shown in headers and footers.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {result && (
            <div
              className={`flex items-start gap-2.5 p-4 rounded-lg text-sm border ${
                result.success
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500 dark:text-emerald-400"
                  : "bg-destructive/10 border-destructive/30 text-destructive"
              }`}
            >
              {result.success ? (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
              ) : (
                <AlertCircle className="h-5 w-5 shrink-0 text-destructive" />
              )}
              <span>{result.message}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Full Name" id="name" error={errors.name?.message}>
              <Input id="name" {...register("name")} />
            </FormField>
            <FormField label="Title" id="title" error={errors.title?.message}>
              <Input id="title" placeholder="Senior Developer" {...register("title")} />
            </FormField>
          </div>

          <FormField label="Subtitle" id="subtitle" error={errors.subtitle?.message}>
            <Input id="subtitle" placeholder="Software Architect" {...register("subtitle")} />
          </FormField>

          <FormField label="Short Biography" id="bio" error={errors.bio?.message}>
            <Textarea id="bio" rows={4} {...register("bio")} />
          </FormField>

          <FormField label="Avatar Image URL" id="avatar" error={errors.avatar?.message}>
            <Input id="avatar" {...register("avatar")} />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Email" id="email" error={errors.email?.message}>
              <Input id="email" type="email" {...register("email")} />
            </FormField>
            <FormField label="Phone" id="phone" error={errors.phone?.message}>
              <Input id="phone" {...register("phone")} />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Location" id="location" error={errors.location?.message}>
              <Input id="location" placeholder="San Francisco, CA" {...register("location")} />
            </FormField>
            <FormField label="CV PDF URL" id="cvUrl" error={errors.cvUrl?.message}>
              <Input id="cvUrl" placeholder="#" {...register("cvUrl")} />
            </FormField>
          </div>

          <div className="pt-4 border-t border-border/20">
            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto cursor-pointer">
              <Save className="h-4 w-4" />
              {isSubmitting ? "Saving changes..." : "Save Settings"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
