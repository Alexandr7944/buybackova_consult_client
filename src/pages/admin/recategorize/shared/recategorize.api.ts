import apiClient from "@/shared/axios.ts";
import type {BundleParams} from "@/pages/admin/recategorize/shared/types.ts";

export async function fetchBundleParams(): Promise<BundleParams> {
    const response = await apiClient.get<BundleParams>('/maturity-level/bundle-params');
    return response.data;
}
