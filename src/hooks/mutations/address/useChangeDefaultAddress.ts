import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEY } from '~/constants/queryKey';
import { useToast } from '~/context/ToastProvider';
import { addressService } from '~/services/address.service';
import { useTypedSelector } from '~/store/store';
import { errorResponse } from '~/types/ErrorResponse';

export const useChangeDefaultAddress = () => {
    const toast = useToast();
    const queryClient = useQueryClient();
    const userId = useTypedSelector((state) => state.auth.user?._id);
    return useMutation({
        mutationFn: (id: string) => addressService.setDefaultAddress(id),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.ADDRESS.ROOT, userId],
            });
            toast('success', data.message);
        },
        onError: (err: errorResponse) => {
            toast('info', err.message);
        },
    });
};
