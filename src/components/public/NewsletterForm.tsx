"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Loader2 } from "lucide-react";
import { newsletterSchema, type NewsletterInput } from "@/lib/validations/forms";
import { TurnstileWidget } from "./TurnstileWidget";
import { cn } from "@/lib/utils";

export function NewsletterForm({ className }: { className?: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<NewsletterInput>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { consent: undefined },
  });

  const onSubmit = async (data: NewsletterInput) => {
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMessage(result.error || "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
      reset();
    } catch {
      setStatus("error");
      setErrorMessage("Unable to subscribe. Please try again later.");
    }
  };

  return (
    <div id="newsletter" className={cn("rounded-brand-lg bg-white p-8 shadow-brand", className)}>
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center py-8 text-center"
          >
            <CheckCircle className="mb-4 h-12 w-12 text-brand-green" aria-hidden="true" />
            <h3 className="font-display text-xl font-bold text-brand-navy">You&apos;re subscribed!</h3>
            <p className="mt-2 text-sm text-brand-grey">
              Thank you for joining our community. Check your email for confirmation.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            <div>
              <h3 className="font-display text-xl font-bold text-brand-navy">Stay Connected</h3>
              <p className="mt-1 text-sm text-brand-grey">
                Subscribe to receive updates on programmes, events, and opportunities.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="newsletter-firstName" className="mb-1 block text-sm font-medium text-brand-text">
                  First name
                </label>
                <input
                  id="newsletter-firstName"
                  type="text"
                  {...register("firstName")}
                  className="w-full rounded-lg border border-brand-border px-4 py-2.5 text-sm focus:border-brand-navy focus:outline-none"
                  aria-invalid={!!errors.firstName}
                />
                {errors.firstName && (
                  <p className="mt-1 text-xs text-red-600" role="alert">{errors.firstName.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="newsletter-email" className="mb-1 block text-sm font-medium text-brand-text">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  {...register("email")}
                  className="w-full rounded-lg border border-brand-border px-4 py-2.5 text-sm focus:border-brand-navy focus:outline-none"
                  aria-invalid={!!errors.email}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600" role="alert">{errors.email.message}</p>
                )}
              </div>
            </div>

            <label className="flex items-start gap-2 text-sm text-brand-grey">
              <input type="checkbox" {...register("consent")} className="mt-1" />
              <span>I agree to receive newsletter updates from EduLead Network and understand I can unsubscribe at any time.</span>
            </label>
            {errors.consent && (
              <p className="text-xs text-red-600" role="alert">{errors.consent.message}</p>
            )}

            <TurnstileWidget onVerify={(token) => setValue("turnstileToken", token)} />

            {errorMessage && (
              <p className="text-sm text-red-600" role="alert">{errorMessage}</p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="btn-primary w-full sm:w-auto"
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Subscribing…
                </>
              ) : (
                "Subscribe"
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
