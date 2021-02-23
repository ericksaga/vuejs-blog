import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Post from '../views/Post.vue'
import CreatePost from '../views/CreatePost.vue'
import MyPosts from '../views/MyPosts.vue'
import MyPublishedPosts from '../views/MyPublishedPosts.vue'
import MyDraftedPosts from '../views/MyDraftedPosts.vue'
import MyDeletedPosts from '../views/MyDeletedPosts.vue'
import Profile from '../views/Profile.vue'
import UserPosts from '../views/UserPosts.vue'
import UserCommentedPosts from '../views/UserCommentedPosts.vue'
import UserLikedPosts from '../views/UserLikedPosts.vue'
import Configuration from '../views/Configuration.vue'
import ConfigurateUser from '../views/ConfigurateUser.vue'
import ConfigurateSecurity from '../views/ConfigurateSecurity.vue'
import CompleteRegister from '../views/CompleteRegister.vue'
import EditPost from '../views/EditPost.vue'
import ResetPassword from '../views/ResetPassword.vue'

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
    path: '/editPost/:postId',
    name: 'EditPost',
    component: EditPost
  },
  {
    path: '/completeRegistration',
    name: 'CompleteRegister',
    component: CompleteRegister
  },
  {
    path: '/resetPassword',
    name: 'ResetPassword',
    component: ResetPassword
  },
  {
    path: '/myPosts',
    name: 'MyPosts',
    component: MyPosts,
    children: [
      {
        path: 'myPublishedPosts/:page',
        name: 'MyPublishedPosts',
        component: MyPublishedPosts
      },
      {
        path: 'myDrafts/:page',
        name: 'MyDraftedPosts',
        component: MyDraftedPosts
      },
      {
        path: 'myDeletedPosts/:page',
        name: 'MyDeletedPosts',
        component: MyDeletedPosts
      }
    ]
  },
  {
    path: '/profile/:userId',
    name: 'Profile',
    component: Profile,
    props: true,
    children: [
      {
        path: 'userPosts/:page',
        name: "UserPosts",
        component: UserPosts
      },
      {
        path: 'userCommentedPosts/:page',
        name: "UserCommentedPosts",
        component: UserCommentedPosts
      },
      {
        path: 'userLikedPosts/:page',
        name: "UserLikedPosts",
        component: UserLikedPosts
      },
    ]
  },
  {
    path: '/configuration',
    name: 'configuration',
    component: Configuration,
    children: [
      {
        path: 'profile',
        name:'configurateUser',
        component: ConfigurateUser
      },
      {
        path: 'security',
        name:'configurateSecurity',
        component: ConfigurateSecurity
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
