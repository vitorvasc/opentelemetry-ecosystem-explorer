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

/*
 * FacetPanel — left rail on the list page. Sticky on desktop; on mobile it
 * collapses into a drawer toggled by the FacetDrawerToggle button.
 *
 * Composes the facets defined in the Phase 4 plan: Search · Type · Signal ·
 * Stability · Distribution · Version. The panel itself stays presentational —
 * all filter state lives in the parent (driven by the `listFilters` URL
 * contract).
 */

import { X } from "lucide-react";
import { useEffect } from "react";
import { TYPE_STRIPE_COLORS } from "@/components/ui/type-stripe-colors";
import type { CollectorComponentType } from "@/components/ui/type-stripe-colors";
import type { Distribution, ListFilters, Signal, StabilityFacet } from "@/v1/lib/list-filters";
import { CheckboxFacet, type FacetOption, SearchFacet, SelectFacet } from "./facets";

const TYPE_OPTIONS: FacetOption<CollectorComponentType>[] = [
  { value: "receiver", label: "Receiver", swatch: TYPE_STRIPE_COLORS.receiver },
  { value: "processor", label: "Processor", swatch: TYPE_STRIPE_COLORS.processor },
  { value: "exporter", label: "Exporter", swatch: TYPE_STRIPE_COLORS.exporter },
  { value: "connector", label: "Connector", swatch: TYPE_STRIPE_COLORS.connector },
  { value: "extension", label: "Extension", swatch: TYPE_STRIPE_COLORS.extension },
];

const SIGNAL_OPTIONS: FacetOption<Signal>[] = [
  { value: "traces", label: "Traces" },
  { value: "metrics", label: "Metrics" },
  { value: "logs", label: "Logs" },
  { value: "baggage", label: "Baggage" },
];

const STABILITY_OPTIONS: FacetOption<StabilityFacet>[] = [
  { value: "stable", label: "Stable", swatch: "hsl(145 63% 42%)" },
  { value: "beta", label: "Beta", swatch: "hsl(200 85% 45%)" },
  { value: "alpha", label: "Alpha", swatch: "hsl(38 95% 52%)" },
  { value: "development", label: "Development", swatch: "hsl(220 9% 60%)" },
  { value: "deprecated", label: "Deprecated", swatch: "hsl(0 70% 50%)" },
  { value: "unmaintained", label: "Unmaintained", swatch: "hsl(0 70% 50%)" },
];

const DISTRIBUTION_OPTIONS: FacetOption<Distribution>[] = [
  { value: "core", label: "Core" },
  { value: "contrib", label: "Contrib" },
];

export interface FacetCounts {
  types?: Partial<Record<CollectorComponentType, number>>;
  signals?: Partial<Record<Signal, number>>;
  stabilities?: Partial<Record<StabilityFacet, number>>;
  distributions?: Partial<Record<Distribution, number>>;
}

export interface FacetPanelProps {
  filters: ListFilters;
  onChange: (next: Partial<ListFilters>) => void;
  versions?: string[];
  counts?: FacetCounts;
  /** Mobile: when true the panel is rendered inside a drawer overlay. */
  isOpen?: boolean;
  onClose?: () => void;
}

function withCounts<T extends string>(
  options: FacetOption<T>[],
  counts?: Partial<Record<T, number>>
): FacetOption<T>[] {
  if (!counts) return options;
  return options.map((opt) => ({ ...opt, count: counts[opt.value] }));
}

export function FacetPanel({
  filters,
  onChange,
  versions,
  counts,
  isOpen = false,
  onClose,
}: FacetPanelProps) {
  // Close drawer on Escape
  useEffect(() => {
    if (!isOpen || !onClose) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose?.();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  return (
    <aside
      className={`td-facet-panel ${isOpen ? "td-facet-panel--open" : ""}`}
      aria-label="Filters"
    >
      {onClose && (
        <button
          type="button"
          className="td-facet-panel__close"
          aria-label="Close filters"
          onClick={onClose}
        >
          <X className="h-4 w-4" aria-hidden focusable="false" />
        </button>
      )}

      <SearchFacet
        title="Search"
        placeholder="Search name or description…"
        value={filters.q}
        onChange={(q) => onChange({ q, page: 1 })}
      />

      <CheckboxFacet
        title="Type"
        options={withCounts(TYPE_OPTIONS, counts?.types)}
        selected={filters.types}
        onChange={(types) => onChange({ types, page: 1 })}
      />

      <CheckboxFacet
        title="Signal"
        options={withCounts(SIGNAL_OPTIONS, counts?.signals)}
        selected={filters.signals}
        onChange={(signals) => onChange({ signals, page: 1 })}
      />

      <CheckboxFacet
        title="Stability"
        options={withCounts(STABILITY_OPTIONS, counts?.stabilities)}
        selected={filters.stabilities}
        onChange={(stabilities) => onChange({ stabilities, page: 1 })}
      />

      <CheckboxFacet
        title="Distribution"
        options={withCounts(DISTRIBUTION_OPTIONS, counts?.distributions)}
        selected={filters.distributions}
        onChange={(distributions) => onChange({ distributions, page: 1 })}
      />

      {versions && versions.length > 0 && (
        <SelectFacet
          title="Version"
          options={versions.map((v) => ({ value: v, label: v }))}
          value={filters.version}
          onChange={(version) => onChange({ version, page: 1 })}
          emptyLabel="Latest"
        />
      )}
    </aside>
  );
}
