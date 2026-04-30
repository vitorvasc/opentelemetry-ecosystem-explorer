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
import { useState } from "react";
import { Copy } from "lucide-react";

interface CopyButtonProps {
  text: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
  onCopy?: () => void;
}

const COPIED_FLASH_MS = 2000;

const DEFAULT_CLASS =
  "border-border/60 bg-card text-foreground hover:bg-card/80 inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs";

export function CopyButton({
  text,
  label = "Copy",
  copiedLabel = "Copied",
  className,
  onCopy,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      onCopy?.();
      setTimeout(() => setCopied(false), COPIED_FLASH_MS);
    } catch {
      // Clipboard write failed (permissions, insecure context). Stay silent.
    }
  };

  const visibleLabel = copied ? copiedLabel : label;

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={visibleLabel}
      aria-live="polite"
      className={className ?? DEFAULT_CLASS}
    >
      <Copy className="h-3 w-3" aria-hidden="true" />
      {visibleLabel}
    </button>
  );
}
