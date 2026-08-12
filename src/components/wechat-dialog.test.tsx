import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { WeChatDialog } from "./wechat-dialog";

describe("WeChatDialog", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    delete (HTMLDialogElement.prototype as Partial<HTMLDialogElement>).showModal;
  });

  it("opens as a native modal when showModal is supported", async () => {
    const user = userEvent.setup();
    const showModal = vi.fn(function (this: HTMLDialogElement) {
        this.open = true;
      });
    Object.defineProperty(HTMLDialogElement.prototype, "showModal", {
      configurable: true,
      value: showModal,
    });
    render(<WeChatDialog qrSrc="/profile/wechat.png" />);

    await user.click(screen.getByRole("button", { name: /WeChat/i }));

    expect(showModal).toHaveBeenCalledOnce();
    expect(screen.getByRole("dialog")).toHaveAttribute("open");
  });

  it("opens with a QR image, closes on Escape, and restores trigger focus", async () => {
    const user = userEvent.setup();
    render(<WeChatDialog qrSrc="/profile/wechat.png" />);
    const trigger = screen.getByRole("button", { name: /WeChat/i });

    await user.click(trigger);

    expect(screen.getByRole("dialog", { name: "WeChat QR code" })).toBeVisible();
    expect(screen.getByRole("dialog").tagName).toBe("DIALOG");
    expect(
      screen.getByRole("img", { name: "WeChat QR code for Ruizhe Zhou" }),
    ).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("has a labeled close action", async () => {
    const user = userEvent.setup();
    render(<WeChatDialog qrSrc="/profile/wechat.png" />);

    await user.click(screen.getByRole("button", { name: /WeChat/i }));
    await user.click(screen.getByRole("button", { name: "Close WeChat QR code" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
