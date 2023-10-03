import {ref, computed, watch, toRefs} from 'vue'
import { defineStore } from 'pinia'
import apiConfiguration from "@/assets/apiconfiguration.json";

export const useDataStore = defineStore('data', () => {

  const currentApiConfig = ref(apiConfiguration)
  const selectedApiKey = ref("")
  const selectedEndpointKey = ref("")
  const isLoadingData = ref(false)
  const isErrorFromApi = ref(false)
  const currentDataInDetailsModal = ref({
    fieldKey: "",
    fieldValue: "",
    isBackgroudVisible: false
  })


  const endpointsCounter = computed(() => {
    try{
      return  Object.keys(currentApiConfig.value[selectedApiKey.value]['endpoints']).length
    }
    catch (e) {
      return 0
    }
  })
  const endpoints_allCounter = computed(() => {
    try{
      return  Object.keys(currentApiConfig.value[selectedApiKey.value]['endpoints_all']).length
    }
    catch (e) {
      return 0
    }
  })
  const columnsCounter = computed(() => {
    try{
      return  Object.keys(currentApiConfig.value[selectedApiKey.value]['endpoints'][selectedEndpointKey.value]['columns']).length
    }
    catch (e) {
      return 0
    }
  })
  const columns_allCounter = computed(() => {
    try{
      return  Object.keys(currentApiConfig.value[selectedApiKey.value]['endpoints'][selectedEndpointKey.value]['columns_all']).length
    }
    catch (e) {
      return 0
    }
  })



  const columns_allColumnsNames  = computed(() => {
    let allColumnsNames=[]
    try {
      const allColumnsFromApi =   Object.values(currentApiConfig.value[selectedApiKey.value]['endpoints'][selectedEndpointKey.value]['columns_all'])
      allColumnsFromApi.forEach( (columnObj)=>{
        allColumnsNames.push(columnObj.name)
      } )
      return allColumnsNames
    }
    catch(e){}
  })
  const currentColumnsNames  = computed(() => {
    let selectedColumnsNames=[]
    try {
      const selectedColumns =   Object.values(currentApiConfig.value[selectedApiKey.value]['endpoints'][selectedEndpointKey.value]['columns'])
      selectedColumns.forEach( (columnObj)=>{
        selectedColumnsNames.push(columnObj.name)
      } )
      return selectedColumnsNames
    }
    catch(e){}
  })


  function setSelectedApiKey(apiKey){
    selectedApiKey.value = apiKey
  }
  function setSelectedEndpointKey(endpointKey){
    selectedEndpointKey.value = endpointKey
  }
  function setNewApiToCurrentApiConfig(apiKey, apiValue){
    currentApiConfig.value[apiKey] = apiValue
  }
  function setItemToCurrentApiConfig(apiKey, itemName, itemValue){
    currentApiConfig.value[apiKey][itemName] = itemValue
  }
  function setEndpointItemToCurrentApiConfig(apiKey, itemName, itemKey, itemValue){
    currentApiConfig.value[apiKey][itemName][itemKey] = itemValue
  }
  function removeEndpointItemToCurrentApiConfig(apiKey, itemName, itemKey){
    delete currentApiConfig.value[apiKey][itemName][itemKey]
  }
  function setItemToEndpointInCurrentApiConfig(apiKey, endpointKey, columnsType, columns){
    currentApiConfig.value[apiKey]['endpoints'][endpointKey][columnsType] = columns
  }

  function addColumnToColumnsInCurrentApiConfig(apiKey, endpointKey, columnsType, columnToAdd){
    currentApiConfig.value[apiKey]['endpoints'][endpointKey][columnsType].push(columnToAdd)
  }
  function removeColumnFromColumnsInCurrentApiConfig(apiKey, endpointKey, columnsType, columnToRemove){
    const objWithIdIndex = currentApiConfig.value[apiKey]['endpoints'][endpointKey][columnsType].findIndex((obj) => obj.name === columnToRemove.name);
    if (objWithIdIndex > -1) {
      currentApiConfig.value[apiKey]['endpoints'][endpointKey][columnsType].splice(objWithIdIndex, 1);
    }
  }
  function setIsLoadingData(value){
    isLoadingData.value = value
  }

  function setErrorFromApi(value){
    isErrorFromApi.value = value
  }

  function setCurrentDataInDetailsModal(key, value){
    currentDataInDetailsModal.value[key] = value
  }








  return {
    currentApiConfig, setNewApiToCurrentApiConfig, setItemToCurrentApiConfig,
    selectedApiKey, setSelectedApiKey, setEndpointItemToCurrentApiConfig, removeEndpointItemToCurrentApiConfig,
    selectedEndpointKey,  setSelectedEndpointKey, setItemToEndpointInCurrentApiConfig, addColumnToColumnsInCurrentApiConfig, removeColumnFromColumnsInCurrentApiConfig,
    isLoadingData, setIsLoadingData, isErrorFromApi, setErrorFromApi, currentDataInDetailsModal,  setCurrentDataInDetailsModal,
    endpointsCounter, endpoints_allCounter, columnsCounter, columns_allCounter,  currentColumnsNames, columns_allColumnsNames,

  }
})
