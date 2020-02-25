const state = {
  token:null,
  user_data: {},
};
const getters = {
  isLoggedIn: state => {
    return state.token !== null;
  }
};

const actions = {

};
const mutations = {
  authorize(state, response){
    if(response.token){
      localStorage.setItem('token', response.token);
      state.token = response.token;
      let obj = _.cloneDeep(response);
      delete obj['token'];
      localStorage.setItem('user_data', obj);
      state.user_data = obj;
    }
  },
  logout(state){
    localStorage.removeItem('token');
    localStorage.removeItem('user_data');
    state.token = null;
    state.user_data = {};
  },
  init_token(state){
    state.token = localStorage.getItem('token');
    state.user_data = localStorage.getItem('user_data');
  },
  set_auth(state, token, data){

  },
  set_token(state , {token}){
    localStorage.setItem('token', token);
    state.token = token;
  }
};


export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
