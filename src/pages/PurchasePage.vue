<template>
<h2>Test message box</h2>
  <MMessageBox 
  type="information"
  text="Số CMND không chính xác"
  />
</template>

<script>
import MMessageBox from '../components/base/MMessageBox.vue'
export default {
  components: {
    MMessageBox
  },
};
</script>


