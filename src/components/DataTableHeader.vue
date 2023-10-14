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


<script setup>
  import {useDataStore} from "@/stores/data";
  import {storeToRefs} from "pinia";

  const dataFromStore = useDataStore();
  const { currentApiConfig, selectedApiKey, selectedEndpointKey, columnsCounter } = storeToRefs(dataFromStore)
</script>



<style scoped>

</style>
