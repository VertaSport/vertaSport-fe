import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEY } from '~/constants/queryKey';
import { useToast } from '~/context/ToastProvider';
import { IPayloadCreateAddress } from '~/interfaces/address';
import { addressService } from '~/services/address.service';
import { useTypedSelector } from '~/store/store';
import { errorResponse } from '~/types/ErrorResponse';

export const useCreateAddress = () => {
    const toast = useToast();
    const queryClient = useQueryClient();
    const userId = useTypedSelector((state) => state.auth.user?._id);
    return useMutation({
        mutationKey: ['CREATE_ADDRESS'],
        mutationFn: (body: IPayloadCreateAddress) => addressService.createAddress(body),
        onSuccess: (data) => {
            toast('success', data.message);
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.ADDRESS.ROOT, userId],
            });
        },
        onError: (err: errorResponse) => {
            toast('info', err.message);
        },
    });
};
