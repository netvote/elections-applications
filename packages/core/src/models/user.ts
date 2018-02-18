export interface Org {
    id: string;
    slug: string;
    displayName: string;
    logo?: string;
    streetAddress?: string;
    streetAddress2?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
    website?: string;
    email?: string;
    phone?: string;
    timeZone?: string;
    googlePlaceId?: string;
}

export interface User {
    id: string;
    uid: string;
    email: string;
    photoUrl?; string;
    displayName?: string;
    role?: string;
    settings: any;
    metrics: {
        authentication: {
            count: number;
            fails: number;
            last: Date;
        },
        ballots: {
            created: number;
        }
    };
    currentOrg: any;
}

export interface OrgUser {
    id: string;
    uid: string;
    orgid: string;
    roles: string[];
}
