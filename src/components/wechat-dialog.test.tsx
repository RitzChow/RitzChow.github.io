import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { WeChatDialog } from "./wechat-dialog";

describe("WeChatDialog", () => {
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
