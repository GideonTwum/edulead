"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { CheckCircle, Loader2 } from "lucide-react";
import { eventRegistrationSchema, type EventRegistrationInput } from "@/lib/validations/forms";
import { TurnstileWidget } from "./TurnstileWidget";

interface EventRegistrationFormProps {
  eventId: string;
  eventTitle: string;
  eventDate?: string;
}

export function EventRegistrationForm({ eventId, eventTitle, eventDate }: EventRegistrationFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<EventRegistrationInput>({
    resolver: zodResolver(eventRegistrationSchema),
  });

  const onSubmit = async (data: EventRegistrationInput) => {
    setStatus("loading");
    try {
      const res = await fetch("/api/event-registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, eventId }),
      });
      const result = await res.json();
      if (!res.ok) { setStatus("error"); setErrorMessage(result.error); return; }
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMessage("Unable to register. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-brand-lg bg-white p-8 text-center shadow-brand">
        <CheckCircle className="mx-auto mb-4 h-10 w-10 text-brand-green" />
        <h3 className="font-display font-bold text-brand-navy">Registration Confirmed</h3>
        <p className="mt-2 text-sm text-brand-grey">Thank you for registering{eventDate ? ` for ${eventTitle} on ${eventDate}` : ` for ${eventTitle}`}.</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-brand-lg bg-white p-8 shadow-brand" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Full name *</label>
          <input {...register("fullName")} className="form-input" />
          {errors.fullName && <p className="form-error">{errors.fullName.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Email *</label>
          <input type="email" {...register("email")} className="form-input" />
          {errors.email && <p className="form-error">{errors.email.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Phone</label>
          <input {...register("phone")} className="form-input" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Country *</label>
          <input {...register("country")} className="form-input" />
          {errors.country && <p className="form-error">{errors.country.message}</p>}
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Institution</label>
        <input {...register("institution")} className="form-input" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Reason for attending *</label>
        <textarea rows={4} {...register("reason")} className="form-input resize-none" />
        {errors.reason && <p className="form-error">{errors.reason.message}</p>}
      </div>
      <label className="flex items-start gap-2 text-sm text-brand-grey">
        <input type="checkbox" {...register("consent")} className="mt-1" />
        <span>I agree to be contacted by EduLead Network regarding this event.</span>
      </label>
      {errors.consent && <p className="form-error">{errors.consent.message}</p>}
      <TurnstileWidget onVerify={(t) => setValue("turnstileToken", t)} />
      {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
      <button type="submit" disabled={status === "loading"} className="btn-primary">
        {status === "loading" ? <><Loader2 className="h-4 w-4 animate-spin" /> Registering…</> : "Register"}
      </button>
    </form>
  );
}
