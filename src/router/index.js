import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    component: () => import("../views/HomeView.vue"),
    children: [
      {
        path: "",
        component: () => import("../views/IndexView.vue"),
      },
      {
        // 產品列表
        path: "products",
        component: () => import("../views/ProductsView.vue"),
      },
      {
        // 各別產品資訊
        path: "product/:id",
        component: () => import("../views/ProductView.vue"),
      },
      {
        path: "cart",
        component: () => import("../views/CartView.vue"),
      },
    ],
  },
  {
    // 將 login 的路由獨立出來
    path: "/login",
    component: () => import("../views/LoginView.vue"),
  },
  {
    path: "/admin",
    component: () => import("../views/DashboardView .vue"),
    children: [
      {
        path: "products",
        component: () => import("../views/Dashboard/AdminProducts.vue"),
      },
      {
        path: "orders",
        component: () => import("../views/Dashboard/AdminOrders.vue"),
      },
      {
        path: "coupon",
        component: () => import("../views/Dashboard/AdminCoupon.vue"),
      },
    ],
  },
  {
    // 404 頁面
    path: "/:pathMatch(.*)*",
    component: () => import("../views/NotFound"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  linkActiveClass: "active",
});

export default router;
