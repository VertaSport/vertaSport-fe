import { useQuery } from '@tanstack/react-query';
import { QUERY_KEY } from '~/constants/queryKey';
import { addressService } from '~/services/address.service';

export const useGetdetailAddress = (id: string, isOpen: boolean) => {
    return useQuery({
        queryKey: [QUERY_KEY.ADDRESS.ROOT, id],
        queryFn: () => addressService.getDetailAddress(id),
        enabled: !!id && isOpen,
    });
};
