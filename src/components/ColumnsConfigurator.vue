<template>
  <div v-if="columnsCounter !==0 ">
    <div v-for="column in currentApiConfig[selectedApiKey]['endpoints'][selectedEndpointKey]['columns_all']" :key="column.name">
      <div class="form-check form-switch" @click="toggleSelection(column)">
        <input class="form-check-input" type="checkbox" id="flexSwitchCheckChecked" :checked="isColumnInSelected(column)" >
        <label  class="form-check-label"  > {{ column.label }}</label>
      </div>
    </div>
  </div>
</template>

<script>
import {useDataStore} from "@/stores/data";
import {storeToRefs} from "pinia";

export default {
  name: "ColumnsConfigurator",
  setup(){

    const dataFromStore = useDataStore();
    const { currentApiConfig, selectedApiKey, selectedEndpointKey, currentColumnsNames } = storeToRefs(dataFromStore)
    const { columnsCounter, addColumnToColumnsInCurrentApiConfig, removeColumnFromColumnsInCurrentApiConfig } = dataFromStore;

    function isColumnInSelected(column){
      return currentColumnsNames.value.includes(column.name)
    }

    function toggleSelection(column){
      if (isColumnInSelected(column)){
        removeColumnFromColumnsInCurrentApiConfig(selectedApiKey.value, selectedEndpointKey.value, 'columns', column )
      }else{
        addColumnToColumnsInCurrentApiConfig(selectedApiKey.value, selectedEndpointKey.value, 'columns', column )
      }
    }

    return { columnsCounter, isColumnInSelected, toggleSelection, currentApiConfig,selectedApiKey, selectedEndpointKey, currentColumnsNames,  }
  }
}
</script>

<style scoped>

</style>
