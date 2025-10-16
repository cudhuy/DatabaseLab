const { lazy } = require("react");

const routes = [
    {
        path: "/home",
        exact: true,
        component: lazy(() => import("src/pages/HomePage")),
        animation: "fadeIn",
    },
    {
        path: "/join",
        exact: true,
        component: lazy(() => import("src/pages/JoinPage")),
        animation: "fadeIn",
    },
    {
        path: "/contact",
        exact: true,
        component: lazy(() => import("src/pages/ContactPage")),
        animation: "fadeIn",
    },
    {
        path: "/events",
        exact: true,
        component: lazy(() => import("src/pages/EventsPageV2")),
        animation: "fadeIn",
    },
    {
        path: "/VIP",
        exact: true,
        component: lazy(() => import("src/pages/VIP")),
        animation: "fadeIn",
    },
    {
        path: "/admin/accountmanagement",
        exact: true,
        component: lazy(() => import("src/pages/admin/AccountManagementPage")),
        animation: "fadeInLeft",
    },
    {
        path: "/admin/gamesmanagement",
        exact: true,
        component: lazy(() => import("src/pages/admin/GamesManagement")),
        animation: "fadeInLeft",
    },
    {
        path: "/admin/eventsholding",
        exact: true,
        component: lazy(() => import("src/pages/admin/EventsHoldingV2")),
        animation: "fadeInLeft",
    },
    {
        path: "/admin/Infrastructure",
        exact: true,
        component: lazy(() => import("src/pages/admin/Infrastructure")),
        animation: "fadeInLeft",
    },
    {
        path: "/admin/statistics",
        exact: true,
        component: lazy(() => import("src/pages/admin/Statistics")),
        animation: "fadeInLeft",
    },
    {
        path: "/staff/paymentmanagement",
        exact: true,
        component: lazy(() => import("src/pages/staff/PaymentManagementPage")),
        animation: "fadeInLeft",
    },
    {
        path: "/staff/reportinfrastructure",
        exact: true,
        component: lazy(() => import("src/pages/staff/ReportInfrastructure")),
        animation: "fadeInLeft",
    },
    {
        path: "/staff/vipmanagement",
        exact: true,
        component: lazy(() => import("src/pages/staff/VIPManagement")),
        animation: "fadeInLeft",
    },
];

export default routes;
