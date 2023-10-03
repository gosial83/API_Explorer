import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import EndpointConfigView from "@/views/EndpointConfigView.vue";
import ItemDetails from "@/views/ItemDetails.vue";


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/endpointConfig',
      name: 'endpointConfig',
      component: EndpointConfigView
    },
    {
      path: '/details/:id',
      name: 'details',
      component: ItemDetails
    },
  ]
})

export default router
