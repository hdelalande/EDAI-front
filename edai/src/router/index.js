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
                path: "/studentForm",
                name: "Student Form",
                component: () => import("../views/StudentForm.vue"),
            },
            {
                path: "/studentApplication/:roomid",
                name: "Student Application",
                component: () => import("../views/StudentApplication.vue"),
            },
        ],
    }
    ]
});

export default router