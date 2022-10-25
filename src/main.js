import { createApp } from "vue";
import App from "./App.vue";
//import router
import router from "./router";
import store from "./store";
// import modules

const app = createApp(App);
app.use(router);
app.use(store);

app.mount("#app");
