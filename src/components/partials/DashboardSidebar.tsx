import { Link, useLocation, useNavigate } from 'react-router';
import { lazy, Suspense, useCallback, useEffect } from 'react';
import { DynamicIcon, type IconName } from 'lucide-react/dynamic';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { useTranslation } from 'react-i18next';
//import { useAuth } from '@/hooks/useAuth';
import { images } from '@/assets';

const HoverableScrollArea = lazy(() => import('./HoverableScrollArea'));

export default function DashboardSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isMobile, setOpenMobile } = useSidebar();
  const { i18n, t } = useTranslation();
  //const { user } = useAuth();

  const isRTL = i18n.language === 'ar';

  type SidebarItem = {
    title: string;
    url: string;
    icon: IconName;
    permission: string;
  };

  const items: SidebarItem[] = [
    {
      title: t('sidebar.dashboard'),
      url: '/dashboard',
      icon: 'chart-pie',
      permission: 'dashboard',
    },
    {
      title: t('sidebar.productsCategory'),
      url: '/products-category',
      icon: 'shopping-bag',
      permission: 'product categories',
    },
    {
      title: t('sidebar.product_units'),
      url: '/product-units',
      icon: 'pencil-ruler',
      permission: 'product units',
    },
    {
      title: t('sidebar.products'),
      url: '/products',
      icon: 'shopping-bag',
      permission: 'product',
    },
    {
      title: t('sidebar.promotions'),
      url: '/promotions',
      icon: 'megaphone',
      permission: 'promotions',
    },
    {
      title: t('sidebar.banners'),
      url: '/banners',
      icon: 'wallpaper',
      permission: '',
    },
    {
      title: t('sidebar.orders'),
      url: '/orders',
      icon: 'shopping-cart',
      permission: 'orders',
    },
    {
      title: t('sidebar.transactions'),
      url: '/transactions',
      icon: 'circle-dollar-sign',
      permission: 'transactions',
    },
    { title: t('sidebar.report'), url: '/report', icon: 'chart-bar', permission: 'report' },
    { title: t('sidebar.inbox'), url: '/inbox', icon: 'message-square', permission: 'inbox' },
    { title: t('sidebar.regions'), url: '/regions', icon: 'map-pin', permission: 'regions' },
  ];

  const projects: SidebarItem[] = [
    { title: t('sidebar.staff'), url: '/staff', icon: 'users', permission: 'staff' },
    {
      title: t('sidebar.customerCategory'),
      url: '/customer-category',
      icon: 'circle-user-round',
      permission: 'customer categories',
    },
    { title: t('sidebar.customer'), url: '/customer', icon: 'user', permission: 'customers' },
    { title: t('sidebar.drivers'), url: '/drivers', icon: 'truck', permission: 'drivers' },
    { title: t('sidebar.roles'), url: '/roles', icon: 'user-cog', permission: 'roles' },
    { title: t('sidebar.taxes'), url: '/taxes', icon: 'landmark', permission: 'taxes' },
    {
      title: t('sidebar.warehouse'),
      url: '/warehouse',
      icon: 'warehouse',
      permission: 'warehouse',
    },
  ];

  const matchDynamicRoute = useCallback(
    (pattern: string) => {
      const basePattern = pattern.replace(/:[^/]+/g, '[^/]+');
      const regex = new RegExp(`^${basePattern}(?:/[^/]+)?$`);
      return regex.test(location.pathname);
    },
    [location.pathname],
  );

  useEffect(() => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }, [isMobile, location, setOpenMobile]);

  return (
    <Sidebar collapsible="icon" style={{ border: 0 }} side={isRTL ? 'right' : 'left'}>
      <SidebarHeader className="mt-2 h-[85px] w-full">
        <img
          src={images.mainLogo1}
          alt="Coffee Solutions"
          className="h-16 w-auto cursor-pointer"
          onClick={() => navigate('/dashboard')}
        />
      </SidebarHeader>

      <SidebarContent className="mt-2 pt-4">
        <Suspense
          fallback={
            <DynamicIcon name="loader" className="w-10 h-10 mx-auto animate-spin text-gray-100" />
          }
        >
          <HoverableScrollArea>
            <SidebarGroup className="pe-0 pt-7">
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => {
                    const isActive = matchDynamicRoute(item.url);

                    return (
                      // user.permissions.includes(item.permission) && (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild tooltip={item.title}>
                          <Link
                            to={item.url}
                            className={`rounded-e-none relative mb-2 ${
                              isActive ? 'active text-coffee-brown' : 'hover:text-coffee-brown'
                            } z-10 transition-all duration-20 menu00 hover:bg-transparent rounded-full py-6 overflow-visible`}
                          >
                            <DynamicIcon name={item.icon} className="relative z-10" />
                            <span className="relative z-10 text-base">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      //)
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>

              <SidebarGroupLabel className="text-white bold mb-3 text-base">
                {t('sidebar.userManagement')}
              </SidebarGroupLabel>

              <SidebarGroupContent>
                <SidebarMenu>
                  {projects.map((project) => {
                    const isActive = matchDynamicRoute(project.url);

                    return (
                      // user.permissions.includes(project.permission) && (
                      <SidebarMenuItem key={project.title}>
                        <SidebarMenuButton asChild tooltip={project.title}>
                          <Link
                            to={project.url}
                            className={`rounded-e-none relative mb-2 ${
                              isActive ? 'active text-coffee-brown' : 'hover:text-coffee-brown'
                            } z-10 transition-all duration-20 menu00 hover:bg-transparent rounded-full py-6 overflow-visible`}
                          >
                            <DynamicIcon name={project.icon} className="relative z-10" />
                            <span className="relative z-10 text-base">{project.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      // )
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </HoverableScrollArea>
        </Suspense>
      </SidebarContent>
    </Sidebar>
  );
}
