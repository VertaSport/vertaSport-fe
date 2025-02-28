/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useQueryClient } from '@tanstack/react-query';
import { Form, Select } from 'antd';
import { useEffect } from 'react';
import { QUERY_KEY } from '~/constants/queryKey';
import { useGetWards } from '~/hooks/queries/shipping/useGetWard';
import { IStateAddress } from './ModalNewAddress';

const WardSelectList = ({
    districtId,
    setAddress,
    address,
}: {
    districtId: number;
    address: IStateAddress;
    setAddress: (value: IStateAddress) => void;
}) => {
    const { data: wardList } = useGetWards(districtId);
    const queryClient = useQueryClient();
    useEffect(() => {
        queryClient.invalidateQueries({
            queryKey: [QUERY_KEY.SHIPPING.WARD, districtId],
        });
    }, [districtId]);
    const handleSelectChange = (value: string, option: any) => {
        if (option) {
            setAddress({ ...address, ward: option.label });
        } else {
            setAddress({ ...address, ward: null });
        }
    };

    return (
        <Form.Item name='wardCode' label='Phường/ Xã' className='w-[50%]' rules={[{ required: true, message: <></> }]}>
            <Select
                className='min-h-[40px]'
                onChange={handleSelectChange}
                placeholder='Chọn Phường/ Xã'
                options={wardList}
                allowClear
            />
        </Form.Item>
    );
};

export default WardSelectList;
