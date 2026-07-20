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

import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { CollectorDiffPageV1 } from "./diff-page";
import { useCollectorComponent } from "@/hooks/use-collector-data";
import type { CollectorComponent } from "@/types/collector";

vi.mock("@/hooks/use-collector-data", () => ({
  useCollectorComponent: vi.fn(),
}));

function makeComponent(overrides: Partial<CollectorComponent>): CollectorComponent {
  return {
    id: "core-otlpreceiver",
    name: "otlpreceiver",
    ecosystem: "collector",
    type: "receiver",
    distribution: "core",
    display_name: "OTLP Receiver",
    description: "Receives data via OTLP.",
    status: { class: "receiver", stability: { alpha: ["traces"] }, distributions: ["core"] },
    ...overrides,
  };
}

// The `from` snapshot: alpha, traces only, original description.
const FROM = makeComponent({
  status: { class: "receiver", stability: { alpha: ["traces"] }, distributions: ["core"] },
  description: "Receives data via OTLP.",
});
// The `to` snapshot: promoted to beta, gained a metrics signal, reworded.
const TO = makeComponent({
  status: {
    class: "receiver",
    stability: { beta: ["traces", "metrics"] },
    distributions: ["core"],
  },
  description: "Receives telemetry via gRPC or HTTP in OTLP format.",
});

type ComponentState = ReturnType<typeof useCollectorComponent>;

function mockByVersion(map: Record<string, Partial<ComponentState>>) {
  vi.mocked(useCollectorComponent).mockImplementation((_d, _n, version) => ({
    data: null,
    loading: false,
    error: null,
    ...map[version],
  }));
}

function renderAtRoute(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route
          path="/collector/components/:distribution/:name/diff"
          element={<CollectorDiffPageV1 />}
        />
      </Routes>
    </MemoryRouter>
  );
}

const BASE = "/collector/components/core/otlpreceiver/diff";

describe("CollectorDiffPageV1", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the invalid-params state when from/to are missing", () => {
    mockByVersion({});

    renderAtRoute(BASE);

    expect(screen.getByRole("alert")).toHaveTextContent("Pick two versions to compare");
    // No diff sections render without a valid pair.
    expect(screen.queryByText("Configuration schema")).not.toBeInTheDocument();
  });

  it("renders the live metadata diff between two versions", () => {
    mockByVersion({
      "0.149.0": { data: FROM, loading: false, error: null },
      "0.150.0": { data: TO, loading: false, error: null },
    });

    renderAtRoute(`${BASE}?from=0.149.0&to=0.150.0`);

    // Stability signal set changed (alpha -> beta).
    expect(screen.getByText("Stability signals:")).toBeInTheDocument();
    // A metrics signal was added between the two versions.
    expect(screen.getByText("+ signal metrics")).toBeInTheDocument();
    // The description was reworded.
    expect(screen.getByText("Description was updated.")).toBeInTheDocument();
  });

  it("shows the designed empty state for the config-schema section", () => {
    mockByVersion({
      "0.149.0": { data: FROM, loading: false, error: null },
      "0.150.0": { data: TO, loading: false, error: null },
    });

    renderAtRoute(`${BASE}?from=0.149.0&to=0.150.0`);

    expect(screen.getByText("Configuration schema")).toBeInTheDocument();
    expect(screen.getByText(/doesn't yet expose a per-version config schema/)).toBeInTheDocument();
  });

  it("reports no metadata changes when the two snapshots are identical", () => {
    mockByVersion({
      "0.149.0": { data: FROM, loading: false, error: null },
      "0.150.0": { data: FROM, loading: false, error: null },
    });

    renderAtRoute(`${BASE}?from=0.149.0&to=0.150.0`);

    expect(screen.getByText("No metadata changes between these versions.")).toBeInTheDocument();
  });

  it("shows the loading state while either version is in flight", () => {
    mockByVersion({
      "0.149.0": { data: null, loading: true, error: null },
      "0.150.0": { data: TO, loading: false, error: null },
    });

    renderAtRoute(`${BASE}?from=0.149.0&to=0.150.0`);

    expect(screen.getByRole("status")).toHaveTextContent("Loading both versions…");
  });

  it("shows the error state when a version fails to load", () => {
    mockByVersion({
      "0.149.0": { data: null, loading: false, error: new Error("boom") },
      "0.150.0": { data: TO, loading: false, error: null },
    });

    renderAtRoute(`${BASE}?from=0.149.0&to=0.150.0`);

    expect(screen.getByRole("alert")).toHaveTextContent("Couldn't load the diff");
    expect(screen.getByText("boom")).toBeInTheDocument();
  });
});
