import { useQuery } from '@tanstack/react-query';
import { QUERY_KEY } from '~/constants/queryKey';
import { addressService } from '~/services/address.service';
import { useTypedSelector } from '~/store/store';

export const useGetAllAddress = () => {
    const userId = useTypedSelector((state) => state.auth.user?._id);
    return useQuery({
        queryKey: [QUERY_KEY.ADDRESS.ROOT, userId],
        queryFn: () => addressService.getAllAddress(),
    });
};
