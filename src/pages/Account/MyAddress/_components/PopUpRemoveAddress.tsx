import { DeleteOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import { useState } from 'react';
import { useRemoveAddress } from '~/hooks/mutations/address/useDeleteAddress';

export default function PopUpRemoveAddress({ id }: { id: string }) {
    const { mutate: mutateRemove, isPending: isPendingRemove } = useRemoveAddress();
    const [open, setOpen] = useState(false);
    const handleRemoveAddress = () => {
        mutateRemove(id, {
            onSuccess: () => {
                setOpen(false);
            },
        });
    };
    return (
        <Popconfirm
            placement='bottomRight'
            title={'Xóa địa chỉ này'}
            description={'Bạn có chắc chắn xóa địa chỉ này?'}
            okText={'Đồng ý'}
            open={open}
            onCancel={() => setOpen(false)}
            onConfirm={() => handleRemoveAddress()}
            cancelText='Không'
            disabled={isPendingRemove}
        >
            <DeleteOutlined onClick={() => setOpen(true)} className='text-xl' />
        </Popconfirm>
    );
}
