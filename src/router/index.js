import { createRouter, createWebHashHistory } from "vue-router";

import DashboardPage from "../pages/DashboardPage.vue";
import CashPage from "../pages/cash-page/CashPage.vue";
import BankPage from '../pages/BankPage.vue'
import PurchasePage from '../pages/PurchasePage.vue'


const routes = [
  {
    path: "/dashboard",
    component: DashboardPage,
  },
  {
    path: "/cash",
    component: CashPage,
    alias: "/",
  },
  {
    path: "/bank",
    component: BankPage,
  },
  {
    path: "/purchase",
    component: PurchasePage,
  },
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});

export default router;
