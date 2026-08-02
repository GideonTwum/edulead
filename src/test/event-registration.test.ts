import { describe, it, expect, vi, beforeEach } from "vitest";
import { EventStatus } from "@prisma/client";
import {
  validateEventRegistrationEligibility,
  getEventRegistrationErrorMessage,
  getEventRegistrationStatusCode,
  createEventRegistration,
  sendEventRegistrationEmails,
  EVENT_REGISTRATION_ERRORS,
  type EventRegistrationCreateData,
} from "@/lib/event-registration";

const baseEvent = {
  published: true,
  deletedAt: null,
  registrationFormEnabled: true,
  status: EventStatus.UPCOMING,
  registrationDeadline: null,
  date: new Date("2026-12-01T10:00:00.000Z"),
  endDate: null,
  capacity: 2,
};

const mockTransaction = vi.fn();
const mockFindFirst = vi.fn();
const mockCount = vi.fn();
const mockCreate = vi.fn();

vi.mock("@/lib/db", () => ({
  default: {
    $transaction: (callback: (tx: unknown) => Promise<unknown>) => mockTransaction(callback),
    event: {
      findFirst: (...args: unknown[]) => mockFindFirst(...args),
    },
    eventRegistration: {
      findFirst: (...args: unknown[]) => mockFindFirst(...args),
      count: (...args: unknown[]) => mockCount(...args),
      create: (...args: unknown[]) => mockCreate(...args),
    },
  },
}));

describe("validateEventRegistrationEligibility", () => {
  it("rejects missing or deleted events", () => {
    const missing = validateEventRegistrationEligibility(null, {
      registrationCount: 0,
      hasExistingRegistration: false,
    });
    expect(missing.ok).toBe(false);
    if (!missing.ok) expect(missing.reason).toBe("not_found");

    const deleted = validateEventRegistrationEligibility(
      { ...baseEvent, deletedAt: new Date() },
      { registrationCount: 0, hasExistingRegistration: false },
    );
    expect(deleted.ok).toBe(false);
    if (!deleted.ok) expect(deleted.reason).toBe("not_found");
  });

  it("rejects unpublished or disabled registration", () => {
    const unpublished = validateEventRegistrationEligibility(
      { ...baseEvent, published: false },
      { registrationCount: 0, hasExistingRegistration: false },
    );
    expect(unpublished.ok).toBe(false);
    if (!unpublished.ok) expect(unpublished.reason).toBe("not_open");

    const disabled = validateEventRegistrationEligibility(
      { ...baseEvent, registrationFormEnabled: false },
      { registrationCount: 0, hasExistingRegistration: false },
    );
    expect(disabled.ok).toBe(false);
    if (!disabled.ok) expect(disabled.reason).toBe("not_open");
  });

  it("rejects cancelled or completed events", () => {
    const cancelled = validateEventRegistrationEligibility(
      { ...baseEvent, status: EventStatus.CANCELLED },
      { registrationCount: 0, hasExistingRegistration: false },
    );
    expect(cancelled.ok).toBe(false);
    if (!cancelled.ok) expect(cancelled.reason).toBe("not_open");
  });

  it("rejects passed deadlines and past upcoming event dates", () => {
    const now = new Date("2026-12-02T10:00:00.000Z");

    const deadlinePassed = validateEventRegistrationEligibility(
      { ...baseEvent, registrationDeadline: new Date("2026-12-01T09:00:00.000Z") },
      { now, registrationCount: 0, hasExistingRegistration: false },
    );
    expect(deadlinePassed.ok).toBe(false);
    if (!deadlinePassed.ok) expect(deadlinePassed.reason).toBe("closed");

    const eventDatePassed = validateEventRegistrationEligibility(baseEvent, {
      now,
      registrationCount: 0,
      hasExistingRegistration: false,
    });
    expect(eventDatePassed.ok).toBe(false);
    if (!eventDatePassed.ok) expect(eventDatePassed.reason).toBe("closed");
  });

  it("rejects full capacity and duplicate registrations", () => {
    const full = validateEventRegistrationEligibility(baseEvent, {
      registrationCount: 2,
      hasExistingRegistration: false,
    });
    expect(full.ok).toBe(false);
    if (!full.ok) expect(full.reason).toBe("full");

    const duplicate = validateEventRegistrationEligibility(baseEvent, {
      registrationCount: 0,
      hasExistingRegistration: true,
    });
    expect(duplicate.ok).toBe(false);
    if (!duplicate.ok) expect(duplicate.reason).toBe("duplicate");
  });

  it("accepts valid open registrations", () => {
    expect(
      validateEventRegistrationEligibility(baseEvent, {
        now: new Date("2026-11-01T10:00:00.000Z"),
        registrationCount: 1,
        hasExistingRegistration: false,
      }),
    ).toEqual({ ok: true });
  });
});

describe("createEventRegistration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockTransaction.mockImplementation(async (callback) =>
      callback({
        event: { findFirst: mockFindFirst },
        eventRegistration: {
          findFirst: mockFindFirst,
          count: mockCount,
          create: mockCreate,
        },
      }),
    );
  });

  const registrationData: EventRegistrationCreateData = {
    fullName: "Test User",
    email: "Test@Example.com",
    country: "Ghana",
    reason: "Interested in leadership development",
    consent: true,
  };

  it("returns not_open for unpublished events", async () => {
    mockFindFirst.mockResolvedValueOnce({ ...baseEvent, published: false, id: "event-1" });
    mockFindFirst.mockResolvedValueOnce(null);
    mockCount.mockResolvedValueOnce(0);

    const result = await createEventRegistration("event-1", registrationData);
    expect(result).toEqual({ ok: false, reason: "not_open" });
  });

  it("returns not_open when registration is disabled", async () => {
    mockFindFirst.mockResolvedValueOnce({
      ...baseEvent,
      id: "event-1",
      registrationFormEnabled: false,
    });
    mockFindFirst.mockResolvedValueOnce(null);
    mockCount.mockResolvedValueOnce(0);

    const result = await createEventRegistration("event-1", registrationData);
    expect(result).toEqual({ ok: false, reason: "not_open" });
  });

  it("returns closed after the deadline", async () => {
    mockFindFirst.mockResolvedValueOnce({
      ...baseEvent,
      id: "event-1",
      registrationDeadline: new Date("2026-11-01T09:00:00.000Z"),
    });
    mockFindFirst.mockResolvedValueOnce(null);
    mockCount.mockResolvedValueOnce(0);

    const result = await createEventRegistration(
      "event-1",
      registrationData,
      new Date("2026-11-02T09:00:00.000Z"),
    );
    expect(result).toEqual({ ok: false, reason: "closed" });
  });

  it("returns full when capacity is reached", async () => {
    mockFindFirst.mockResolvedValueOnce({ ...baseEvent, id: "event-1" });
    mockFindFirst.mockResolvedValueOnce(null);
    mockCount.mockResolvedValueOnce(2);

    const result = await createEventRegistration(
      "event-1",
      registrationData,
      new Date("2026-11-01T09:00:00.000Z"),
    );
    expect(result).toEqual({ ok: false, reason: "full" });
  });

  it("returns duplicate for the same email", async () => {
    mockFindFirst.mockResolvedValueOnce({ ...baseEvent, id: "event-1" });
    mockFindFirst.mockResolvedValueOnce({ id: "existing" });
    mockCount.mockResolvedValueOnce(1);

    const result = await createEventRegistration(
      "event-1",
      registrationData,
      new Date("2026-11-01T09:00:00.000Z"),
    );
    expect(result).toEqual({ ok: false, reason: "duplicate" });
  });

  it("creates a valid registration inside a transaction", async () => {
    const eventRecord = {
      ...baseEvent,
      id: "event-1",
      title: "Leadership Forum",
      date: baseEvent.date,
    };
    mockFindFirst.mockResolvedValueOnce(eventRecord);
    mockFindFirst.mockResolvedValueOnce(null);
    mockCount.mockResolvedValueOnce(0);
    mockCreate.mockResolvedValueOnce({ id: "registration-1", eventId: "event-1" });

    const result = await createEventRegistration(
      "event-1",
      registrationData,
      new Date("2026-11-01T09:00:00.000Z"),
    );

    expect(result.ok).toBe(true);
    expect(mockCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({
        eventId: "event-1",
        email: "test@example.com",
      }),
    });
  });
});

describe("sendEventRegistrationEmails", () => {
  it("reports email failures after a successful save", async () => {
    const sendEmailFn = vi
      .fn()
      .mockResolvedValueOnce({ success: false, error: "failed" })
      .mockResolvedValueOnce({ success: true, id: "admin-email" });

    const result = await sendEventRegistrationEmails(
      {
        fullName: "Test User",
        email: "test@example.com",
        eventTitle: "Leadership Forum",
        eventDate: "1 December 2026",
      },
      sendEmailFn,
      "admin@example.com",
      {
        confirmation: () => "<p>confirmation</p>",
        adminNotification: () => "<p>admin</p>",
      },
    );

    expect(result.userEmailSent).toBe(false);
    expect(result.adminEmailSent).toBe(true);
  });
});

describe("event registration error mapping", () => {
  it("returns safe user-facing messages and status codes", () => {
    expect(getEventRegistrationErrorMessage("not_found")).toBe(EVENT_REGISTRATION_ERRORS.not_found);
    expect(getEventRegistrationStatusCode("duplicate")).toBe(409);
    expect(getEventRegistrationStatusCode("full")).toBe(400);
    expect(getEventRegistrationStatusCode("not_found")).toBe(404);
  });
});
