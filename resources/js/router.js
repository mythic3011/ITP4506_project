import {renderLogin} from './pages/login.js';
import {renderDashboard} from './pages/dashboard.js';
import {renderVehicles} from './pages/vehicles.js';
import {renderInquiries} from './pages/admin/inquiries.js';
import {renderAnalytics} from './pages/admin/analytics.js';
import {renderVehicleManagement} from './pages/admin/vehicles.js';
import {renderOrders} from './pages/admin/orders.js';
import {handle404} from './pages/error.js';
import {renderRegister} from './pages/register.js';
import {handleError, requireAuth} from './utils/errorHandler.js';
import {isAuthenticated, getCurrentUser} from './services/auth.js';

const routes = {
    '/': () => isAuthenticated() ? renderDashboard() : renderLogin(),
    '/login': renderLogin,
    '/register': renderRegister,
    '/dashboard': requireAuth(renderDashboard),
    '/vehicles': requireAuth(renderVehicles),
    '/insurance': requireAuth(() => {
        const user = getCurrentUser();
        if (user?.role === 'customer') {
            window.location.href = '../page/customer/insurance/index.html';
        } else {
            navigate('/dashboard');
        }
    }),
    '/admin/inquiries': requireAuth(() => {
        const user = getCurrentUser();
        if (user?.role === 'admin') {
            renderInquiries();
        } else {
            navigate('/dashboard');
        }
    }),
    '/admin/analytics': requireAuth(() => {
        const user = getCurrentUser();
        if (user?.role === 'admin') {
            renderAnalytics();
        } else {
            navigate('/dashboard');
        }
    }),
    '/admin/vehicles': requireAuth(() => {
        const user = getCurrentUser();
        if (user?.role === 'admin') {
            renderVehicleManagement();
        } else {
            navigate('/dashboard');
        }
    }),
    '/admin/orders': requireAuth(() => {
        const user = getCurrentUser();
        if (user?.role === 'admin') {
            renderOrders();
        } else {
            navigate('/dashboard');
        }
    })
};

export function navigate(path) {
    try {
        const route = routes[path];
        if (route) {
            route();
            window.history.pushState({}, '', path);
        } else {
            handle404();
        }
    } catch (error) {
        handleError(error);
    }
}

$(window).on('popstate', () => {
    navigate(window.location.pathname);
});

export function initRouter() {
    window.navigate = navigate;
    navigate(window.location.pathname);
}

export const router = {
    navigate
};