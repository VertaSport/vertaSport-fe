/* eslint-disable @typescript-eslint/no-explicit-any */
import { Checkbox, ConfigProvider, Form, FormProps, Input, Modal, Radio, Select, Spin } from 'antd';
import { ReactNode, useEffect, useState } from 'react';
import { useGetProvinces } from '~/hooks/queries/shipping/useGetProvinces';
import WardSelectList from './WardSelect';
import DistrictSelectList from './DistrictSelect';
import { CheckboxGroupProps } from 'antd/es/checkbox';
import { useCreateAddress } from '~/hooks/mutations/address/useCreateAddress';
import { IPayloadCreateAddress } from '~/interfaces/address';
import { useGetdetailAddress } from '~/hooks/queries/address/useGetDetailAddress';
import { useUpdateAddress } from '~/hooks/mutations/address/useUpdateAddress';
export type IStateAddress = {
    province: string | null;
    district: string | null;
    ward: string | null;
    provinceId: string | null;
    districtId: string | null;
};
export default function ModalNewAddress({ children, id }: { children: ReactNode; id?: string }) {
    const [isOpen, setOpen] = useState(false);
    const { data } = useGetdetailAddress(id as string, isOpen);
    const { data: provinces } = useGetProvinces();
    const { mutate, isPending } = useCreateAddress();
    const { mutate: updateMutate, isPending: isPendingUpdate } = useUpdateAddress(id as string);
    const [address, setAddress] = useState<IStateAddress>({
        district: null,
        province: null,
        ward: null,
        provinceId: null,
        districtId: null,
    });
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const [form] = Form.useForm();
    useEffect(() => {
        if (data) {
            form.setFieldsValue({
                name: data?.name,
                phone: data?.phone,
                address: data?.address,
                province: data?.province,
                district: data?.district,
                ward: data?.ward,
                default: data.default,
                type: data.type,
                districtId: data.districtId,
                provinceId: data.provinceId,
                wardCode: data.ward,
            });
            setAddress({
                district: data.district,
                districtId: String(data.districtId),
                province: data.province,
                provinceId: String(data.provinceId),
                ward: data.ward,
            });
        }
    }, [data, form]);
    const onFinish: FormProps['onFinish'] = (values) => {
        const payload: IPayloadCreateAddress = {
            name: values.name,
            phone: values.phone,
            address: values.address,
            country: 'Việt Nam',
            province: address.province as string,
            district: address.district as string,
            ward: address.ward as string,
            default: values.default,
            districtId: Number(address.districtId),
            provinceId: Number(address.provinceId),
            type: values.type,
        };
        if (id) {
            updateMutate(payload, {
                onSuccess: () => {
                    setOpen(false);
                    form.resetFields();
                },
            });
        } else {
            mutate(payload, {
                onSuccess: () => {
                    setOpen(false);
                    form.resetFields();
                },
            });
        }
    };
    const handleSelectProvinceChange = (value: string, option: any) => {
        if (option) {
            setAddress({ province: option.label, district: null, ward: null, provinceId: value, districtId: null });
        } else {
            setAddress({ province: null, provinceId: null, district: null, districtId: null, ward: null });
        }
        form.setFieldsValue({
            districtId: null,
            wardCode: '',
            ward: '',
            district: '',
        });
    };
    const options: CheckboxGroupProps<string>['options'] = [
        { label: 'Nhà', value: 'Nhà' },
        { label: 'Công ty', value: 'Công ty' },
        { label: 'Khác', value: 'Khác' },
    ];
    return (
        <>
            <div onClick={handleOpen}>{children}</div>
            <Modal
                centered
                open={isOpen}
                width={'600px'}
                footer={<></>}
                destroyOnClose
                onCancel={handleClose}
                title={
                    <h3 className='text-xl font-semibold uppercase'>{id ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ mới'}</h3>
                }
                onClose={handleClose}
            >
                <div className='py-4'>
                    <ConfigProvider
                        theme={{
                            components: {
                                Input: {
                                    hoverBorderColor: '#8a8a8f',
                                    activeShadow: 'none',
                                    borderRadius: 3,
                                },
                                Select: {
                                    hoverBorderColor: '#8a8a8f',
                                    borderRadius: 3,
                                },
                            },
                            token: {
                                colorBorder: '#8a8a8f',
                            },
                        }}
                    >
                        <Form form={form} name='address' onFinish={onFinish} layout='vertical' autoComplete='off'>
                            <Form.Item
                                label='Họ và tên'
                                name='name'
                                rules={[
                                    { required: true, message: <>Họ và tên không được để trống</> },
                                    { min: 6, message: <>Họ và tên phải có ít nhất 6 ký tự</> },
                                ]}
                            >
                                <Input className='min-h-[40px]' placeholder='Họ và tên' />
                            </Form.Item>

                            <Form.Item
                                label='Số điện thoại'
                                name='phone'
                                rules={[
                                    { required: true, message: <>Số điện thoại không được để trống</> },
                                    {
                                        pattern: /^0\d{8,}$/,
                                        message: <>Bắt đầu bằng 0 và có ít nhất 9 ký tự</>,
                                    },
                                ]}
                            >
                                <Input className='min-h-[40px]' placeholder='Số điện thoại' />
                            </Form.Item>
                            <Form.Item
                                label='Địa chỉ chi tiết'
                                name='address'
                                rules={[
                                    { required: true, message: <>Địa chỉ chi tiết không được để trống</> },
                                    { min: 3, message: <>Địa chỉ chi tiết phải có ít nhất 3 ký tự</> },
                                ]}
                            >
                                <Input className='min-h-[40px]' placeholder='Địa chỉ' />
                            </Form.Item>
                            <div className='flex items-center gap-5'>
                                <Form.Item
                                    className='h-full w-[50%]'
                                    name='province'
                                    rules={[{ required: true, message: <></> }]}
                                    label='Tỉnh/Thành phố'
                                >
                                    <Select
                                        onChange={handleSelectProvinceChange}
                                        options={provinces}
                                        className='min-h-[40px]'
                                        allowClear
                                        placeholder='Tỉnh/ Thành phố'
                                    />
                                </Form.Item>
                                {address.provinceId ? (
                                    <DistrictSelectList
                                        address={address}
                                        provinceId={Number(address.provinceId)}
                                        setAddress={setAddress}
                                    />
                                ) : (
                                    <Form.Item
                                        label={'Quận/ Huyện'}
                                        className='w-[50%]'
                                        name='district'
                                        rules={[{ required: true, message: <></> }]}
                                    >
                                        <Select
                                            className='min-h-[40px]'
                                            placeholder='Quận/ Huyện'
                                            disabled
                                            allowClear
                                        />
                                    </Form.Item>
                                )}
                                {address.districtId ? (
                                    <WardSelectList
                                        address={address}
                                        districtId={Number(address.districtId)}
                                        setAddress={setAddress}
                                    />
                                ) : (
                                    <Form.Item
                                        name='ward'
                                        label='Phường/ Xã'
                                        className='w-[50%]'
                                        rules={[{ required: true, message: <></> }]}
                                    >
                                        <Select
                                            className='min-h-[40px]'
                                            placeholder='Chọn Phường/ Xã'
                                            disabled
                                            allowClear
                                        />
                                    </Form.Item>
                                )}
                            </div>
                            <Form.Item name='type' initialValue={'Khác'} label='Loại địa chỉ'>
                                <Radio.Group block options={options} optionType='button' buttonStyle='solid' />
                            </Form.Item>

                            <Form.Item name='default' valuePropName='checked'>
                                <Checkbox>Địa chỉ mặc định</Checkbox>
                            </Form.Item>

                            <div className='flex justify-between'>
                                <button
                                    type='submit'
                                    disabled={isPending}
                                    className='flex w-full cursor-pointer items-center justify-center rounded-md bg-black px-4 py-4 text-xs font-medium text-white uppercase duration-300 hover:bg-cyan-500'
                                >
                                    {isPending || isPendingUpdate ? <Spin /> : 'Thêm mới'}
                                </button>
                            </div>
                        </Form>
                    </ConfigProvider>
                </div>
            </Modal>
        </>
    );
}
