export type Company = {
    id: number;
    name: string;
    ownerId: number | null;
    owner: {
        id: number;
        name: string;
    } | null,
    users: {
        id: number;
        name: string;
    }[],
    objects: {
        id: number;
        name: string;
        address: string;
    }[],
}
