import { IAddress, IPayloadCreateAddress } from '~/interfaces/address';
import { IServerResponse } from '~/interfaces/api';
import instance from '~/utils/api/axiosInstance';

export const addressService = {
    async getAllAddress() {
        const { data } = await instance.get<IAddress[]>(`/address/all`);
        return data;
    },
    async getDetailAddress(id: string) {
        const { data } = await instance.get<IAddress>(`/address/${id}`);
        return data;
    },
    async updateAddress(id: string, body: IPayloadCreateAddress) {
        const data = await instance.patch<IPayloadCreateAddress, IServerResponse<IAddress>>(
            `/address/update/${id}`,
            body
        );
        return data;
    },
    async createAddress(body: IPayloadCreateAddress) {
        const data = await instance.post<IPayloadCreateAddress, IServerResponse<IAddress>>('/address/create', body);
        return data;
    },
    async setDefaultAddress(id: string) {
        const data = await instance.patch<string, IServerResponse<IAddress>>(`/address/change-default/${id}`);
        return data;
    },
    async deleteAddress(id: string) {
        const data = await instance.delete<string, IServerResponse<IAddress>>(`/address/delete/${id}`);
        return data;
    },
};
