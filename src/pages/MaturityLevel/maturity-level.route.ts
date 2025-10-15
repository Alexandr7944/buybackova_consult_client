import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router-dom";
import { MaturityLevel } from "@/pages/MaturityLevel";
import {fetchSections, postReport} from "@/pages/MaturityLevel/shared/maturity-level.api.ts";

// Роутер будет забирать этот модуль через lazy()
export const Component = MaturityLevel;

export async function loader({ request }: LoaderFunctionArgs) {
  return fetchSections(request.signal);
}

export async function action({ request }: ActionFunctionArgs) {
    debugger;
  const formData = await request.formData();
  const state = formData.get("state");

  if (typeof state !== "string" || state.length === 0) {
    return new Response(JSON.stringify({ message: "Некорректные данные формы" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  return postReport(state, request.signal);
}
