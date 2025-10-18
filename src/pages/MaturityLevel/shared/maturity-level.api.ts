import { httpJson } from "@/shared/api";
import type { Section, Report } from "./types";

export function fetchSections(signal?: AbortSignal): Promise<Section[]> {
  return httpJson<Section[]>("/maturity-level", { signal });
}

export function postReport(stateJson: string, signal?: AbortSignal): Promise<Report> {
  return httpJson<Report>("/maturity-level/report", {
    method: "POST",
    body: stateJson,
    signal,
  });
}
