import apiClient from "@/shared/axios.ts";
import type {BundleParams, Question} from "@/pages/admin/recategorize/shared/types.ts";

export async function fetchBundleParams(): Promise<BundleParams> {
    const response = await apiClient.get<BundleParams>('/maturity-level/bundle-params');
    return response.data;
}

export async function updateQuestion(stateJson: string): Promise<Question | null> {
    const id: number = JSON.parse(stateJson).id;

    return apiClient.patch(`/maturity-level/question/${id}`, stateJson)
        .then(response => response.data);
}
