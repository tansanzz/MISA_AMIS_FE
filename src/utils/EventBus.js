import * as Vue from "vue";

export const EventBus = new Vue();

export const sendErrorMessage = (message) => {
  EventBus.$emit("onError", message);
};
