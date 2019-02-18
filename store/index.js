export const state = () => ({
  collectionName: null,
  admin: false,
})

export const mutations = {
  PASS(state, name) {
		state.collectionName = name
  },
  SET_ADMIN(state) {
    state.admin = true
  }
}

export const actions = {
  nuxtServerInit ({ commit }, { req }) {
    if (req.session.user) {
      commit('PASS', req.session.user.quiz)
    }
  },

  async handeRequest({commit}, payload) {
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