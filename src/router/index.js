import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Post from '../views/Post.vue'
import CreatePost from '../views/CreatePost.vue'
import MyPosts from '../views/MyPosts.vue'
import MyPublishedPosts from '../views/MyPublishedPosts.vue'
import MyDraftedPosts from '../views/MyDraftedPosts.vue'
import MyDeletedPosts from '../views/MyDeletedPosts.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/post/:postId',
    name: 'Post',
    component: Post,
    props: true
  },
  {
    path: '/createPost',
    name: 'CreatePost',
    component: CreatePost
  },
  {
    path: '/myPosts',
    name: 'MyPosts',
    component: MyPosts,
    children: [
      {
        path: 'myPublishedPosts',
        name: 'MyPublishedPosts',
        component: MyPublishedPosts
      },
      {
        path: 'myDrafts',
        name: 'MyDraftedPosts',
        component: MyDraftedPosts
      },
      {
        path: 'myDeletedPosts',
        name: 'MyDeletedPosts',
        component: MyDeletedPosts
      }
    ]
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
