"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { Loader } from "lucide-react";
import { Icons } from "./icons";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [error, setError] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);

  const handleGoogleLogin = async () => {
    const supabase = createClient();
    setIsGoogleLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/oauth?next=/`,
        },
      });

      if (error) throw error;
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");

    }finally {
      setIsGoogleLoading(false);
    }
  };
  const handleGithubLogin = async () => {
    const supabase = createClient();
    setIsGithubLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/auth/oauth?next=/`,
        },
      });

      if (error) throw error;
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsGithubLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Welcome!</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            {error && <p className="text-sm text-destructive-500">{error}</p>}
            <Button
              className="w-full"
              disabled={isGoogleLoading}
              onClick={handleGoogleLogin}
            >
              {isGoogleLoading ? (
                <>
                  <Icons.spinner className="animate-spin size-4 mr-2" />
                  Logging in...
                </>
              ) : (
                <>
                  <Icons.google className="size-4 mr-2" />
                  Continue with Google
                </>
              )}
            </Button>
            <hr className="my-4" />
            <Button
              className="w-full"
              disabled={isGithubLoading}
              onClick={handleGithubLogin}
            >
              {isGithubLoading ? (
                <>
                  <Icons.spinner className="animate-spin size-4 mr-2" />
                  Logging in...
                </>
              ) : (
                <>
                  <Icons.gitHub className="size-4 mr-2" />
                  Continue with Github
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
