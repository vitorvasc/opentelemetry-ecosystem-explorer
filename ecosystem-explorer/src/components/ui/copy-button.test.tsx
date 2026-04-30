/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { afterEach, describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CopyButton } from "@/components/ui/copy-button";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("CopyButton", () => {
  it("writes the text prop to the clipboard on click", async () => {
    const user = userEvent.setup();
    const writeText = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue(undefined);

    render(<CopyButton text="hello" />);
    await user.click(screen.getByRole("button", { name: "Copy" }));

    expect(writeText).toHaveBeenCalledWith("hello");
  });

  it("flashes the copied label after a successful click and reverts", async () => {
    const user = userEvent.setup();
    vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue(undefined);

    render(<CopyButton text="hello" />);
    await user.click(screen.getByRole("button", { name: "Copy" }));

    expect(await screen.findByRole("button", { name: "Copied" })).toBeInTheDocument();

    await waitFor(
      () => {
        expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  it("calls onCopy after a successful clipboard write", async () => {
    const user = userEvent.setup();
    vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue(undefined);
    const onCopy = vi.fn();

    render(<CopyButton text="hello" onCopy={onCopy} />);
    await user.click(screen.getByRole("button", { name: "Copy" }));

    await waitFor(() => {
      expect(onCopy).toHaveBeenCalledTimes(1);
    });
  });

  it("does not flash or call onCopy when the clipboard write rejects", async () => {
    const user = userEvent.setup();
    vi.spyOn(navigator.clipboard, "writeText").mockImplementation(() =>
      Promise.reject(new Error("denied"))
    );
    const onCopy = vi.fn();

    render(<CopyButton text="hello" onCopy={onCopy} />);
    await user.click(screen.getByRole("button", { name: "Copy" }));

    // Give the rejected promise microtask a chance to settle
    await Promise.resolve();
    await Promise.resolve();

    expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument();
    expect(onCopy).not.toHaveBeenCalled();
  });

  it("renders custom labels when provided", () => {
    render(<CopyButton text="x" label="Copy YAML" copiedLabel="Done" />);
    expect(screen.getByRole("button", { name: "Copy YAML" })).toBeInTheDocument();
  });
});
