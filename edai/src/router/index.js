import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory("/"),
    routes: [
      {
        path: '',
        name: 'Home',
        component: () => import("../views/HomePagev2.vue"),
      },
      {
        path: "/",
        component: () => import("@/layouts/FullLayout.vue"),
        children: [
          {
              path: "/teacher",
              name: "Teacher",
              component: () => import("../views/TeacherPage.vue"),
          },
          {
              path: "/student",
              name: "Student",
              component: () => import("../views/StudentPage.vue"),
          },
          {
              path: "/studentv2",
              name: "Student",
              component: () => import("../views/StudentPagev2.vue"),
          },
          {
              path: "/teacher/room/:roomID",
              name: "Teacher",
              props: true,
              component: () => import("../views/TeacherPagev2.vue"),
          }
        ],
      }
    ]
});

export default router
