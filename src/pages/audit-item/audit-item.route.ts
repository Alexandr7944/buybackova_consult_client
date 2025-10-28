import {AuditItem} from "@/pages/audit-item/AuditItem.tsx";
import {fetchAuditItem} from "@/pages/audit-item/shared/audit-item.api.ts";
import type {LoaderFunctionArgs} from "react-router-dom";

export const Component = AuditItem;

export async function loader({params}: LoaderFunctionArgs) {
    const id = params?.id && +params.id;
    if (!id)
        throw new Error("Invalid ID");

    return fetchAuditItem(id);
}
