import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory("/"),
    routes: [
        {
            path: '/',
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
        }

    ]
});

export default router