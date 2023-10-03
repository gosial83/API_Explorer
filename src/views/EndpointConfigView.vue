<template>
  <div class="px-3 endpointsConfigView">
    <EndpointsConfigurator/>
  </div>
</template>


<script>
import EndpointsConfigurator from "@/components/EndpointsConfigurator.vue";

export default {
  components: {EndpointsConfigurator},
  setup() {
    return {   }
  }
}
</script>

<style scoped>
  .endpointsConfigView{
    margin-left: 10px
  }
</style>
