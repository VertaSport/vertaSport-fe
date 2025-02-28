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
    provinceId: number;
    districtId: number;
    default: boolean;
}

export type IPayloadCreateAddress = {
    name: string;
    phone: string;
    country: string;
    province: string;
    provinceId: number;
    districtId: number;
    district: string;
    ward: string;
    address: string;
    default: boolean;
    type: string;
};
