import { z } from "zod";

export const consentSchema = z.literal(true, {
  errorMap: () => ({ message: "You must agree to be contacted by EduLead Network" }),
});

export const turnstileSchema = z.string().min(1, "Please complete the security verification");

export const newsletterSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(100),
  email: z.string().email("Please enter a valid email address"),
  consent: consentSchema,
  turnstileToken: turnstileSchema,
});

export const contactSchema = z.object({
  fullName: z.string().min(2, "Full name is required").max(200),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().max(30).optional().or(z.literal("")),
  subject: z.string().min(3, "Subject is required").max(200),
  enquiryType: z.string().min(1, "Please select an enquiry type"),
  message: z.string().min(10, "Message must be at least 10 characters").max(5000),
  consent: consentSchema,
  turnstileToken: turnstileSchema,
});

export const youngPersonSchema = z.object({
  fullName: z.string().min(2).max(200),
  email: z.string().email(),
  phone: z.string().min(5).max(30),
  ageRange: z.string().min(1, "Please select your age range"),
  country: z.string().min(1, "Country is required"),
  institution: z.string().min(1, "Institution is required").max(200),
  educationLevel: z.string().min(1, "Education level is required"),
  areasOfInterest: z.array(z.string()).min(1, "Select at least one area of interest"),
  hopes: z.string().min(10, "Please share what you hope to gain").max(2000),
  consent: consentSchema,
  turnstileToken: turnstileSchema,
});

export const mentorSchema = z.object({
  fullName: z.string().min(2).max(200),
  email: z.string().email(),
  phone: z.string().min(5).max(30),
  country: z.string().min(1),
  profession: z.string().min(1).max(200),
  organisation: z.string().min(1).max(200),
  expertise: z.string().min(1).max(200),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  yearsExperience: z.string().min(1),
  mentoringInterests: z.string().min(10).max(2000),
  availability: z.string().min(1).max(500),
  motivation: z.string().min(10).max(2000),
  consent: consentSchema,
  turnstileToken: turnstileSchema,
});

export const volunteerSchema = z.object({
  fullName: z.string().min(2).max(200),
  email: z.string().email(),
  phone: z.string().min(5).max(30),
  country: z.string().min(1),
  institution: z.string().min(1).max(200),
  skills: z.string().min(1).max(500),
  areasOfInterest: z.array(z.string()).min(1),
  availability: z.string().min(1).max(500),
  motivation: z.string().min(10).max(2000),
  consent: consentSchema,
  turnstileToken: turnstileSchema,
});

export const partnerSchema = z.object({
  contactPerson: z.string().min(2).max(200),
  organisationName: z.string().min(2).max(200),
  email: z.string().email(),
  phone: z.string().min(5).max(30),
  country: z.string().min(1),
  website: z.string().url().optional().or(z.literal("")),
  partnershipArea: z.string().min(1).max(200),
  proposalSummary: z.string().min(20).max(5000),
  consent: consentSchema,
  turnstileToken: turnstileSchema,
});

export const supporterSchema = z.object({
  fullName: z.string().min(2).max(200),
  email: z.string().email(),
  phone: z.string().max(30).optional().or(z.literal("")),
  country: z.string().min(1),
  supportType: z.string().min(1),
  message: z.string().min(10).max(2000),
  consent: consentSchema,
  turnstileToken: turnstileSchema,
});

export const programmeInterestSchema = z.object({
  fullName: z.string().min(2).max(200),
  email: z.string().email(),
  phone: z.string().max(30).optional().or(z.literal("")),
  country: z.string().min(1),
  institution: z.string().max(200).optional().or(z.literal("")),
  motivation: z.string().min(10).max(2000),
  consent: consentSchema,
  turnstileToken: turnstileSchema,
});

export const eventRegistrationSchema = z.object({
  fullName: z.string().min(2).max(200),
  email: z.string().email(),
  phone: z.string().max(30).optional().or(z.literal("")),
  institution: z.string().max(200).optional().or(z.literal("")),
  country: z.string().min(1),
  reason: z.string().min(10).max(2000),
  consent: consentSchema,
  turnstileToken: turnstileSchema,
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type YoungPersonInput = z.infer<typeof youngPersonSchema>;
export type MentorInput = z.infer<typeof mentorSchema>;
export type VolunteerInput = z.infer<typeof volunteerSchema>;
export type PartnerInput = z.infer<typeof partnerSchema>;
export type SupporterInput = z.infer<typeof supporterSchema>;
export type ProgrammeInterestInput = z.infer<typeof programmeInterestSchema>;
export type EventRegistrationInput = z.infer<typeof eventRegistrationSchema>;
