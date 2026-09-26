"use client";

import { useState } from "react";
import { BrandMark } from "./brand-mark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

interface AuthDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

export function AuthDialog({ open, onOpenChange, trigger }: AuthDialogProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  const signIn = async () => {
    setLoading(true);
    setNotice("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setNotice(error.message);
    } else {
      setNotice("Signed in successfully.");
      onOpenChange?.(false);
    }
  };

  const signUp = async () => {
    setLoading(true);
    setNotice("");
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    });
    setLoading(false);
    if (error) {
      setNotice(error.message);
    } else {
      setNotice("Check your email to confirm your account.");
    }
  };

  const google = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) setNotice(result.error.message);
  };

  const isControlled = open !== undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {!isControlled && trigger && (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      )}
      <DialogContent className="glass-panel sm:max-w-sm">
        <DialogHeader className="items-center text-center">
          <BrandMark className="mb-2 size-12" />
          <DialogTitle className="font-heading text-2xl">Welcome to EchoGPT</DialogTitle>
          <DialogDescription>Sign in to sync conversations across devices.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Button variant="outline" className="h-11 w-full" onClick={google}>
            Continue with Google
          </Button>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            or use email
            <span className="h-px flex-1 bg-border" />
          </div>
          <Input
            aria-label="Email address"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            aria-label="Password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={signIn} disabled={loading}>
              Sign in
            </Button>
            <Button variant="outline" onClick={signUp} disabled={loading}>
              Create account
            </Button>
          </div>
          {notice && (
            <p aria-live="polite" className="text-sm text-muted-foreground">
              {notice}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
