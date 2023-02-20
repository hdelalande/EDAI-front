import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory("/"),
    routes: [
      {
        path: "/",
        component: () => import("@/layouts/FullLayout.vue"),
        children: [
          {
            path: '/home',
            name: 'Home',
            component: () => import("../views/HomePage.vue"),
            },
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
              path: "/teacherv2",
              name: "Teacher",
              component: () => import("../views/TeacherPagev2.vue"),
          }
        ],
      }
    ]
});

export default router
