/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQueryClient } from '@tanstack/react-query';
import { Form, Select } from 'antd';
import { useEffect } from 'react';
import { QUERY_KEY } from '~/constants/queryKey';
import { useGetDistrict } from '~/hooks/queries/shipping/useGetDistrict';
import { IStateAddress } from './ModalNewAddress';

const DistrictSelectList = ({
    provinceId,
    address,
    setAddress,
}: {
    provinceId: number;
    address: IStateAddress;
    setAddress: (value: IStateAddress) => void;
}) => {
    const { data: districtList } = useGetDistrict(provinceId);
    const queryClient = useQueryClient();
    const form = Form.useFormInstance();
    const handleSelectChange = (value: string, option: any) => {
        if (option) {
            setAddress({ ...address, district: option.label, ward: null, districtId: value });
        } else {
            setAddress({ ...address, district: null, ward: null, districtId: null });
        }
        form.setFieldsValue({
            wardCode: '',
            ward: '',
        });
    };
    useEffect(() => {
        queryClient.invalidateQueries({
            queryKey: [QUERY_KEY.SHIPPING.DISTRICT, provinceId],
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [provinceId]);

    return (
        <>
            <Form.Item
                label={'Quận/ Huyện'}
                className='w-[50%]'
                name='districtId'
                rules={[{ required: true, message: <></> }]}
            >
                <Select
                    className='min-h-[40px]'
                    onChange={handleSelectChange}
                    placeholder='Quận/ Huyện'
                    options={districtList}
                    allowClear
                />
            </Form.Item>
        </>
    );
};

export default DistrictSelectList;
