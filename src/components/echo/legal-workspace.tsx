"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import {
  ClipboardList,
  ShieldCheck,
  ArrowLeft,
  Menu,
  Sparkles,
  Lock,
  FileText,
  UserCheck,
  Scale,
  CreditCard,
  AlertTriangle,
  Mail,
  ShieldAlert,
  Server,
  Globe,
  Database,
  Eye,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SidebarNav, type ThreadSummary } from "./sidebar-nav";
import { supabase } from "@/integrations/supabase/client";

interface LegalWorkspaceProps {
  activeDocument: "terms-of-use" | "privacy-policy";
}

export function LegalWorkspace({ activeDocument }: LegalWorkspaceProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [threads, setThreads] = useState<ThreadSummary[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Auth synchronization
  useEffect(() => {
    let active = true;
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (active) setUser(data.user);
    };
    void loadUser();
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  // Supabase threads loader
  useEffect(() => {
    let ignore = false;
    if (!user) {
      Promise.resolve().then(() => {
        if (!ignore) setThreads([]);
      });
      return () => {
        ignore = true;
      };
    }
    void supabase
      .from("threads")
      .select("id,title,updated_at")
      .order("updated_at", { ascending: false })
      .limit(50)
      .then(({ data }) => {
        if (!ignore) setThreads(data ?? []);
      });
    return () => {
      ignore = true;
    };
  }, [user]);

  const isTerms = activeDocument === "terms-of-use";

  return (
    <div className="soft-grid flex h-dvh min-w-0 bg-background text-foreground">
      {/* Sidebar Navigation */}
      <aside className="hidden w-72 shrink-0 lg:block">
        <SidebarNav threads={threads} user={user} />
      </aside>

      {/* Main Content Area */}
      <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Mobile Navigation Trigger */}
        <div className="absolute top-3.5 left-3.5 z-30 lg:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                aria-label="Open navigation"
                variant="outline"
                size="icon"
                className="size-9 rounded-xl bg-background/85 backdrop-blur-md border-border/80 shadow-xs hover:bg-accent cursor-pointer"
              >
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-[85vw] max-w-[320px] sm:max-w-xs p-0 border-r border-border [&>button:last-child]:hidden"
            >
              <SheetHeader className="sr-only">
                <SheetTitle>Navigation</SheetTitle>
                <SheetDescription>Conversation history and legal documentation</SheetDescription>
              </SheetHeader>
              <SidebarNav
                threads={threads}
                user={user}
                onSelect={() => setMobileOpen(false)}
                onClose={() => setMobileOpen(false)}
              />
            </SheetContent>
          </Sheet>
        </div>

        {/* Scrollable Document Container */}
        <div className="flex-1 overflow-y-auto px-4 py-8 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-3xl">
            {/* Top Bar: Back button & Document Switcher Tabs */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-2 sm:pt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/")}
                className="w-fit gap-2 text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer rounded-xl -ml-2"
              >
                <ArrowLeft className="size-4" />
                Back to Chat
              </Button>

              {/* Document Switcher Pill Tabs */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/60 border border-border/60 backdrop-blur-xs self-start sm:self-auto">
                <Link
                  href="/terms-of-use"
                  className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                    isTerms
                      ? "bg-background text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <ClipboardList className="size-3.5" />
                  Terms of Use
                </Link>
                <Link
                  href="/privacy-policy"
                  className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                    !isTerms
                      ? "bg-background text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <ShieldCheck className="size-3.5" />
                  Privacy Policy
                </Link>
              </div>
            </div>

            {/* Document Header */}
            <div className="mb-10 text-center sm:text-left border-b border-border/60 pb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 mb-3">
                {isTerms ? <ClipboardList className="size-3.5" /> : <ShieldCheck className="size-3.5" />}
                <span>EchoGPT Legal Documentation</span>
              </div>
              <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {isTerms ? "Terms of Use" : "Privacy Policy"}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="font-medium">Last updated: 9/26/2026</span>
                <span>•</span>
                <span>Official Policy</span>
                <span>•</span>
                <span>EchoGPT Platform</span>
              </div>
            </div>

            {/* Document Content */}
            {isTerms ? <TermsOfUseContent /> : <PrivacyPolicyContent />}

            {/* Support / Contact Footer */}
            <div className="mt-12 rounded-2xl border border-border/80 bg-accent/30 p-6 sm:p-8 backdrop-blur-xs text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-foreground">Need legal clarifications?</h3>
                <p className="text-xs text-muted-foreground max-w-md">
                  Our compliance and support team is here to assist with any questions regarding our terms or privacy practices.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/")}
                className="gap-2 rounded-xl border-border/80 bg-background/80 hover:bg-background cursor-pointer"
              >
                <Mail className="size-3.5" />
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function TermsOfUseContent() {
  return (
    <div className="space-y-8 text-foreground/90 text-sm leading-relaxed">
      {/* Acceptance of Terms */}
      <section className="rounded-2xl border border-border/70 bg-card/60 p-6 backdrop-blur-xs space-y-2">
        <h2 className="text-base font-semibold text-foreground flex items-center gap-2.5">
          <CheckCircle2 className="size-4 text-primary shrink-0" />
          Acceptance of Terms
        </h2>
        <p className="text-muted-foreground">
          By accessing and using EchoGPT, you accept and agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use our service.
        </p>
      </section>

      {/* Description of Service */}
      <section className="rounded-2xl border border-border/70 bg-card/60 p-6 backdrop-blur-xs space-y-2">
        <h2 className="text-base font-semibold text-foreground flex items-center gap-2.5">
          <Sparkles className="size-4 text-primary shrink-0" />
          Description of Service
        </h2>
        <p className="text-muted-foreground">
          EchoGPT provides an AI-powered conversational interface that allows users to interact with various language models. Our service includes features such as chat functionality, web page summarization, content explanation, and integration with multiple AI models.
        </p>
      </section>

      {/* User Accounts */}
      <section className="rounded-2xl border border-border/70 bg-card/60 p-6 backdrop-blur-xs space-y-4">
        <h2 className="text-base font-semibold text-foreground flex items-center gap-2.5">
          <UserCheck className="size-4 text-primary shrink-0" />
          User Accounts
        </h2>
        <div className="space-y-3">
          <div>
            <h3 className="font-medium text-foreground text-sm">Registration</h3>
            <p className="text-muted-foreground mt-1">
              You must create an account to access our service. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate.
            </p>
          </div>
          <div className="border-t border-border/50 pt-3">
            <h3 className="font-medium text-foreground text-sm">Account Security</h3>
            <p className="text-muted-foreground mt-1">
              You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
            </p>
          </div>
        </div>
      </section>

      {/* Acceptable Use */}
      <section className="rounded-2xl border border-border/70 bg-card/60 p-6 backdrop-blur-xs space-y-3">
        <h2 className="text-base font-semibold text-foreground flex items-center gap-2.5">
          <ShieldAlert className="size-4 text-primary shrink-0" />
          Acceptable Use
        </h2>
        <p className="text-muted-foreground">You agree not to use EchoGPT to:</p>
        <ul className="grid gap-2 sm:grid-cols-2 pt-1">
          {[
            "Violate any applicable laws or regulations",
            "Generate or distribute harmful, illegal, or offensive content",
            "Attempt to gain unauthorized access to our systems",
            "Interfere with or disrupt the service or servers",
            "Impersonate any person or entity",
            "Collect or harvest personal information from other users",
            "Use the service for any commercial purpose without authorization",
          ].map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-2 rounded-xl bg-muted/40 p-2.5 text-xs text-muted-foreground border border-border/40"
            >
              <span className="size-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Intellectual Property */}
      <section className="rounded-2xl border border-border/70 bg-card/60 p-6 backdrop-blur-xs space-y-4">
        <h2 className="text-base font-semibold text-foreground flex items-center gap-2.5">
          <Scale className="size-4 text-primary shrink-0" />
          Intellectual Property
        </h2>
        <div className="space-y-3">
          <div>
            <h3 className="font-medium text-foreground text-sm">Service Content</h3>
            <p className="text-muted-foreground mt-1">
              All content, features, and functionality of EchoGPT, including but not limited to text, graphics, logos, and software, are owned by us or our licensors and are protected by copyright, trademark, and other intellectual property laws.
            </p>
          </div>
          <div className="border-t border-border/50 pt-3">
            <h3 className="font-medium text-foreground text-sm">User Content</h3>
            <p className="text-muted-foreground mt-1">
              You retain ownership of content you submit to our service. By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, and process your content solely to provide and improve our service.
            </p>
          </div>
        </div>
      </section>

      {/* Subscription and Payment */}
      <section className="rounded-2xl border border-border/70 bg-card/60 p-6 backdrop-blur-xs space-y-2">
        <h2 className="text-base font-semibold text-foreground flex items-center gap-2.5">
          <CreditCard className="size-4 text-primary shrink-0" />
          Subscription and Payment
        </h2>
        <p className="text-muted-foreground">
          Some features of EchoGPT may require a paid subscription. Subscription fees are charged in advance and are non-refundable except as required by law. We reserve the right to change our pricing with reasonable notice.
        </p>
      </section>

      {/* Service Availability */}
      <section className="rounded-2xl border border-border/70 bg-card/60 p-6 backdrop-blur-xs space-y-2">
        <h2 className="text-base font-semibold text-foreground flex items-center gap-2.5">
          <Server className="size-4 text-primary shrink-0" />
          Service Availability
        </h2>
        <p className="text-muted-foreground">
          We strive to maintain high service availability but do not guarantee uninterrupted access. The service may be temporarily unavailable due to maintenance, updates, or circumstances beyond our control.
        </p>
      </section>

      {/* Disclaimers */}
      <section className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 backdrop-blur-xs space-y-2">
        <h2 className="text-base font-semibold text-foreground flex items-center gap-2.5">
          <AlertTriangle className="size-4 text-amber-500 shrink-0" />
          Disclaimers
        </h2>
        <p className="text-muted-foreground">
          EchoGPT is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties of any kind, either express or implied. We do not warrant that the service will be error-free, secure, or uninterrupted. AI-generated content may contain inaccuracies, and you should verify important information independently.
        </p>
      </section>

      {/* Limitation of Liability */}
      <section className="rounded-2xl border border-border/70 bg-card/60 p-6 backdrop-blur-xs space-y-2">
        <h2 className="text-base font-semibold text-foreground flex items-center gap-2.5">
          <Lock className="size-4 text-primary shrink-0" />
          Limitation of Liability
        </h2>
        <p className="text-muted-foreground">
          To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses.
        </p>
      </section>

      {/* Indemnification */}
      <section className="rounded-2xl border border-border/70 bg-card/60 p-6 backdrop-blur-xs space-y-2">
        <h2 className="text-base font-semibold text-foreground flex items-center gap-2.5">
          <FileText className="size-4 text-primary shrink-0" />
          Indemnification
        </h2>
        <p className="text-muted-foreground">
          You agree to indemnify and hold harmless EchoGPT and its affiliates from any claims, damages, losses, liabilities, and expenses arising from your use of the service or violation of these terms.
        </p>
      </section>

      {/* Termination */}
      <section className="rounded-2xl border border-border/70 bg-card/60 p-6 backdrop-blur-xs space-y-2">
        <h2 className="text-base font-semibold text-foreground flex items-center gap-2.5">
          <ShieldAlert className="size-4 text-primary shrink-0" />
          Termination
        </h2>
        <p className="text-muted-foreground">
          We reserve the right to suspend or terminate your account at any time for violation of these terms or for any other reason. You may terminate your account at any time by contacting us. Upon termination, your right to use the service will immediately cease.
        </p>
      </section>

      {/* Modifications to Terms */}
      <section className="rounded-2xl border border-border/70 bg-card/60 p-6 backdrop-blur-xs space-y-2">
        <h2 className="text-base font-semibold text-foreground flex items-center gap-2.5">
          <ClipboardList className="size-4 text-primary shrink-0" />
          Modifications to Terms
        </h2>
        <p className="text-muted-foreground">
          We reserve the right to modify these terms at any time. We will notify users of material changes by posting the updated terms on this page. Your continued use of the service after changes constitutes acceptance of the modified terms.
        </p>
      </section>

      {/* Governing Law */}
      <section className="rounded-2xl border border-border/70 bg-card/60 p-6 backdrop-blur-xs space-y-2">
        <h2 className="text-base font-semibold text-foreground flex items-center gap-2.5">
          <Globe className="size-4 text-primary shrink-0" />
          Governing Law
        </h2>
        <p className="text-muted-foreground">
          These terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law provisions.
        </p>
      </section>

      {/* Contact Information */}
      <section className="rounded-2xl border border-border/70 bg-card/60 p-6 backdrop-blur-xs space-y-2">
        <h2 className="text-base font-semibold text-foreground flex items-center gap-2.5">
          <Mail className="size-4 text-primary shrink-0" />
          Contact Information
        </h2>
        <p className="text-muted-foreground">
          If you have any questions about these Terms of Use, please contact us through our support channels.
        </p>
      </section>
    </div>
  );
}

function PrivacyPolicyContent() {
  return (
    <div className="space-y-8 text-foreground/90 text-sm leading-relaxed">
      {/* Introduction */}
      <section className="rounded-2xl border border-border/70 bg-card/60 p-6 backdrop-blur-xs space-y-2">
        <h2 className="text-base font-semibold text-foreground flex items-center gap-2.5">
          <CheckCircle2 className="size-4 text-primary shrink-0" />
          Introduction
        </h2>
        <p className="text-muted-foreground">
          Welcome to EchoGPT. We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you use our service.
        </p>
      </section>

      {/* Information We Collect */}
      <section className="rounded-2xl border border-border/70 bg-card/60 p-6 backdrop-blur-xs space-y-4">
        <h2 className="text-base font-semibold text-foreground flex items-center gap-2.5">
          <Database className="size-4 text-primary shrink-0" />
          Information We Collect
        </h2>
        <div className="space-y-3">
          <div>
            <h3 className="font-medium text-foreground text-sm">Account Information</h3>
            <p className="text-muted-foreground mt-1">
              When you create an account, we collect your email address, name, and authentication credentials.
            </p>
          </div>
          <div className="border-t border-border/50 pt-3">
            <h3 className="font-medium text-foreground text-sm">Usage Data</h3>
            <p className="text-muted-foreground mt-1">
              We collect information about your interactions with our service, including conversation history, selected AI models, and feature usage patterns to improve our service.
            </p>
          </div>
        </div>
      </section>

      {/* How We Use Your Information */}
      <section className="rounded-2xl border border-border/70 bg-card/60 p-6 backdrop-blur-xs space-y-3">
        <h2 className="text-base font-semibold text-foreground flex items-center gap-2.5">
          <Eye className="size-4 text-primary shrink-0" />
          How We Use Your Information
        </h2>
        <p className="text-muted-foreground">We use your information for the following core purposes:</p>
        <div className="grid gap-2 sm:grid-cols-2 pt-1">
          {[
            "To provide and maintain our service",
            "To authenticate and secure your account",
            "To improve and personalize your experience",
            "To communicate with you about service updates",
            "To comply with legal obligations",
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 rounded-xl bg-muted/40 p-2.5 text-xs text-muted-foreground border border-border/40"
            >
              <CheckCircle2 className="size-3.5 text-primary shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Data Security */}
      <section className="rounded-2xl border border-border/70 bg-card/60 p-6 backdrop-blur-xs space-y-2">
        <h2 className="text-base font-semibold text-foreground flex items-center gap-2.5">
          <Lock className="size-4 text-primary shrink-0" />
          Data Security
        </h2>
        <p className="text-muted-foreground">
          We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. All data transmissions are encrypted using industry-standard protocols.
        </p>
      </section>

      {/* Data Retention */}
      <section className="rounded-2xl border border-border/70 bg-card/60 p-6 backdrop-blur-xs space-y-2">
        <h2 className="text-base font-semibold text-foreground flex items-center gap-2.5">
          <Server className="size-4 text-primary shrink-0" />
          Data Retention
        </h2>
        <p className="text-muted-foreground">
          We retain your personal data for as long as necessary to provide our services and comply with legal obligations. You may request deletion of your account and associated data at any time.
        </p>
      </section>

      {/* Third-Party Services */}
      <section className="rounded-2xl border border-border/70 bg-card/60 p-6 backdrop-blur-xs space-y-2">
        <h2 className="text-base font-semibold text-foreground flex items-center gap-2.5">
          <Globe className="size-4 text-primary shrink-0" />
          Third-Party Services
        </h2>
        <p className="text-muted-foreground">
          Our service may integrate with third-party AI providers and authentication services. These providers have their own privacy policies governing the use of your information.
        </p>
      </section>

      {/* Your Rights */}
      <section className="rounded-2xl border border-primary/30 bg-primary/5 p-6 backdrop-blur-xs space-y-3">
        <h2 className="text-base font-semibold text-foreground flex items-center gap-2.5">
          <ShieldCheck className="size-4 text-primary shrink-0" />
          Your Rights
        </h2>
        <p className="text-muted-foreground">You have full rights over your data, including:</p>
        <div className="grid gap-2 sm:grid-cols-2 pt-1">
          {[
            "Access your personal data",
            "Request correction of inaccurate data",
            "Request deletion of your data",
            "Object to processing of your data",
            "Export your data",
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-2 rounded-xl bg-background/80 p-2.5 text-xs font-medium text-foreground border border-border/60 shadow-2xs"
            >
              <CheckCircle2 className="size-3.5 text-primary shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Cookies and Tracking */}
      <section className="rounded-2xl border border-border/70 bg-card/60 p-6 backdrop-blur-xs space-y-2">
        <h2 className="text-base font-semibold text-foreground flex items-center gap-2.5">
          <Eye className="size-4 text-primary shrink-0" />
          Cookies and Tracking
        </h2>
        <p className="text-muted-foreground">
          We use cookies and similar tracking technologies to maintain your session and improve your experience. You can control cookie settings through your browser preferences.
        </p>
      </section>

      {/* Children's Privacy */}
      <section className="rounded-2xl border border-border/70 bg-card/60 p-6 backdrop-blur-xs space-y-2">
        <h2 className="text-base font-semibold text-foreground flex items-center gap-2.5">
          <UserCheck className="size-4 text-primary shrink-0" />
          Children&apos;s Privacy
        </h2>
        <p className="text-muted-foreground">
          Our service is not intended for users under 13 years of age. We do not knowingly collect personal information from children under 13.
        </p>
      </section>

      {/* Changes to This Policy */}
      <section className="rounded-2xl border border-border/70 bg-card/60 p-6 backdrop-blur-xs space-y-2">
        <h2 className="text-base font-semibold text-foreground flex items-center gap-2.5">
          <ClipboardList className="size-4 text-primary shrink-0" />
          Changes to This Policy
        </h2>
        <p className="text-muted-foreground">
          We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the &ldquo;Last updated&rdquo; date.
        </p>
      </section>

      {/* Contact Us */}
      <section className="rounded-2xl border border-border/70 bg-card/60 p-6 backdrop-blur-xs space-y-2">
        <h2 className="text-base font-semibold text-foreground flex items-center gap-2.5">
          <Mail className="size-4 text-primary shrink-0" />
          Contact Us
        </h2>
        <p className="text-muted-foreground">
          If you have questions about this privacy policy or our data practices, please contact us through our support channels.
        </p>
      </section>
    </div>
  );
}
