import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor, fireEvent } from "@/test/test-utils";
import userEvent from "@testing-library/user-event";
import { Newsletter } from "../index";

describe("Newsletter", () => {
  it("renders email input and subscribe button", () => {
    render(<Newsletter />);

    expect(screen.getByLabelText("Email address")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Subscribe" })
    ).toBeInTheDocument();
  });

  it("shows error for invalid email", async () => {
    const user = userEvent.setup();
    render(<Newsletter />);

    const input = screen.getByLabelText("Email address");
    await user.type(input, "invalid-email");

    // Submit form directly to bypass HTML5 email type validation
    fireEvent.submit(input.closest("form")!);

    expect(
      await screen.findByText("Please enter a valid email address.")
    ).toBeInTheDocument();
  });

  it("shows success message on valid submission", async () => {
    const user = userEvent.setup();
    render(<Newsletter />);

    const input = screen.getByLabelText("Email address");
    await user.type(input, "user@example.com");
    await user.click(screen.getByRole("button", { name: "Subscribe" }));

    // Component has a simulated 1000ms delay — use longer timeout
    expect(
      await screen.findByText(
        "Thanks for subscribing! Check your email to confirm.",
        {},
        { timeout: 3000 }
      )
    ).toBeInTheDocument();
  });

  it("shows loading state during submission", async () => {
    const user = userEvent.setup();
    render(<Newsletter />);

    const input = screen.getByLabelText("Email address");
    await user.type(input, "user@example.com");
    await user.click(screen.getByRole("button", { name: "Subscribe" }));

    // The button should show "Subscribing..." while loading
    expect(screen.getByText("Subscribing...")).toBeInTheDocument();
  });

  it("clears email input after successful submission", async () => {
    const user = userEvent.setup();
    render(<Newsletter />);

    const input = screen.getByLabelText("Email address");
    await user.type(input, "user@example.com");
    await user.click(screen.getByRole("button", { name: "Subscribe" }));

    await waitFor(() => {
      expect(input).toHaveValue("");
    });
  });

  it("resets status after 5 seconds", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    render(<Newsletter />);

    const input = screen.getByLabelText("Email address");
    await user.type(input, "user@example.com");
    await user.click(screen.getByRole("button", { name: "Subscribe" }));

    await waitFor(() => {
      expect(
        screen.getByText(
          "Thanks for subscribing! Check your email to confirm."
        )
      ).toBeInTheDocument();
    });

    vi.advanceTimersByTime(5001);

    await waitFor(() => {
      expect(
        screen.queryByText(
          "Thanks for subscribing! Check your email to confirm."
        )
      ).not.toBeInTheDocument();
    });

    vi.useRealTimers();
  });
});
