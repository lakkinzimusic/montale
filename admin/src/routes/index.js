// import Start from '@/src/components/pages/StartPage';
import Products from '@/components/pages/products/ProductsPage';
import ProductCreate from '@/components/pages/products/ProductCreate';
import Users from '@/components/pages/users/UsersPage';
const routes = [
    {
        path: '/products',
            name: 'Products',
            component: Products
        },
    {
        path: '/product-create',
        name: 'ProductCreate',
        component: ProductCreate
    },
    {
        path: '/users',
        name: 'Users',
        component: Users
    }

];
export default routes
