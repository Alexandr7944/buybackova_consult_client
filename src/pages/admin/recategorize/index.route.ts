import {CategoryReassignPanel} from "@/pages/admin/recategorize/CategoryReassignPanel.tsx";
import {fetchBundleParams} from "@/pages/admin/recategorize/shared/recategorize.api.ts";

export const Component = CategoryReassignPanel;

export async function loader() {
    return fetchBundleParams();
}
