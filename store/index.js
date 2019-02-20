import { start } from "pretty-error";

export const state = () => ({
  collectionName: null,
  admin: false,
  cachedNames: null,
  score: null
})

export const mutations = {
  PASS(state, name) {
    state.collectionName = name
  },
  SET_ADMIN(state) {
    state.admin = true
  },
  SET_CACHE(state, names) {
    state.cachedNames = names
  },
  SET_SCORE(state, payload) {
    state.score = {
      achived: payload.score,
      max: payload.length
    }
  }
}

export const actions = {
  nuxtServerInit({ commit }, { req }) {
    if (req.session.user) {
      commit('PASS', req.session.user.quiz)
    }
  },

  async handeRequest({ commit }, payload) {
    if (payload.charAt(0) === '\\') {
      const responce = await this.$axios.$post('http://localhost:3000/api/login', { password: payload.substr(1) })
      if (responce.admin) {
        commit('SET_ADMIN')
      }
    } else {
      const responce = await this.$axios.$post('http://localhost:3000/api/authenticate', { token: payload })
      console.log(responce)
      commit('PASS', responce)
      this.$router.push('/quiz')
    }
  }
}