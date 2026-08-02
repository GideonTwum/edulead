"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Loader2 } from "lucide-react";
import {
  youngPersonSchema,
  mentorSchema,
  volunteerSchema,
  partnerSchema,
  supporterSchema,
  type YoungPersonInput,
  type MentorInput,
  type VolunteerInput,
  type PartnerInput,
  type SupporterInput,
} from "@/lib/validations/forms";
import { EDUCATION_LEVELS, INTEREST_AREAS, SUPPORT_TYPES } from "@/lib/constants";
import { TurnstileWidget } from "./TurnstileWidget";
import { cn } from "@/lib/utils";

type JoinType = "young-person" | "mentor" | "volunteer" | "partner" | "supporter";

const joinTypes: { id: JoinType; label: string; description: string }[] = [
  { id: "young-person", label: "Young Person", description: "Access mentorship and leadership development" },
  { id: "mentor", label: "Mentor", description: "Guide the next generation of leaders" },
  { id: "volunteer", label: "Volunteer", description: "Contribute your skills and time" },
  { id: "partner", label: "Partner", description: "Collaborate with EduLead Network" },
  { id: "supporter", label: "Supporter", description: "Support our mission" },
];

const typeParamMap: Record<string, JoinType> = {
  "young-person": "young-person",
  mentor: "mentor",
  volunteer: "volunteer",
  partner: "partner",
  supporter: "supporter",
};

export function JoinForm() {
  const searchParams = useSearchParams();
  const initialType = typeParamMap[searchParams.get("type") ?? ""] ?? "young-person";
  const [activeType, setActiveType] = useState<JoinType>(initialType);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const param = searchParams.get("type");
    if (param && typeParamMap[param]) {
      setActiveType(typeParamMap[param]);
    }
  }, [searchParams]);

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-brand-lg bg-white p-12 text-center shadow-brand"
      >
        <CheckCircle className="mx-auto mb-4 h-12 w-12 text-brand-green" />
        <h3 className="font-display text-xl font-bold text-brand-navy">Submission Received</h3>
        <p className="mt-2 text-sm text-brand-grey">
          Thank you for your interest in EduLead Network. Our team will review your submission and be in touch.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2">
        {joinTypes.map((type) => (
          <button
            key={type.id}
            type="button"
            onClick={() => setActiveType(type.id)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
              activeType === type.id
                ? "bg-brand-navy text-white"
                : "bg-brand-off-white text-brand-grey hover:bg-brand-navy/10",
            )}
          >
            {type.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeType}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {activeType === "young-person" && (
            <YoungPersonForm
              onSuccess={() => setStatus("success")}
              onError={(msg) => {
                setStatus("error");
                setErrorMessage(msg);
              }}
              onLoading={() => setStatus("loading")}
              onIdle={() => setStatus("idle")}
              errorMessage={errorMessage}
              isLoading={status === "loading"}
            />
          )}
          {activeType === "mentor" && (
            <MentorForm
              onSuccess={() => setStatus("success")}
              onError={(msg) => {
                setStatus("error");
                setErrorMessage(msg);
              }}
              onLoading={() => setStatus("loading")}
              onIdle={() => setStatus("idle")}
              errorMessage={errorMessage}
              isLoading={status === "loading"}
            />
          )}
          {activeType === "volunteer" && (
            <VolunteerForm
              onSuccess={() => setStatus("success")}
              onError={(msg) => {
                setStatus("error");
                setErrorMessage(msg);
              }}
              onLoading={() => setStatus("loading")}
              onIdle={() => setStatus("idle")}
              errorMessage={errorMessage}
              isLoading={status === "loading"}
            />
          )}
          {activeType === "partner" && (
            <PartnerForm
              onSuccess={() => setStatus("success")}
              onError={(msg) => {
                setStatus("error");
                setErrorMessage(msg);
              }}
              onLoading={() => setStatus("loading")}
              onIdle={() => setStatus("idle")}
              errorMessage={errorMessage}
              isLoading={status === "loading"}
            />
          )}
          {activeType === "supporter" && (
            <SupporterForm
              onSuccess={() => setStatus("success")}
              onError={(msg) => {
                setStatus("error");
                setErrorMessage(msg);
              }}
              onLoading={() => setStatus("loading")}
              onIdle={() => setStatus("idle")}
              errorMessage={errorMessage}
              isLoading={status === "loading"}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

interface FormProps {
  onSuccess: () => void;
  onError: (msg: string) => void;
  onLoading: () => void;
  onIdle: () => void;
  errorMessage: string;
  isLoading: boolean;
}

async function submitJoin(joinType: JoinType, data: Record<string, unknown>, callbacks: FormProps) {
  callbacks.onLoading();
  try {
    const res = await fetch("/api/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, joinType }),
    });
    const result = await res.json();
    if (!res.ok) {
      callbacks.onError(result.error || "Something went wrong.");
      callbacks.onIdle();
      return;
    }
    callbacks.onSuccess();
  } catch {
    callbacks.onError("Unable to submit. Please try again.");
    callbacks.onIdle();
  }
}

function FormShell({ children, title, description }: { children: React.ReactNode; title: string; description: string }) {
  return (
    <div className="rounded-brand-lg bg-white p-8 shadow-brand">
      <h3 className="font-display text-xl font-bold text-brand-navy">{title}</h3>
      <p className="mt-1 text-sm text-brand-grey">{description}</p>
      <div className="mt-6">{children}</div>
    </div>
  );
}

function YoungPersonForm(props: FormProps) {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<YoungPersonInput>({
    resolver: zodResolver(youngPersonSchema),
  });

  return (
    <FormShell title="Join as a Young Person" description="Tell us about yourself and what you hope to gain from EduLead Network.">
      <form onSubmit={handleSubmit((data) => submitJoin("young-person", data, props))} className="space-y-5" noValidate>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Full name *" id="yp-name" error={errors.fullName?.message}>
            <input id="yp-name" {...register("fullName")} className="form-input" />
          </Field>
          <Field label="Email *" id="yp-email" error={errors.email?.message}>
            <input id="yp-email" type="email" {...register("email")} className="form-input" />
          </Field>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Phone *" id="yp-phone" error={errors.phone?.message}>
            <input id="yp-phone" {...register("phone")} className="form-input" />
          </Field>
          <Field label="Age range *" id="yp-age" error={errors.ageRange?.message}>
            <select id="yp-age" {...register("ageRange")} className="form-input">
              <option value="">Select</option>
              {["15-17", "18-21", "22-25", "26-30", "31+"].map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </Field>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Country *" id="yp-country" error={errors.country?.message}>
            <input id="yp-country" {...register("country")} className="form-input" />
          </Field>
          <Field label="Institution *" id="yp-institution" error={errors.institution?.message}>
            <input id="yp-institution" {...register("institution")} className="form-input" />
          </Field>
        </div>
        <Field label="Education level *" id="yp-education" error={errors.educationLevel?.message}>
          <select id="yp-education" {...register("educationLevel")} className="form-input">
            <option value="">Select</option>
            {EDUCATION_LEVELS.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </Field>
        <fieldset>
          <legend className="mb-2 text-sm font-medium">Areas of interest *</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {INTEREST_AREAS.map((area) => (
              <label key={area} className="flex items-center gap-2 text-sm text-brand-grey">
                <input type="checkbox" value={area} {...register("areasOfInterest")} />
                {area}
              </label>
            ))}
          </div>
          {errors.areasOfInterest && <p className="form-error">{errors.areasOfInterest.message}</p>}
        </fieldset>
        <Field label="What do you hope to gain? *" id="yp-hopes" error={errors.hopes?.message}>
          <textarea id="yp-hopes" rows={4} {...register("hopes")} className="form-input resize-none" />
        </Field>
        <ConsentField register={register} error={errors.consent?.message} />
        <TurnstileWidget onVerify={(token) => setValue("turnstileToken", token)} />
        <SubmitButton isLoading={props.isLoading} errorMessage={props.errorMessage} />
      </form>
    </FormShell>
  );
}

function MentorForm(props: FormProps) {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<MentorInput>({
    resolver: zodResolver(mentorSchema),
  });

  return (
    <FormShell title="Become a Mentor" description="Share your expertise to guide young leaders.">
      <form onSubmit={handleSubmit((data) => submitJoin("mentor", data, props))} className="space-y-5" noValidate>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Full name *" id="m-name" error={errors.fullName?.message}>
            <input id="m-name" {...register("fullName")} className="form-input" />
          </Field>
          <Field label="Email *" id="m-email" error={errors.email?.message}>
            <input id="m-email" type="email" {...register("email")} className="form-input" />
          </Field>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Phone *" id="m-phone" error={errors.phone?.message}>
            <input id="m-phone" {...register("phone")} className="form-input" />
          </Field>
          <Field label="Country *" id="m-country" error={errors.country?.message}>
            <input id="m-country" {...register("country")} className="form-input" />
          </Field>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Profession *" id="m-profession" error={errors.profession?.message}>
            <input id="m-profession" {...register("profession")} className="form-input" />
          </Field>
          <Field label="Organisation *" id="m-org" error={errors.organisation?.message}>
            <input id="m-org" {...register("organisation")} className="form-input" />
          </Field>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Area of expertise *" id="m-expertise" error={errors.expertise?.message}>
            <input id="m-expertise" {...register("expertise")} className="form-input" />
          </Field>
          <Field label="Years of experience *" id="m-years" error={errors.yearsExperience?.message}>
            <select id="m-years" {...register("yearsExperience")} className="form-input">
              <option value="">Select</option>
              {["1-3", "4-7", "8-15", "15+"].map((y) => (
                <option key={y} value={y}>{y} years</option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="LinkedIn URL" id="m-linkedin" error={errors.linkedinUrl?.message}>
          <input id="m-linkedin" type="url" {...register("linkedinUrl")} className="form-input" placeholder="https://" />
        </Field>
        <Field label="Mentoring interests *" id="m-interests" error={errors.mentoringInterests?.message}>
          <textarea id="m-interests" rows={3} {...register("mentoringInterests")} className="form-input resize-none" />
        </Field>
        <Field label="Availability *" id="m-availability" error={errors.availability?.message}>
          <input id="m-availability" {...register("availability")} className="form-input" placeholder="e.g. 2 hours/month" />
        </Field>
        <Field label="Why do you want to mentor? *" id="m-motivation" error={errors.motivation?.message}>
          <textarea id="m-motivation" rows={3} {...register("motivation")} className="form-input resize-none" />
        </Field>
        <ConsentField register={register} error={errors.consent?.message} />
        <TurnstileWidget onVerify={(token) => setValue("turnstileToken", token)} />
        <SubmitButton isLoading={props.isLoading} errorMessage={props.errorMessage} />
      </form>
    </FormShell>
  );
}

function VolunteerForm(props: FormProps) {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<VolunteerInput>({
    resolver: zodResolver(volunteerSchema),
  });

  return (
    <FormShell title="Volunteer With Us" description="Contribute your skills to our growing community.">
      <form onSubmit={handleSubmit((data) => submitJoin("volunteer", data, props))} className="space-y-5" noValidate>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Full name *" id="v-name" error={errors.fullName?.message}>
            <input id="v-name" {...register("fullName")} className="form-input" />
          </Field>
          <Field label="Email *" id="v-email" error={errors.email?.message}>
            <input id="v-email" type="email" {...register("email")} className="form-input" />
          </Field>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Phone *" id="v-phone" error={errors.phone?.message}>
            <input id="v-phone" {...register("phone")} className="form-input" />
          </Field>
          <Field label="Country *" id="v-country" error={errors.country?.message}>
            <input id="v-country" {...register("country")} className="form-input" />
          </Field>
        </div>
        <Field label="Institution / Organisation *" id="v-institution" error={errors.institution?.message}>
          <input id="v-institution" {...register("institution")} className="form-input" />
        </Field>
        <Field label="Skills *" id="v-skills" error={errors.skills?.message}>
          <input id="v-skills" {...register("skills")} className="form-input" placeholder="e.g. Design, Communications, Research" />
        </Field>
        <fieldset>
          <legend className="mb-2 text-sm font-medium">Areas of interest *</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {INTEREST_AREAS.map((area) => (
              <label key={area} className="flex items-center gap-2 text-sm text-brand-grey">
                <input type="checkbox" value={area} {...register("areasOfInterest")} />
                {area}
              </label>
            ))}
          </div>
          {errors.areasOfInterest && <p className="form-error">{errors.areasOfInterest.message}</p>}
        </fieldset>
        <Field label="Availability *" id="v-availability" error={errors.availability?.message}>
          <input id="v-availability" {...register("availability")} className="form-input" />
        </Field>
        <Field label="Why do you want to volunteer? *" id="v-motivation" error={errors.motivation?.message}>
          <textarea id="v-motivation" rows={3} {...register("motivation")} className="form-input resize-none" />
        </Field>
        <ConsentField register={register} error={errors.consent?.message} />
        <TurnstileWidget onVerify={(token) => setValue("turnstileToken", token)} />
        <SubmitButton isLoading={props.isLoading} errorMessage={props.errorMessage} />
      </form>
    </FormShell>
  );
}

function PartnerForm(props: FormProps) {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<PartnerInput>({
    resolver: zodResolver(partnerSchema),
  });

  return (
    <FormShell title="Partner With EduLead" description="Explore collaboration opportunities with our network.">
      <form onSubmit={handleSubmit((data) => submitJoin("partner", data, props))} className="space-y-5" noValidate>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Contact person *" id="p-contact" error={errors.contactPerson?.message}>
            <input id="p-contact" {...register("contactPerson")} className="form-input" />
          </Field>
          <Field label="Organisation *" id="p-org" error={errors.organisationName?.message}>
            <input id="p-org" {...register("organisationName")} className="form-input" />
          </Field>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Email *" id="p-email" error={errors.email?.message}>
            <input id="p-email" type="email" {...register("email")} className="form-input" />
          </Field>
          <Field label="Phone *" id="p-phone" error={errors.phone?.message}>
            <input id="p-phone" {...register("phone")} className="form-input" />
          </Field>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Country *" id="p-country" error={errors.country?.message}>
            <input id="p-country" {...register("country")} className="form-input" />
          </Field>
          <Field label="Website" id="p-website" error={errors.website?.message}>
            <input id="p-website" type="url" {...register("website")} className="form-input" placeholder="https://" />
          </Field>
        </div>
        <Field label="Partnership area *" id="p-area" error={errors.partnershipArea?.message}>
          <input id="p-area" {...register("partnershipArea")} className="form-input" />
        </Field>
        <Field label="Proposal summary *" id="p-proposal" error={errors.proposalSummary?.message}>
          <textarea id="p-proposal" rows={5} {...register("proposalSummary")} className="form-input resize-none" />
        </Field>
        <ConsentField register={register} error={errors.consent?.message} />
        <TurnstileWidget onVerify={(token) => setValue("turnstileToken", token)} />
        <SubmitButton isLoading={props.isLoading} errorMessage={props.errorMessage} />
      </form>
    </FormShell>
  );
}

function SupporterForm(props: FormProps) {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<SupporterInput>({
    resolver: zodResolver(supporterSchema),
  });

  return (
    <FormShell title="Support the Mission" description="Help us build the infrastructure for youth leadership development.">
      <form onSubmit={handleSubmit((data) => submitJoin("supporter", data, props))} className="space-y-5" noValidate>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Full name *" id="s-name" error={errors.fullName?.message}>
            <input id="s-name" {...register("fullName")} className="form-input" />
          </Field>
          <Field label="Email *" id="s-email" error={errors.email?.message}>
            <input id="s-email" type="email" {...register("email")} className="form-input" />
          </Field>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Phone" id="s-phone" error={errors.phone?.message}>
            <input id="s-phone" {...register("phone")} className="form-input" />
          </Field>
          <Field label="Country *" id="s-country" error={errors.country?.message}>
            <input id="s-country" {...register("country")} className="form-input" />
          </Field>
        </div>
        <Field label="Type of support *" id="s-type" error={errors.supportType?.message}>
          <select id="s-type" {...register("supportType")} className="form-input">
            <option value="">Select</option>
            {SUPPORT_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </Field>
        <Field label="Message *" id="s-message" error={errors.message?.message}>
          <textarea id="s-message" rows={4} {...register("message")} className="form-input resize-none" />
        </Field>
        <ConsentField register={register} error={errors.consent?.message} />
        <TurnstileWidget onVerify={(token) => setValue("turnstileToken", token)} />
        <SubmitButton isLoading={props.isLoading} errorMessage={props.errorMessage} />
      </form>
    </FormShell>
  );
}

function Field({
  label,
  id,
  error,
  children,
}: {
  label: string;
  id: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium">
        {label}
      </label>
      {children}
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}

function ConsentField({
  register,
  error,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: (name: "consent") => any;
  error?: string;
}) {
  return (
    <>
      <label className="flex items-start gap-2 text-sm text-brand-grey">
        <input type="checkbox" {...register("consent")} className="mt-1" />
        <span>I agree to be contacted by EduLead Network regarding my submission.</span>
      </label>
      {error && <p className="form-error">{error}</p>}
    </>
  );
}

function SubmitButton({ isLoading, errorMessage }: { isLoading: boolean; errorMessage: string }) {
  return (
    <>
      {errorMessage && (
        <p className="text-sm text-red-600" role="alert">
          {errorMessage}
        </p>
      )}
      <button type="submit" disabled={isLoading} className="btn-primary">
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Submitting…
          </>
        ) : (
          "Submit"
        )}
      </button>
    </>
  );
}
