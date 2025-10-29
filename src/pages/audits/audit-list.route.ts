import {AuditList} from "@/pages/audits/AuditList.tsx";
import type {LoaderFunctionArgs} from "react-router-dom";
import {fetchObject} from "@/pages/audits/shared/audits.api.ts";

export const Component = AuditList;

export async function loader({params, request}: LoaderFunctionArgs) {
    const id = params?.id && +params.id;
    if (!id)
        throw new Error("Invalid ID");

    return fetchObject(id, request.signal)
}
