import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/navigation';
import HomeNewBannerOne from '~/assets/banner_home1.jpg';
import HomeNewBannerTwo from '~/assets/banner_home2.jpg';
import BannerSlider from '~/components/BannerSlider/BannerSlider';
import ProductWrapper from '~/components/ProductWrapper/ProductWrapper';
import { useGetProductsBestSelling } from '~/hooks/queries/products/useGetProductsBestSelling';
import { useGetProductsNewest } from '~/hooks/queries/products/useGetProductsNewest';
import { IProductDetail } from '~/interfaces/product';
import '~/styles/customSwiper.css';

export default function HomePage() {
    const { data: bestSellingData, isPending: isPendingBestSelling } = useGetProductsBestSelling();
    const { data: newestData, isPending: isPendingNewest } = useGetProductsNewest();
    const location = useLocation();

    useEffect(() => {
        if (location.hash) {
            const element = document.getElementById(location.hash.substring(1));
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [location]);
    return (
        <>
            <BannerSlider />
            <div className='my-1 flex items-center justify-between gap-1'>
                <div className='basis-[50%] bg-[#f0eff3]'>
                    <img src={HomeNewBannerOne} alt='Bộ sưu tập mới' className='w-full' />
                    <div className='flex items-baseline justify-between px-4 py-3'>
                        <span className='text-primary text-lg font-medium uppercase'>new collection</span>
                        <span className='text-primary text-sm font-thin uppercase'>shop now</span>
                    </div>
                </div>
                <div className='basis-[50%] bg-[#f0eff3]'>
                    <img src={HomeNewBannerTwo} alt='Danh mục' className='w-full' />
                    <div className='flex items-baseline justify-between px-4 py-3'>
                        <span className='text-primary text-lg font-medium uppercase'>croptop</span>
                        <span className='text-primary text-sm font-thin uppercase'>shop now</span>
                    </div>
                </div>
            </div>
            <div className='mx-6 max-w-7xl xl:mx-auto'>
                <div>
                    <ProductWrapper<IProductDetail[]>
                        title='SẢN PHẨM MỚI'
                        description='Những sản phẩm xu hướng thời trang mới'
                        data={newestData?.data.data}
                        isPending={isPendingBestSelling}
                    />
                </div>
                <div id='selling' className='mt-12'>
                    <ProductWrapper<IProductDetail[]>
                        title='SẢN PHẨM BÁN CHẠY'
                        description='Những sản phẩm được mua nhiều nhất ở trên hệ thống'
                        data={bestSellingData?.data.data}
                        isPending={isPendingNewest}
                    />
                </div>
            </div>
        </>
    );
}
