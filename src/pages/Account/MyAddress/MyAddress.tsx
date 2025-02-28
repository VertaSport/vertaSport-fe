import { EditOutlined } from '@ant-design/icons';
import { Checkbox, Spin } from 'antd';
import { useChangeDefaultAddress } from '~/hooks/mutations/address/useChangeDefaultAddress';
import { useGetAllAddress } from '~/hooks/queries/address/useGetAllAddress';
import ModalNewAddress from './_components/ModalNewAddress';
import PopUpRemoveAddress from './_components/PopUpRemoveAddress';

export default function MyAddress() {
    const { data, isLoading } = useGetAllAddress();
    const { mutate, isPending } = useChangeDefaultAddress();
    const handleChangeDefaultAddress = (id: string) => {
        mutate(id);
    };

    return (
        <div className='border border-gray-200 px-6 py-8'>
            <h1 className='text-2xl font-bold uppercase select-none'>Thông tin giao hàng ({data?.length}/ 5)</h1>
            {isLoading ? (
                <div className='mt-8 flex min-h-[30vh] items-center justify-center'>
                    <Spin />
                </div>
            ) : (
                <div className='mt-8 flex flex-col gap-2'>
                    {/* BOX ADDRESS */}
                    {data && data.length !== 0 ? (
                        data.map((item, index) => (
                            <div key={index} className='rounded-sm border border-gray-200 px-4 py-2'>
                                <div className='flex justify-between'>
                                    <div className='flex items-center gap-2'>
                                        <h3 className='font-bold'>{item.name}</h3>
                                        <span className='text-sm text-gray-500'>Loại địa chỉ: {item.type}</span>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <ModalNewAddress id={item._id}>
                                            <EditOutlined className='cursor-pointer text-xl' />
                                        </ModalNewAddress>
                                        {!item.default && <PopUpRemoveAddress id={item._id} />}
                                    </div>
                                </div>
                                <p className='mt-2 text-sm'>
                                    Số điện thoại: <span className='font-bold'>{item.phone}</span>
                                </p>
                                <div className='mt-2'>
                                    <p className='text-gray-500'>
                                        {item.address}, {item.ward}, {item.district}, {item.province}, {item.country}
                                    </p>
                                </div>
                                <div className='mt-4 flex items-center gap-2'>
                                    <Checkbox
                                        disabled={isPending}
                                        checked={item.default}
                                        onChange={() => handleChangeDefaultAddress(item._id)}
                                    >
                                        {item.default ? 'Mặc định' : 'Đặt làm địa chỉ mặc định'}
                                    </Checkbox>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className='flex h-[10vh] w-full items-center justify-center'>
                            <span>Bạn Không có địa chỉ nào</span>
                        </div>
                    )}
                </div>
            )}

            <div className='mt-6'>
                <ModalNewAddress>
                    <button
                        type='submit'
                        className='cursor-pointer bg-[#110e11] px-8 py-2 text-base font-semibold text-white uppercase duration-300 hover:opacity-80'
                    >
                        Thêm địa chỉ
                    </button>
                </ModalNewAddress>
            </div>
        </div>
    );
}
