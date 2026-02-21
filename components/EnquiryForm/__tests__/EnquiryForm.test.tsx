import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@/test/test-utils";
import userEvent from "@testing-library/user-event";
import { EnquiryForm } from "../index";

describe("EnquiryForm", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders all form fields", () => {
    render(<EnquiryForm />);

    expect(screen.getByLabelText(/^Name/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Email/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Company/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Enquiry Type/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Message/)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Send Enquiry" })
    ).toBeInTheDocument();
  });

  it("shows validation error for empty name", async () => {
    const user = userEvent.setup();
    render(<EnquiryForm />);

    await user.click(screen.getByRole("button", { name: "Send Enquiry" }));

    expect(
      await screen.findByText("Name must be at least 2 characters")
    ).toBeInTheDocument();
  });

  it("shows validation error for invalid email", async () => {
    const user = userEvent.setup();
    render(<EnquiryForm />);

    await user.type(screen.getByLabelText(/^Name/), "John Doe");
    await user.type(screen.getByLabelText(/^Email/), "not-an-email");
    await user.click(screen.getByRole("button", { name: "Send Enquiry" }));

    expect(
      await screen.findByText("Please enter a valid email address")
    ).toBeInTheDocument();
  });

  it("shows validation error for missing enquiry type", async () => {
    const user = userEvent.setup();
    render(<EnquiryForm />);

    await user.type(screen.getByLabelText(/^Name/), "John Doe");
    await user.type(screen.getByLabelText(/^Email/), "john@example.com");
    await user.click(screen.getByRole("button", { name: "Send Enquiry" }));

    expect(
      await screen.findByText("Please select an enquiry type")
    ).toBeInTheDocument();
  });

  it("shows validation error for short message", async () => {
    const user = userEvent.setup();
    render(<EnquiryForm />);

    await user.type(screen.getByLabelText(/^Name/), "John Doe");
    await user.type(screen.getByLabelText(/^Email/), "john@example.com");
    await user.selectOptions(screen.getByLabelText(/Enquiry Type/), "other");
    await user.type(screen.getByLabelText(/^Message/), "Short");
    await user.click(screen.getByRole("button", { name: "Send Enquiry" }));

    expect(
      await screen.findByText("Message must be at least 20 characters")
    ).toBeInTheDocument();
  });

  it("clears field error when user types in that field", async () => {
    const user = userEvent.setup();
    render(<EnquiryForm />);

    // Trigger validation
    await user.click(screen.getByRole("button", { name: "Send Enquiry" }));
    expect(
      await screen.findByText("Name must be at least 2 characters")
    ).toBeInTheDocument();

    // Type in the field
    await user.type(screen.getByLabelText(/^Name/), "John");

    expect(
      screen.queryByText("Name must be at least 2 characters")
    ).not.toBeInTheDocument();
  });

  it("shows success state after valid submission", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          message: "Thank you for your enquiry!",
        }),
    });

    const user = userEvent.setup();
    render(<EnquiryForm />);

    await user.type(screen.getByLabelText(/^Name/), "John Doe");
    await user.type(screen.getByLabelText(/^Email/), "john@example.com");
    await user.selectOptions(screen.getByLabelText(/Enquiry Type/), "other");
    await user.type(
      screen.getByLabelText(/^Message/),
      "This is a test message that is long enough to pass validation checks."
    );
    await user.click(screen.getByRole("button", { name: "Send Enquiry" }));

    await waitFor(() => {
      expect(screen.getByText("Message Sent!")).toBeInTheDocument();
    });
  });

  it("shows error state when API returns error", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: () =>
        Promise.resolve({
          error: "Something went wrong. Please try again.",
        }),
    });

    const user = userEvent.setup();
    render(<EnquiryForm />);

    await user.type(screen.getByLabelText(/^Name/), "John Doe");
    await user.type(screen.getByLabelText(/^Email/), "john@example.com");
    await user.selectOptions(screen.getByLabelText(/Enquiry Type/), "other");
    await user.type(
      screen.getByLabelText(/^Message/),
      "This is a test message that is long enough to pass validation checks."
    );
    await user.click(screen.getByRole("button", { name: "Send Enquiry" }));

    await waitFor(() => {
      expect(
        screen.getByText("Something went wrong. Please try again.")
      ).toBeInTheDocument();
    });
  });

  it("allows sending another message after success", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          message: "Thank you!",
        }),
    });

    const user = userEvent.setup();
    render(<EnquiryForm />);

    await user.type(screen.getByLabelText(/^Name/), "John Doe");
    await user.type(screen.getByLabelText(/^Email/), "john@example.com");
    await user.selectOptions(screen.getByLabelText(/Enquiry Type/), "other");
    await user.type(
      screen.getByLabelText(/^Message/),
      "This is a test message that is long enough to pass validation checks."
    );
    await user.click(screen.getByRole("button", { name: "Send Enquiry" }));

    await waitFor(() => {
      expect(screen.getByText("Message Sent!")).toBeInTheDocument();
    });

    await user.click(
      screen.getByRole("button", { name: "Send Another Message" })
    );

    expect(screen.getByLabelText(/^Name/)).toBeInTheDocument();
  });

  it("has honeypot field hidden from users", () => {
    render(<EnquiryForm />);

    // The honeypot wrapper div has aria-hidden="true"
    const honeypotLabel = screen.getByText("Website (leave blank)");
    const honeypotWrapper = honeypotLabel.closest("[aria-hidden]");
    expect(honeypotWrapper).toHaveAttribute("aria-hidden", "true");
  });
});
