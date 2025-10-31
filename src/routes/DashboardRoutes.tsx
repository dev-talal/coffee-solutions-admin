import DashboardPage from '@/pages/dashboard';
import ProductsCategory from '@/pages/dashboard/ProductCategory';
import Products from '@/pages/dashboard/Products';
import AddProducts from '@/pages/dashboard/Products/AddProduct';
import View_Products from '@/pages/dashboard/Products/ViewProducts';
import Promotions from '@/pages/dashboard/promotions';
import AddPromotions from '@/pages/dashboard/promotions/AddPromotions';
import View_Promotions from '@/pages/dashboard/promotions/ViewPromotion';
import Orders from '@/pages/dashboard/Orders/index';
import ViewOrder from '@/pages/dashboard/Orders/ViewOrders';
import Transactions from '@/pages/dashboard/Transactions/index';
import Report from '@/pages/dashboard/Report/index';
import InboxPage from '@/pages/dashboard/Inbox';
import Region from '@/pages/dashboard/Region/index';
import RegionDetailsPage from '@/pages/dashboard/Region/RegionDetailsPage';
import Staff from '@/pages/dashboard/Staff/index';
import Customer from '@/pages/dashboard/Customer/index';
import CustomerCategory from '@/pages/dashboard/CustomerCategory/index';
import CustomerCategoryDetailsPage from '@/pages/dashboard/CustomerCategory/CustomerCategoryDetailsPage';
import Roles from '@/pages/dashboard/Roles/index';
import Taxes from '@/pages/dashboard/Taxes/index';
import Warehouse from '@/pages/dashboard/Warehouse/index';
import Profile from '@/pages/profile';
import Drivers from '@/pages/dashboard/Drivers';
import PermissionWrapper from '@/components/layouts/PermissionWrapper';
import { Route, Routes } from 'react-router';
import ProductUnits from '@/pages/dashboard/ProductUnits';
import CustomerCart from '@/pages/dashboard/Customer/CustomerCart';
import Banners from '@/pages/dashboard/Banners';

export const dashboardRoutes = [
  { path: '/dashboard', element: DashboardPage, permission: 'dashboard' },
  { path: '/profile', element: Profile },

  //banners
  { path: '/banners', element: Banners, permission: 'dashboard' },

  // Products
  { path: '/products-category', element: ProductsCategory, permission: 'product categories' },
  { path: '/product-units', element: ProductUnits, permission: 'product units' },
  { path: '/products', element: Products, permission: 'product' },
  { path: '/products/:id', element: View_Products, permission: 'product' },
  { path: '/products/add-products', element: AddProducts, permission: 'product' },
  { path: '/products/edit-products/:id', element: AddProducts, permission: 'product' },

  // Promotions
  { path: '/promotions', element: Promotions, permission: 'promotions' },
  { path: '/promotions/add-promotions', element: AddPromotions, permission: 'promotions' },
  { path: '/promotions/edit-promotions/:id', element: AddPromotions, permission: 'promotions' },
  { path: '/promotions/:id', element: View_Promotions },

  // Orders / Transactions / Reports
  { path: '/orders', element: Orders },
  { path: '/order/details/:id', element: ViewOrder },
  { path: '/transactions', element: Transactions, permission: 'transactions' },
  { path: '/report', element: Report },

  // Others
  { path: '/drivers', element: Drivers },
  { path: '/inbox', element: InboxPage, permission: 'inbox' },
  { path: '/regions', element: Region, permission: 'regions' },
  { path: '/regions/:id', element: RegionDetailsPage, permission: 'regions' },
  { path: '/staff', element: Staff, permission: 'staff' },
  { path: '/customer', element: Customer, permission: 'customers' },
  { path: '/customer/:id/cart', element: CustomerCart, permission: 'customers' },
  { path: '/customer-category', element: CustomerCategory, permission: 'customer categories' },
  {
    path: '/customer-category/:id',
    element: CustomerCategoryDetailsPage,
    permission: 'customer categories',
  },
  { path: '/roles', element: Roles, permission: 'roles' },
  // { path: '/roles/:id', element: RoleDetailsPage, permission: 'roles' },
  { path: '/taxes', element: Taxes, permission: 'taxes' },
  { path: '/warehouse', element: Warehouse, permission: 'warehouse' },
];

const DashboardRoutes = () => {
  return (
    <Routes>
      {dashboardRoutes.map(({ path, element: Component, permission }) => (
        <Route
          key={path}
          path={path}
          element={
            permission ? (
              <PermissionWrapper permission={permission}>
                <Component />
              </PermissionWrapper>
            ) : (
              <Component />
            )
          }
        />
      ))}
    </Routes>
  );
};

export default DashboardRoutes;
