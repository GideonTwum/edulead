"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { CheckCircle, Loader2 } from "lucide-react";
import { programmeInterestSchema, type ProgrammeInterestInput } from "@/lib/validations/forms";
import { TurnstileWidget } from "./TurnstileWidget";

interface ProgrammeInterestFormProps {
  programmeId: string;
  programmeTitle: string;
}

export function ProgrammeInterestForm({ programmeId, programmeTitle }: ProgrammeInterestFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ProgrammeInterestInput>({
    resolver: zodResolver(programmeInterestSchema),
  });

  const onSubmit = async (data: ProgrammeInterestInput) => {
    setStatus("loading");
    try {
      const res = await fetch("/api/programme-interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, programmeId }),
      });
      const result = await res.json();
      if (!res.ok) { setStatus("error"); setErrorMessage(result.error); return; }
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMessage("Unable to submit. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-brand-lg bg-white p-8 text-center shadow-brand">
        <CheckCircle className="mx-auto mb-4 h-10 w-10 text-brand-green" />
        <h3 className="font-display font-bold text-brand-navy">Interest Registered</h3>
        <p className="mt-2 text-sm text-brand-grey">Thank you for your interest in {programmeTitle}.</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-brand-lg bg-white p-8 shadow-brand" noValidate>
      <input type="hidden" value={programmeTitle} readOnly aria-hidden="true" />
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
        <label className="mb-1 block text-sm font-medium">Institution / Organisation</label>
        <input {...register("institution")} className="form-input" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Why are you interested? *</label>
        <textarea rows={4} {...register("motivation")} className="form-input resize-none" />
        {errors.motivation && <p className="form-error">{errors.motivation.message}</p>}
      </div>
      <label className="flex items-start gap-2 text-sm text-brand-grey">
        <input type="checkbox" {...register("consent")} className="mt-1" />
        <span>I agree to be contacted by EduLead Network regarding this programme.</span>
      </label>
      {errors.consent && <p className="form-error">{errors.consent.message}</p>}
      <TurnstileWidget onVerify={(t) => setValue("turnstileToken", t)} />
      {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
      <button type="submit" disabled={status === "loading"} className="btn-primary">
        {status === "loading" ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting…</> : "Express Interest"}
      </button>
    </form>
  );
}
