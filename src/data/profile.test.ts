import { describe, expect, it } from "vitest";
import { profile } from "./profile";

describe("profile media", () => {
  it("uses the supplied portrait and WeChat image paths", () => {
    expect(profile.portrait).toBe("/image/my-photo.jpg");
    expect(profile.wechatQr).toBe("/image/wechat.jpg");
    expect(profile.cv).toBe("/image/my-cv.pdf");
  });
});
