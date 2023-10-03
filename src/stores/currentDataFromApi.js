import {ref, computed, watch, toRefs} from 'vue'
import { defineStore } from 'pinia'
import apiConfiguration from "@/assets/apiconfiguration.json";

export const useCurrentDataFromApiStore = defineStore('currentDataFromApi', () => {

  const dataFromApi = ref('')

  function setDataToStore(value){
    dataFromApi.value=value
  }


  return { dataFromApi, setDataToStore  }
})
