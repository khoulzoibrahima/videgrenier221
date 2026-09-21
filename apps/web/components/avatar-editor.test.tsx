import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { validateAvatar } from "../lib/profile";
import { AvatarEditor } from "./avatar-editor";

afterEach(cleanup);

describe("avatar editor", () => {
  it("accepts JPG, PNG and WebP files under 2 MiB", () => {
    for (const type of ["image/jpeg", "image/png", "image/webp"]) {
      expect(validateAvatar(new File(["photo"], "awa", { type }))).toBeNull();
    }
  });

  it("rejects unsupported and oversized photos", () => {
    const oversized = new File(
      [new Uint8Array(2 * 1024 * 1024 + 1)],
      "awa.png",
      { type: "image/png" },
    );
    expect(validateAvatar(oversized)).toBe("Choisissez une photo de moins de 2 Mo.");
    expect(validateAvatar(new File(["photo"], "awa.gif", { type: "image/gif" })))
      .toBe("Choisissez une photo JPG, PNG ou WebP.");
  });

  it("keeps the current form intact when an invalid photo is selected", () => {
    const onChange = vi.fn();
    render(<AvatarEditor avatarUrl={null} onChange={onChange} />);

    const file = new File(["photo"], "awa.gif", { type: "image/gif" });
    fireEvent.change(screen.getByLabelText("Choisir une photo"), { target: { files: [file] } });

    expect(screen.getByRole("alert")).toHaveTextContent("Choisissez une photo JPG, PNG ou WebP.");
    expect(onChange).not.toHaveBeenCalled();
  });
});
