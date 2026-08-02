"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Loader2 } from "lucide-react";
import { contactSchema, type ContactInput } from "@/lib/validations/forms";
import { ENQUIRY_TYPES } from "@/lib/constants";
import { TurnstileWidget } from "./TurnstileWidget";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactInput) => {
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMessage(result.error || "Something went wrong.");
        return;
      }

      setStatus("success");
      reset();
    } catch {
      setStatus("error");
      setErrorMessage("Unable to send message. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center rounded-brand-lg bg-white p-12 text-center shadow-brand"
      >
        <CheckCircle className="mb-4 h-12 w-12 text-brand-green" />
        <h3 className="font-display text-xl font-bold text-brand-navy">Message Sent</h3>
        <p className="mt-2 text-sm text-brand-grey">
          Thank you for reaching out. We will respond as soon as possible.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 rounded-brand-lg bg-white p-8 shadow-brand" noValidate>
      {Object.keys(errors).length > 0 && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700" role="alert">
          Please correct the errors below.
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="mb-1 block text-sm font-medium">Full name *</label>
          <input id="contact-name" {...register("fullName")} className="form-input" aria-invalid={!!errors.fullName} />
          {errors.fullName && <p className="form-error">{errors.fullName.message}</p>}
        </div>
        <div>
          <label htmlFor="contact-email" className="mb-1 block text-sm font-medium">Email *</label>
          <input id="contact-email" type="email" {...register("email")} className="form-input" aria-invalid={!!errors.email} />
          {errors.email && <p className="form-error">{errors.email.message}</p>}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-phone" className="mb-1 block text-sm font-medium">Phone</label>
          <input id="contact-phone" {...register("phone")} className="form-input" />
        </div>
        <div>
          <label htmlFor="contact-type" className="mb-1 block text-sm font-medium">Enquiry type *</label>
          <select id="contact-type" {...register("enquiryType")} className="form-input" aria-invalid={!!errors.enquiryType}>
            <option value="">Select type</option>
            {ENQUIRY_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          {errors.enquiryType && <p className="form-error">{errors.enquiryType.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="contact-subject" className="mb-1 block text-sm font-medium">Subject *</label>
        <input id="contact-subject" {...register("subject")} className="form-input" aria-invalid={!!errors.subject} />
        {errors.subject && <p className="form-error">{errors.subject.message}</p>}
      </div>

      <div>
        <label htmlFor="contact-message" className="mb-1 block text-sm font-medium">Message *</label>
        <textarea id="contact-message" rows={5} {...register("message")} className="form-input resize-none" aria-invalid={!!errors.message} />
        {errors.message && <p className="form-error">{errors.message.message}</p>}
      </div>

      <label className="flex items-start gap-2 text-sm text-brand-grey">
        <input type="checkbox" {...register("consent")} className="mt-1" />
        <span>I agree to be contacted by EduLead Network regarding my enquiry.</span>
      </label>
      {errors.consent && <p className="form-error">{errors.consent.message}</p>}

      <TurnstileWidget onVerify={(token) => setValue("turnstileToken", token)} />

      {errorMessage && <p className="text-sm text-red-600" role="alert">{errorMessage}</p>}

      <button type="submit" disabled={status === "loading"} className="btn-primary">
        {status === "loading" ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</> : "Send Message"}
      </button>
    </form>
  );
}
