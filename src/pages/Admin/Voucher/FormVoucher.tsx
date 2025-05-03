import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Form, Input, InputNumber, DatePicker, Switch, Button, Radio } from 'antd';
import { ADMIN_ROUTES } from '~/constants/router';
import WrapperPageAdmin from '../_common';
import moment from 'moment';
import WrapperCard from '~/components/_common/WrapperCard';
import { useGetDetailsVoucher } from '~/hooks/queries/vouchers/useGetDetailsVoucher';
import { useCreateVoucher } from '~/hooks/mutations/vouchers/useCreateVoucher';
import { useUpdateVoucher } from '~/hooks/mutations/vouchers/useUpdateVoucher';
import { IVoucherDTO } from '~/types/Voucher';

// Update enum to match schema
enum DiscountType {
    Percentage = 'percentage',
    Fixed = 'fixed',
}

const FormVoucher = () => {
    const [form] = Form.useForm();
    const { id } = useParams<{ id: string }>();
    const { data: voucherDetails } = useGetDetailsVoucher(id!);
    const [isLoading, setIsLoading] = useState(false);
    const { mutateAsync: createVoucher } = useCreateVoucher();
    const { mutateAsync: updateVoucher } = useUpdateVoucher();
    const [isResetCode, setIsResetCode] = useState(false);
    const [discountType, setDiscountType] = useState<DiscountType | null>(null);

    const handleUpdateAndResetCode = () => {
        setIsResetCode(true);
        form.setFieldsValue({ resetCode: true });
    };

    const handleSubmit = async (values: IVoucherDTO) => {
        setIsLoading(true);
        values.status = !!values.status;
        values.isOnlyForNewUser = !!values.isOnlyForNewUser;
        try {
            if (id) {
                await updateVoucher({ id, newVOucher: values });
            } else {
                await createVoucher(values);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDiscountTypeChange = (e: any) => {
        setDiscountType(e.target.value);
    };

    useEffect(() => {
        if (voucherDetails && discountType === null) {
            form.setFieldsValue({
                name: voucherDetails.name,
                code: voucherDetails.code,
                discountType: discountType || voucherDetails.discountType,
                voucherDiscount: voucherDetails.voucherDiscount,
                maxDiscountAmount: voucherDetails.maxDiscountAmount,
                startDate: moment(voucherDetails.startDate),
                endDate: moment(voucherDetails.endDate),
                minimumOrderPrice: voucherDetails.minimumOrderPrice,
                status: voucherDetails.status,
                maxUsage: voucherDetails.maxUsage,
                isOnlyForNewUser: voucherDetails.isOnlyForNewUser,
                usagePerUser: voucherDetails.usagePerUser,
            });
            setDiscountType((voucherDetails.discountType as DiscountType) || DiscountType.Percentage);
        } else {
            if (!id && !discountType) {
                form.setFieldsValue({
                    discountType: DiscountType.Percentage,
                    maxDiscountAmount: 0,
                });
                setDiscountType(DiscountType.Percentage);
            }
        }
    }, [voucherDetails, discountType, form]);

    return (
        <WrapperPageAdmin
            title={id ? 'Cập nhật voucher' : 'Tạo voucher'}
            option={
                <Link to={ADMIN_ROUTES.VOUCHER} className='underline'>
                    Quay lại
                </Link>
            }
        >
            <Form form={form} onFinish={handleSubmit} layout='vertical' className='flex flex-col gap-4'>
                <WrapperCard title='Thông tin voucher'>
                    <Form.Item name='resetCode' className='hidden' hidden>
                        <Input type='hidden' />
                    </Form.Item>
                    <Form.Item<IVoucherDTO>
                        label='Tên Voucher'
                        name='name'
                        rules={[{ required: true, message: 'Vui lòng đền tên voucher!' }]}
                    >
                        <Input size='large' placeholder='Nhập tên voucher...' />
                    </Form.Item>

                    <Form.Item<IVoucherDTO>
                        label='Loại giảm giá'
                        name='discountType'
                        rules={[{ required: true, message: 'Vui lòng chọn loại giảm giá!' }]}
                    >
                        <Radio.Group onChange={handleDiscountTypeChange}>
                            <Radio value={DiscountType.Percentage}>Giảm giá theo phần trăm</Radio>
                            <Radio value={DiscountType.Fixed}>Giảm giá cố định</Radio>
                        </Radio.Group>
                    </Form.Item>

                    {discountType === DiscountType.Percentage ? (
                        <Form.Item<IVoucherDTO>
                            label={'Phần trăm giảm giá (%)'}
                            name='voucherDiscount'
                            rules={[
                                { required: true, message: 'Vui lòng nhập giá trị giảm giá!' },
                                { type: 'number', min: 1, max: 100, message: 'Phần trăm phải từ 1-100!' },
                            ]}
                        >
                            <InputNumber size='large' style={{ width: '100%' }} placeholder={'Nhập % giảm giá'} />
                        </Form.Item>
                    ) : (
                        <Form.Item<IVoucherDTO>
                            label={'Giá trị giảm giá'}
                            name='voucherDiscount'
                            rules={[{ required: true, message: 'Vui lòng nhập giá trị giảm giá!' }]}
                        >
                            <InputNumber
                                size='large'
                                style={{ width: '100%' }}
                                placeholder={'Nhập giá trị giảm giá'}
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                            />
                        </Form.Item>
                    )}

                    {discountType === DiscountType.Percentage && (
                        <Form.Item<IVoucherDTO>
                            label='Giảm giá tối đa'
                            name='maxDiscountAmount'
                            rules={[{ required: true, message: 'Vui lòng nhập giá trị giảm giá tối đa!' }]}
                        >
                            <InputNumber
                                size='large'
                                style={{ width: '100%' }}
                                placeholder='Nhập giá trị giảm giá tối đa'
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                            />
                        </Form.Item>
                    )}

                    <Form.Item<IVoucherDTO>
                        label='Giá trị đơn hàng tối thiểu'
                        name='minimumOrderPrice'
                        rules={[
                            { required: true, message: 'Vui lòng nhập giá trị đơn hàng tối thiểu!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (
                                        !value ||
                                        discountType === DiscountType.Percentage ||
                                        value > getFieldValue('voucherDiscount')
                                    ) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject('Giá trị đơn hàng tối thiểu phải lớn hơn giá trị giảm giá');
                                },
                            }),
                        ]}
                    >
                        <InputNumber
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                            style={{ width: '100%' }}
                            size='large'
                            placeholder='Nhập giá trị đơn hàng tối thiểu'
                        />
                    </Form.Item>
                    <Form.Item<IVoucherDTO>
                        label='Số lượng'
                        name='maxUsage'
                        rules={[{ required: true, message: 'Tổng số lượng voucher!' }]}
                    >
                        <InputNumber
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                            size='large'
                            style={{ width: '100%' }}
                            placeholder='Nhập số lượng cho voucher này'
                        />
                    </Form.Item>
                    <Form.Item<IVoucherDTO>
                        label='Số lượng dùng trên mỗi người'
                        name='usagePerUser'
                        rules={[{ required: true, message: 'Só lượng sử dụng trên một người tối thiếu là 1!' }]}
                    >
                        <InputNumber
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                            size='large'
                            style={{ width: '100%' }}
                            placeholder='Nhập số lượng cho voucher này'
                        />
                    </Form.Item>
                </WrapperCard>
                <WrapperCard title='Thời gian áp dụng'>
                    <Form.Item<IVoucherDTO>
                        label='Ngày bắt đầu'
                        name='startDate'
                        rules={[
                            { required: true, message: 'Vui lòng chọn ngày bắt đầu!' },
                            {
                                validator: (_, value) => {
                                    if (id) {
                                        return Promise.resolve();
                                    }
                                    if (value && value.startOf('day').isBefore(moment().startOf('day'))) {
                                        return Promise.reject('Ngày bắt đầu phải từ ngày hiện tại trở đi');
                                    }
                                    return Promise.resolve();
                                },
                            },
                        ]}
                    >
                        <DatePicker placeholder='Chọn ngày bắt đầu' />
                    </Form.Item>

                    <Form.Item<IVoucherDTO>
                        label='Ngày kết thúc'
                        name='endDate'
                        rules={[
                            { required: true, message: 'Vui lòng chọn ngày bắt đầu!' },
                            {
                                validator: (_, value) =>
                                    value && value.isBefore(moment())
                                        ? Promise.reject('Ngày kết thúc phải lớn hơn ngày hiện tại')
                                        : Promise.resolve(),
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || value.isAfter(getFieldValue('startDate'))) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject('Ngày kết thúc phải lớn hơn ngày bắt đầu');
                                },
                            }),
                        ]}
                    >
                        <DatePicker showTime placeholder='Chọn thời gian kết thúc' />
                    </Form.Item>
                </WrapperCard>
                <WrapperCard title='Cài đặt voucher'>
                    <Form.Item<IVoucherDTO> label='Công khai' name='status' valuePropName='checked'>
                        <Switch />
                    </Form.Item>

                    <Form.Item<IVoucherDTO>
                        label='Dành cho người dùng mới'
                        name='isOnlyForNewUser'
                        valuePropName='checked'
                    >
                        <Switch />
                    </Form.Item>
                </WrapperCard>
                <Form.Item>
                    <div className='flex gap-2'>
                        <Button
                            loading={isLoading && !isResetCode}
                            disabled={isLoading}
                            type='primary'
                            htmlType='submit'
                        >
                            {id ? 'Cập nhật' : 'Tạo mới'}
                        </Button>
                        {id && (
                            <Button
                                loading={isLoading && isResetCode}
                                disabled={isLoading}
                                type='dashed'
                                htmlType='submit'
                                onClick={handleUpdateAndResetCode}
                            >
                                Cập nhật và reset mã voucher
                            </Button>
                        )}
                    </div>
                </Form.Item>
            </Form>
        </WrapperPageAdmin>
    );
};

export default FormVoucher;
