import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/test-utils";
import userEvent from "@testing-library/user-event";
import { MobileMenu } from "../index";

const mockLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/videos", label: "Videos" },
] as const;

describe("MobileMenu", () => {
  it("renders toggle button", () => {
    render(<MobileMenu links={mockLinks} />);
    expect(
      screen.getByRole("button", { name: "Toggle menu" })
    ).toBeInTheDocument();
  });

  it("menu is hidden by default", () => {
    render(<MobileMenu links={mockLinks} />);
    expect(
      screen.queryByRole("link", { name: "Home" })
    ).not.toBeInTheDocument();
  });

  it("shows menu when toggle is clicked", async () => {
    const user = userEvent.setup();
    render(<MobileMenu links={mockLinks} />);

    await user.click(screen.getByRole("button", { name: "Toggle menu" }));

    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "About" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Videos" })).toBeInTheDocument();
  });

  it("sets aria-expanded correctly", async () => {
    const user = userEvent.setup();
    render(<MobileMenu links={mockLinks} />);

    const toggle = screen.getByRole("button", { name: "Toggle menu" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");

    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("closes menu when a link is clicked", async () => {
    const user = userEvent.setup();
    render(<MobileMenu links={mockLinks} />);

    await user.click(screen.getByRole("button", { name: "Toggle menu" }));
    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();

    await user.click(screen.getByRole("link", { name: "Home" }));
    expect(
      screen.queryByRole("link", { name: "Home" })
    ).not.toBeInTheDocument();
  });

  it("renders YouTube CTA when menu is open", async () => {
    const user = userEvent.setup();
    render(<MobileMenu links={mockLinks} />);

    await user.click(screen.getByRole("button", { name: "Toggle menu" }));

    const cta = screen.getByRole("link", { name: "Subscribe on YouTube" });
    expect(cta).toHaveAttribute("target", "_blank");
    expect(cta).toHaveAttribute("rel", "noopener noreferrer");
  });
});
