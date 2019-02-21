import { start } from 'pretty-error';

export const state = () => ({
  user: null,
  admin: false,
  cachedNames: null,
  cachedTokens: null,
  cachedScores: null,
  score: null
});

export const mutations = {
  PASS(state, user) {
    state.user = user;
  },
  SET_ADMIN(state) {
    state.admin = true;
  },
  SET_NAME_CACHE(state, names) {
    state.cachedNames = names;
  },
  SET_TOKEN_CACHE(state, tokens) {
    state.cachedTokens = tokens;
  },
  SET_SCORES_CACHE(state, scores) {
    state.cachedScores = scores;
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
      commit('PASS', { username: req.session.user, quiz: req.session.quiz });
    }
  },

  async handeRequest({ commit }, payload) {
    if (payload.charAt(0) === '\\') {
      const responce = await this.$axios.$post('http://localhost:3000/api/login', { password: payload.substr(1) });
      if (responce.admin) {
        commit('SET_ADMIN');
      }
    } else {
      const responce = await this.$axios.$post('http://localhost:3000/api/authenticate-user', { token: payload });
      console.log(responce);
      commit('PASS', responce);
      this.$router.push('/quiz');
    }
  }
};
