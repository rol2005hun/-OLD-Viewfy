import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import store from '../store';

Vue.use(VueRouter)


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    
    // ha nincs url: localhost:800/
    // login oldal átírányítás
    {
      path: '/',
      name: 'NoUrl',
      component: () => import('../views/Login.vue'),

      meta: {
        requiresGuest: true
      }
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,

      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/explore',
      name: 'Explore',
      component: () => import('../views/Explore.vue'),

      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/profilesettings',
      name: 'Settings',
      component: () => import('../views/ProfileSettings.vue'),

      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/createpost',
      name: 'Create Post',
      component: () => import('../views/CreatePost.vue'),

      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/createwhisper',
      name: 'Create Whisper',
      component: () => import('../views/CreateWhisper.vue'),

      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/chat',
      name: 'Chat',
      component: () => import('../views/Chat.vue'),

      meta: {
        requiresAuth: true
      }
    },
    // megvédés felhatalmazott felhasználóktól
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Login.vue'),

      meta: {
        requiresGuest: true
      }
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('../views/Register.vue'),

      meta: {
        requiresGuest: true
      }
    },
  
    // megvédés jogosulatlan felhasználóktól
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('../views/Profile.vue'),

      meta: {
        requiresAuth: true
      }
    },
  ]
});

router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {
    // ha a felhasználó nincs belépbe
    if(!store.getters.isLoggedIn) {
      // login oldal átírányítás
      next('/login');
    } else {
      next();
    }
  } else if(to.matched.some(record => record.meta.requiresGuest)) {
    // ha be vannak jelentkezve, és olyan meta-t használnak, amely vendéget igényel...
    // akkor elküldik őket erre a funkcióra, amely automatikusan a profiljukba irányítja őket
    if(store.getters.isLoggedIn) {
      // profil oldal átírányítás
      next('/profile');
    } else {
      next();
    }
  }
});

export default router;
