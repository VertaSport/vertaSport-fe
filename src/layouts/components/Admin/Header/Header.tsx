import { Link } from 'react-router-dom';
import { MenuOutlined, BellFilled, DownOutlined } from '@ant-design/icons';
import logo from '~/assets/logo.png';

const Header = (props: { sidebarOpen: boolean; setSidebarOpen: (arg0: boolean) => void }) => {
    return (
        <header className='sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur dark:border-gray-800 dark:bg-[#0B1324]/90'>
            <div className='mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8'>
                <div className='flex items-center gap-4'>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            props.setSidebarOpen(!props.sidebarOpen);
                        }}
                        className='hover:text-primary text-gray-600 lg:hidden dark:text-gray-300'
                    >
                        <MenuOutlined className='text-xl' />
                    </button>

                    <Link to='/' className='flex items-center gap-2'>
                        <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#da291c] to-[#a81c12]'>
                            <img src={logo} alt='Admin Logo' className='h-8 w-8 object-contain' />
                        </div>
                        <div className='hidden sm:block'>
                            <span className='text-xl font-semibold text-gray-900 dark:text-white'>Verta Sport</span>
                            <span className='ml-2 text-sm font-medium text-gray-500 dark:text-gray-400'>
                                | Admin Dashboard
                            </span>
                        </div>
                    </Link>
                </div>

                <div className='flex items-center gap-6'>
                    <button className='hover:text-primary relative text-gray-600 transition-colors dark:text-gray-300'>
                        <BellFilled className='text-xl' />
                        <span className='absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500'></span>
                    </button>

                    <div className='flex items-center gap-2'>
                        <div className='h-9 w-9 rounded-full bg-gradient-to-br from-[#da291c] to-[#a81c12]'></div>
                        <div className='hidden md:block'>
                            <p className='text-sm font-medium text-gray-900 dark:text-white'>Admin User</p>
                            <p className='text-xs text-gray-500 dark:text-gray-400'>Quản trị viên</p>
                        </div>
                        <DownOutlined className='text-gray-400' />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
