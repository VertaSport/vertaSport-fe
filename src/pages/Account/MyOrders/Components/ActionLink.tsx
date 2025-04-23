import { MinusCircleOutlined } from '@ant-design/icons';
import { TinyColor } from '@ctrl/tinycolor';
import { Button, ConfigProvider, Flex, Form, Modal, Radio, Tag } from 'antd';
import { OrderStatus } from '~/constants/enum';
import useFinishOrderClient from '~/hooks/mutations/order/useFinishOrderClient';
import { useToast } from '~/context/ToastProvider';
import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import useCancelOrder from '~/hooks/mutations/order/useCancelOrder';
import { ORDER_STATUS } from '~/constants/order';
import TextArea from 'antd/es/input/TextArea';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShippingFast, FaBoxOpen, FaInfoCircle, FaExchangeAlt, FaSearchDollar, FaCreditCard } from 'react-icons/fa';

const schemaFormCancelOrder = z.object({
    reason: z.string({ message: 'Vui lòng chọn lý do hủy đơn!' }),
    description: z.string().optional(),
});

type IFormCancelOrder = z.infer<typeof schemaFormCancelOrder>;

const colorsArr = ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'];
const getHoverColors = (colors: string[]) => colors.map((color) => new TinyColor(color).lighten(5).toString());
const getActiveColors = (colors: string[]) => colors.map((color) => new TinyColor(color).darken(5).toString());

const ActionLink = ({ status, orderId }: { status: OrderStatus; orderId: string }) => {
    const toast = useToast();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [visible, setVisible] = useState(false);

    const {
        control,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm<IFormCancelOrder>({
        resolver: zodResolver(schemaFormCancelOrder),
    });

    const reason = watch('reason');

    useEffect(() => {
        setVisible(reason === 'orther');
    }, [reason]);

    const { mutateAsync, isSuccess, isPending: cancelPending } = useCancelOrder(orderId);
    const { mutateAsync: finishOrder, isPending } = useFinishOrderClient();

    const handleFinishOrder = async () => {
        const res = await finishOrder(orderId);
        if (res) {
            toast('success', 'Cảm ơn bạn đã xác nhận!');
        }
    };

    const showModal = () => {
        setIsModalOpen(true);
        reset();
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        reset();
    };

    useEffect(() => {
        if (isSuccess) {
            toast('success', 'Hủy đơn hàng thành công!');
            setIsModalOpen(false);
            reset();
        }
    }, [isSuccess, reset, toast]);

    const onSubmit: SubmitHandler<IFormCancelOrder> = async (data) => {
        try {
            if (data.reason === 'orther') {
                const reasonCombined = data.description || '';
                await mutateAsync(reasonCombined);
            } else {
                await mutateAsync(data.reason);
            }
            toast('success', 'Hủy đơn hàng thành công!');
            setIsModalOpen(false);
            reset();
        } catch (error) {
            toast('error', 'Hủy đơn thất bại!');
        }
    };

    const cancelReasons = [
        { value: 'Chi phí vận chuyển cao', label: 'Chi phí vận chuyển cao', icon: <FaShippingFast /> },
        { value: 'Hết hàng', label: 'Hết hàng', icon: <FaBoxOpen /> },
        { value: 'Sai thông tin sản phẩm', label: 'Sai thông tin sản phẩm', icon: <FaInfoCircle /> },
        { value: 'Thay đổi ý định', label: 'Thay đổi ý định', icon: <FaExchangeAlt /> },
        { value: 'Tìm được giá rẻ hơn', label: 'Tìm được giá rẻ hơn', icon: <FaSearchDollar /> },
        { value: 'Lỗi thanh toán', label: 'Lỗi thanh toán', icon: <FaCreditCard /> },
        { value: 'orther', label: 'Khác', icon: null },
    ];

    switch (status) {
        case OrderStatus.pending:
            return (
                <>
                    <Button
                        onClick={showModal}
                        type='primary'
                        loading={cancelPending}
                        danger
                        className='transform rounded-lg bg-red-500 font-medium text-white shadow-md transition-all hover:scale-105 hover:bg-red-600 hover:shadow-lg'
                    >
                        Hủy đơn hàng
                    </Button>
                    <Modal
                        open={isModalOpen}
                        footer={null}
                        onCancel={handleCancel}
                        centered
                        width={650}
                        className='overflow-hidden rounded-xl'
                        styles={{ body: { padding: 0 } }}
                    >
                        <AnimatePresence>
                            {isModalOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    transition={{ duration: 0.3 }}
                                    className='bg-gradient-to-b from-gray-50 to-white p-8'
                                >
                                    <h2 className='mb-6 text-2xl font-bold text-gray-800'>
                                        Lý do bạn muốn hủy đơn hàng?
                                    </h2>
                                    <Form
                                        onFinish={handleSubmit(onSubmit)}
                                        className='w-full'
                                        name='cancel-order-form'
                                        layout='vertical'
                                    >
                                        <Form.Item
                                            validateStatus={errors.reason ? 'error' : ''}
                                            help={
                                                errors.reason ? (
                                                    <span className='text-red-500'>{errors.reason.message}</span>
                                                ) : null
                                            }
                                            label={<span className='text-lg font-semibold text-gray-700'>Lý do</span>}
                                            required
                                        >
                                            <Controller
                                                name='reason'
                                                control={control}
                                                render={({ field }) => (
                                                    <Radio.Group {...field} className='grid gap-3'>
                                                        {status !== ORDER_STATUS.SHIPPING &&
                                                            cancelReasons.map((reasonItem) => (
                                                                <Radio
                                                                    key={reasonItem.value}
                                                                    value={reasonItem.value}
                                                                    className='w-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-blue-300 hover:shadow-md'
                                                                    aria-label={reasonItem.label}
                                                                >
                                                                    <Flex align='center' gap='small'>
                                                                        {reasonItem.icon && (
                                                                            <span className='text-lg text-blue-500'>
                                                                                {reasonItem.icon}
                                                                            </span>
                                                                        )}
                                                                        <span className='font-medium text-gray-700'>
                                                                            {reasonItem.label}
                                                                        </span>
                                                                    </Flex>
                                                                </Radio>
                                                            ))}
                                                    </Radio.Group>
                                                )}
                                            />
                                        </Form.Item>
                                        <AnimatePresence>
                                            {visible && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    <Form.Item
                                                        validateStatus={errors.description ? 'error' : ''}
                                                        help={
                                                            errors.description ? (
                                                                <span className='text-red-500'>
                                                                    {errors.description.message}
                                                                </span>
                                                            ) : null
                                                        }
                                                        label={
                                                            <span className='text-lg font-semibold text-gray-700'>
                                                                Mô tả chi tiết
                                                            </span>
                                                        }
                                                    >
                                                        <Controller
                                                            name='description'
                                                            control={control}
                                                            render={({ field }) => (
                                                                <TextArea
                                                                    {...field}
                                                                    rows={4}
                                                                    placeholder='Vui lòng mô tả lý do chi tiết để chúng tôi hỗ trợ bạn tốt hơn...'
                                                                    className='rounded-lg border-gray-300 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                                                                />
                                                            )}
                                                        />
                                                    </Form.Item>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                        <Flex justify='end' gap='small' className='mt-8'>
                                            <Button
                                                onClick={handleCancel}
                                                type='default'
                                                className='transform rounded-lg border-gray-300 bg-white text-gray-700 shadow-sm transition-all hover:scale-105 hover:bg-gray-100 hover:shadow-md'
                                            >
                                                Thoát
                                            </Button>
                                            <Button
                                                htmlType='submit'
                                                loading={isPending}
                                                type='primary'
                                                className='transform rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md transition-all hover:scale-105 hover:from-blue-600 hover:to-blue-700 hover:shadow-lg'
                                            >
                                                Xác nhận hủy
                                            </Button>
                                        </Flex>
                                    </Form>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Modal>
                </>
            );

        case OrderStatus.confirmed:
        case OrderStatus.shipping:
            return <></>;

        case OrderStatus.delivered:
            return (
                <Button
                    onClick={handleFinishOrder}
                    loading={isPending}
                    type='primary'
                    className='transform rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md transition-all hover:scale-105 hover:from-green-600 hover:to-green-700 hover:shadow-lg'
                >
                    Tôi đã nhận được hàng
                </Button>
            );

        case OrderStatus.cancelled:
            return (
                <Button
                    type='primary'
                    danger
                    disabled
                    className='cursor-not-allowed rounded-lg bg-red-300 text-white opacity-60 shadow-sm'
                >
                    Đã bị hủy
                </Button>
            );

        case OrderStatus.done:
            return (
                <ConfigProvider
                    theme={{
                        components: {
                            Button: {
                                colorPrimary: `linear-gradient(90deg, ${colorsArr.join(', ')})`,
                                colorPrimaryHover: `linear-gradient(90deg, ${getHoverColors(colorsArr).join(', ')})`,
                                colorPrimaryActive: `linear-gradient(90deg, ${getActiveColors(colorsArr).join(', ')})`,
                                lineWidth: 0,
                            },
                        },
                    }}
                ></ConfigProvider>
            );

        default:
            return (
                <Tag
                    icon={<MinusCircleOutlined />}
                    color='default'
                    className='rounded-lg border-gray-300 text-gray-600'
                >
                    Lỗi!!
                </Tag>
            );
    }
};

export default ActionLink;
