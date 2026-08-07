"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { loginAdmin } from "@/features/auth/actions";
import { Lock, ArrowRight, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const res = await loginAdmin(password);
      if (res.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError("An unexpected network error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative overflow-hidden">
      {/* Dynamic backdrop gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" aria-hidden="true" />
      
      <Card className="w-full max-w-md border border-border/60 bg-muted/10 backdrop-blur-md relative z-10 shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4" aria-hidden="true">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Admin Authentication</CardTitle>
          <CardDescription>
            Enter your admin credential password to manage the portfolio database.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-start gap-2.5 p-3 rounded-lg text-xs border bg-destructive/10 border-destructive/30 text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0 text-destructive" />
                <span>{error}</span>
              </div>
            )}
            
            <FormField label="Admin Password" id="password">
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background/50 border-border/60 focus:ring-1 focus:ring-primary"
                required
              />
            </FormField>
            
            <Button type="submit" disabled={isLoading} className="w-full cursor-pointer mt-2">
              {isLoading ? "Authenticating..." : "Login"}
              <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
