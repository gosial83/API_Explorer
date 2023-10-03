<template>

  <template  v-if=" columnsCounter !==0 ">
    <div class="col fw-bold "
         v-for="column in currentApiConfig[selectedApiKey]['endpoints'][selectedEndpointKey]['columns']"
    >
      {{column['label']}}
    </div>
  </template>

  <div  class="col-1 fw-bold " v-if="selectedEndpointKey">
    Options
  </div>
</template>

<script>
import {useDataStore} from "@/stores/data";
import {storeToRefs} from "pinia";

export default {
  name: "DataTableHeader",
  setup(){
    const dataFromStore = useDataStore();
    const { currentApiConfig, selectedApiKey, selectedEndpointKey, columnsCounter } = storeToRefs(dataFromStore)

    return {
      currentApiConfig, selectedApiKey, selectedEndpointKey, columnsCounter }
  }
}
</script>

<style scoped>

</style>
