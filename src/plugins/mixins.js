import { $api } from "@/services/api";

export default {
  computed: {
    $api: () => {
      return $api
    }
  }
};