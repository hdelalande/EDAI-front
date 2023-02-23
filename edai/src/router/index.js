import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory("/"),
    routes: [
      {
        path: '',
        name: 'Home',
        component: () => import("../views/HomePage.vue"),
      },
      {
        path: "/",
        component: () => import("@/layouts/FullLayout.vue"),
        children: [
            {
                path: "/student/room/:roomID",
                name: "Student",
                component: () => import("../views/StudentPage.vue"),
            },
            {
              path: "/teacher",
              name: "Teacher",
              component: () => import("../views/TeacherPage.vue"),
            },
            {
              path: "/teacher/room/:roomID",
              name: "Teacher",
              props: true,
              component: () => import("../views/TeacherPage.vue"),
            }
        ],
      }
    ]
});

export default router

