import ErrorPage from '~/pages/Error/ErrorPage';
import MainLayout from '../layouts/client/MainLayout';

import { Navigate } from 'react-router-dom';
import ProtectedLogged from '~/layouts/protected/ProtectedLogged';
import NotFoundPage from '~/pages/NotFound/NotFoundPage';
import {
    AuthPage,
    CartDetail,
    HomePage,
    MyAddressPage,
    MyDetailOrder,
    MyOrders,
    PaymentPage,
    ProductDetailPage,
    Profile,
    ShippingAddressPage,
    Suspense,
    VerifyAccountPage,
} from './LazyRoutes';
import CheckoutLayout from '~/layouts/checkout/CheckoutLayout';
import OrderSuccessPage from '~/pages/Checkout/OrderSuccessPage';
import OrderErrorPage from '~/pages/Checkout/OrderErrrorPage';
import AccountLayout from '~/layouts/client/AccountLayout';

const PublicRoutes = [
    {
        path: '/',
        element: <MainLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: '',
                element: (
                    <Suspense>
                        <HomePage />
                    </Suspense>
                ),
            },
            {
                path: '/product/:id',
                element: (
                    <Suspense>
                        <ProductDetailPage />
                    </Suspense>
                ),
            },
            {
                path: '/auth',
                element: (
                    <Suspense>
                        <ProtectedLogged type='LOGGED'>
                            <AuthPage />
                        </ProtectedLogged>
                    </Suspense>
                ),
            },
            {
                path: '/verifyAccount',
                element: (
                    <Suspense>
                        <ProtectedLogged type='LOGGED'>
                            <VerifyAccountPage />
                        </ProtectedLogged>
                    </Suspense>
                ),
            },
            {
                path: '/cart/detail',
                element: (
                    <Suspense>
                        <ProtectedLogged type='NOTLOG'>
                            <CartDetail />
                        </ProtectedLogged>
                    </Suspense>
                ),
            },
            {
                path: '/account',
                element: (
                    <ProtectedLogged type='NOTLOG'>
                        <AccountLayout/>
                    </ProtectedLogged>
                ),
                errorElement: <ErrorPage />,
                children: [
                    {
                        index: true,
                        element: <Navigate to={'/account/profile'}/>
                    },
                    {
                        path: 'profile',
                        element: (
                            <Suspense>
                                    <Profile />
                            </Suspense>
                        ),
                    },
                    {
                        path: 'my-orders',
                        element: (
                            <Suspense>
                                    <MyOrders />
                            </Suspense>
                        ),
                    },
                    {
                        path: 'my-orders/:id',
                        element: (
                            <Suspense>
                                    <MyDetailOrder />
                            </Suspense>
                        ),
                    },
                    {
                        path: 'my-address',
                        element: (
                            <Suspense>
                                    <MyAddressPage />
                            </Suspense>
                        ),
                    },
                ]
            },
        ],
    },
    {
        path: '/checkout',
        element: (
            <ProtectedLogged type='NOTLOG'>
                <CheckoutLayout />
            </ProtectedLogged>
        ),
        children: [
            {
                path: '',
                element: (
                    <Suspense>
                        <ShippingAddressPage />
                    </Suspense>
                ),
            },
            {
                path: 'payment',
                element: (
                    <Suspense>
                        <PaymentPage />
                    </Suspense>
                ),
            },
        ],
    },
    {
        path: '/order/success/:id',
        element: <OrderSuccessPage />,
    },
    {
        path: '/order/error/:orderId',
        element: <OrderErrorPage />,
    },
    {
        path: '*',
        element: <Navigate to={'/404'} />,
    },
    {
        path: '/404',
        element: <NotFoundPage />,
    },
];

export default PublicRoutes;
