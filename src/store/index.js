import { createStore } from "vuex";
import storePlugins from "@/plugins/storePlugins";

export default createStore({
  plugins: [storePlugins],
  state: {
    isLoading: false,
    language: "VI",
    error: "",
  },
  mutations: {
    changeLoadStatus(state) {
      state.isLoading = !state.isLoading;
    },
    setError(state, error) {
      state.error = error;
    },
  },
});
