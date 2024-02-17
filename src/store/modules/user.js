import { loginApi, getInfo } from '@/api/user'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    user: null // 登录后的用户信息
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_USER: (state, payload) => {
    state.user = payload
  },
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      loginApi(userInfo).then((res) => {
        const { data } = res;
        if (data) {
          commit('SET_USER', data)
          resolve()
        } else {
          reject(res)
        }
      }).catch((err) => {
        reject(err)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo().then(res => {
        if (typeof res === 'string') {
          // 未登录或登录过期
          res = JSON.parse(res);
          if (res.code === 401) {
            reject(res.msg)
          }
        } else {
          commit('SET_USER', res.data)
          resolve()
        }
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      localStorage.removeItem('adminToken')
      resetRouter()
      commit('RESET_STATE')
      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      localStorage.removeItem('adminToken')
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

