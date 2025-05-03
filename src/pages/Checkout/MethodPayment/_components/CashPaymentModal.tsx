import { Modal, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useCreateCodOrder } from '~/hooks/mutations/order/useCreateCodOrder';
import { IOrderCreatePayload } from '~/interfaces/order';
import { useTypedSelector } from '~/store/store';
import { formatCurrency } from '~/utils/formatCurrrency';
import { EnvironmentOutlined, UserOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';

export default function CashPaymentModal({
    isOpen,
    setOpen,
    paymentMethod,
}: {
    isOpen: boolean;
    setOpen: (e: boolean) => void;
    paymentMethod: 'COD' | 'PAYOS';
}) {
    const { mutate, isPending } = useCreateCodOrder();
    const navigate = useNavigate();
    const checkOutInfor = useTypedSelector((state) => state.checkOut);

    const handleCancel = () => {
        setOpen(false);
    };

    const discount =
        checkOutInfor.voucher?.discountType === 'percentage'
            ? Math.min(
                  checkOutInfor.totalPrice * ((checkOutInfor.voucher?.voucherDiscount ?? 0) / 100),
                  checkOutInfor.voucher?.maxDiscountAmount ?? Infinity
              )
            : (checkOutInfor.voucher?.voucherDiscount ?? 0);

    const calTotalPriceWithVoucher = checkOutInfor.totalPrice - discount;

    const handleConfirm = () => {
        const payload: IOrderCreatePayload = {
            items: checkOutInfor.items ? [...checkOutInfor.items] : [],
            customerInfo: checkOutInfor.customerInfor,
            shippingAddress: {
                address: checkOutInfor.shippingAddress.address,
                country: checkOutInfor.shippingAddress.country,
                district: checkOutInfor.shippingAddress.district,
                province: checkOutInfor.shippingAddress.province,
                ward: checkOutInfor.shippingAddress.ward,
            },
            shippingFee: checkOutInfor.shippingFee,
            totalPrice: checkOutInfor.totalPrice,
            description: checkOutInfor.description,
            voucherCode: checkOutInfor.voucher ? checkOutInfor.voucher.code : null,
        };
        mutate(payload, {
            onSuccess: (data) => {
                setOpen(false);
                navigate(`/order/success/${data._id}`);
            },
        });
    };

    const modalVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
        exit: { opacity: 0, y: 50, transition: { duration: 0.2 } },
    };

    return (
        <Modal
            open={isOpen}
            width={800}
            onCancel={handleCancel}
            footer={<></>}
            onClose={handleCancel}
            centered
            className='custom-modal'
            closeIcon={<span className='text-gray-600 transition-colors hover:text-gray-800'>×</span>}
        >
            <AnimatePresence>
                {isOpen && (
                    <motion.div className='p-6' variants={modalVariants} initial='hidden' animate='visible' exit='exit'>
                        <h3 className='mb-6 bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-3xl font-bold text-transparent'>
                            Xác nhận đặt hàng
                        </h3>

                        <p className='mb-6 text-lg leading-relaxed text-gray-700'>
                            Bạn đang thanh toán đơn hàng với{' '}
                            <span className='font-semibold text-green-600'>{checkOutInfor.items?.length}</span> sản
                            phẩm, tổng giá{' '}
                            <span className='font-semibold text-green-600'>
                                {formatCurrency(calTotalPriceWithVoucher)}
                            </span>
                            , phương thức{' '}
                            <span className='font-semibold text-green-600'>
                                {paymentMethod === 'COD' ? 'Tiền mặt' : 'Online'}
                            </span>
                        </p>

                        <div className='mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2'>
                            <motion.div
                                className='rounded-xl border border-gray-100 bg-white p-5 shadow-lg transition-shadow duration-300 hover:shadow-xl'
                                whileHover={{ scale: 1.02 }}
                            >
                                <p className='mb-4 flex items-center text-xl font-semibold text-gray-800'>
                                    <EnvironmentOutlined className='mr-2 text-green-600' /> Địa chỉ giao hàng
                                </p>
                                <ul className='space-y-3 text-gray-600'>
                                    <li>
                                        <span className='text-base'>
                                            Tỉnh/Thành phố:{' '}
                                            <span className='font-medium text-gray-900'>
                                                {checkOutInfor.shippingAddress.province}
                                            </span>
                                        </span>
                                    </li>
                                    <li>
                                        <span className='text-base'>
                                            Quận/Huyện:{' '}
                                            <span className='font-medium text-gray-900'>
                                                {checkOutInfor.shippingAddress.district}
                                            </span>
                                        </span>
                                    </li>
                                    <li>
                                        <span className='text-base'>
                                            Phường/Xã:{' '}
                                            <span className='font-medium text-gray-900'>
                                                {checkOutInfor.shippingAddress.ward}
                                            </span>
                                        </span>
                                    </li>
                                    <li>
                                        <span className='text-base'>
                                            Địa chỉ:{' '}
                                            <span className='font-medium text-gray-900'>
                                                {checkOutInfor.shippingAddress.address}
                                            </span>
                                        </span>
                                    </li>
                                </ul>
                            </motion.div>

                            <motion.div
                                className='rounded-xl border border-gray-100 bg-white p-5 shadow-lg transition-shadow duration-300 hover:shadow-xl'
                                whileHover={{ scale: 1.02 }}
                            >
                                <p className='mb-4 flex items-center text-xl font-semibold text-gray-800'>
                                    <UserOutlined className='mr-2 text-green-600' /> Thông tin nhận hàng
                                </p>
                                <ul className='space-y-3 text-gray-600'>
                                    <li>
                                        <span className='text-base'>
                                            Tên người nhận:{' '}
                                            <span className='font-medium text-gray-900'>
                                                {checkOutInfor.customerInfor.name}
                                            </span>
                                        </span>
                                    </li>
                                    <li>
                                        <span className='text-base'>
                                            Email:{' '}
                                            <span className='font-medium text-gray-900'>
                                                {checkOutInfor.customerInfor.email}
                                            </span>
                                        </span>
                                    </li>
                                    <li>
                                        <span className='text-base'>
                                            Số điện thoại:{' '}
                                            <span className='font-medium text-gray-900'>
                                                {checkOutInfor.customerInfor.phone}
                                            </span>
                                        </span>
                                    </li>
                                </ul>
                            </motion.div>
                        </div>

                        <div className='flex justify-end gap-4'>
                            <button
                                onClick={handleCancel}
                                disabled={isPending}
                                className={`rounded-lg px-6 py-3 text-sm font-semibold transition-all ${
                                    isPending
                                        ? 'cursor-not-allowed bg-gray-300 text-gray-500'
                                        : 'border border-red-400 bg-red-100 text-red-600 hover:bg-red-500 hover:text-white'
                                }`}
                            >
                                Hủy bỏ
                            </button>
                            <button
                                onClick={handleConfirm}
                                disabled={isPending}
                                className={`flex items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold transition-all ${
                                    isPending
                                        ? 'cursor-not-allowed bg-gray-300 text-gray-500'
                                        : 'bg-gradient-to-r from-green-500 to-green-700 text-white hover:from-green-600 hover:to-green-800'
                                }`}
                            >
                                {isPending && <Spin className='mr-2' size='small' />}
                                Xác nhận
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </Modal>
    );
}
