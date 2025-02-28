export interface IAddress {
    _id: string;
    userId: string;
    name: string;
    phone: string;
    country: string;
    province: string;
    district: string;
    ward: string;
    type: string;
    address: string;
    default: boolean;
}

export type IPayloadCreateAddress = {
    name: string;
    phone: string;
    country: string;
    province: string;
    district: string;
    ward: string;
    address: string;
    default: boolean;
    type: string;
};
