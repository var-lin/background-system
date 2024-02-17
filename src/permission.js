import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  // const hasToken = getToken()

  const hasGetUserInfo = store.getters.user;

  if (to.meta.auth) {
    // 页面需要鉴权
    if (hasGetUserInfo) {
      // 本地有用户信息
      next()
    } else {
      // 没有用户信息验证token
      const hasToken = localStorage.getItem('adminToken')
      if (hasToken) {
        // 有token验证有效性
        try {
          await store.dispatch('user/getInfo');
          next()
        } catch (err) {
          await store.dispatch('user/resetToken')
          Message.error('登录已过期，请重新登录')
          next({ path: `/login?redirect=${to.path}` })
          NProgress.done()
        }
      } else {
        next({ path: `/login?redirect=${to.path}` })
        NProgress.done()
      }
    }
  } else {
    // 不需要鉴权
    if (to.path === '/login' && hasGetUserInfo) {
      // 登录状态去登录，导航到首页
      next({ path: '/' })
    } else {
      next()
    }
    NProgress.done()
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
