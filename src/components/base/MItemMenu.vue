<template>
  <div class="parent-item-menu">
    <router-link :to="link" class="menu-item">
      <div class="menu-item__icon">
        <div :class="iconClass"></div>
      </div>
      <div class="menu-item__title">{{text}}</div>
    </router-link>
  </div>
</template>

<script>
export default {
  props: ["iconClass", "text", "link"],
};
</script>
