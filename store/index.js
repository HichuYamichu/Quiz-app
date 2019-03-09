export const state = () => ({
  user: null,
  admin: false,
  score: null
});

export const mutations = {
  PASS(state, user) {
    state.user = user;
  },
  SET_ADMIN(state) {
    state.admin = true;
  },
  SET_SCORE(state, payload) {
    state.score = {
      achived: payload.score,
      max: payload.length
    };
  }
};

export const actions = {
  nuxtServerInit({ commit }, { req }) {
    if (req.session.user) {
      commit('PASS', req.session.user);
    }
		if (req.session.admin) {
      commit('SET_ADMIN');
    }
  },

  async handeRequest({ commit }, payload) {
    if (payload.charAt(0) === '\\') {
      try {
        const responce = await this.$axios.$post('/api/login', {
          password: payload.substr(1)
        });
        if (responce.admin) {
          commit('SET_ADMIN');
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        const responce = await this.$axios.$post('/api/authenticate-user', {
          token: payload
        });
        commit('PASS', responce);
        this.$router.push('/quiz');
      } catch (err) {
        console.log(err);
      }
    }
  }
};
