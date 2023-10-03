import {ref, computed, watch, toRefs} from 'vue'
import { defineStore } from 'pinia'
import apiConfiguration from "@/assets/apiconfiguration.json";

export const usePaginationData = defineStore('paginationData', () => {

  const paginationData = ref({
    'totalItemsCount' : null,
    'itemsPerPage' : 20,
    'nextUrl' : null,
    'previousUlr' : null,
    'lastUrl' : null,
    'firstUrl' : null,
    'lastPageNumber' : null,
    'currentPageNumber' : 1
  })

  function setPaginationValue(key, value){
    paginationData.value[key]=value
  }

  function setPaginationEmpty(){
    let currentItemsPerPage = paginationData.value['itemsPerPage']
    paginationData.value = {
      'totalItemsCount' : null,
      'itemsPerPage' : currentItemsPerPage,
      'nextUrl' : null,
      'previousUlr' : null,
      'lastUrl' : null,
      'firstUrl' : null,
      'lastPageNumber' : null,
      'currentPageNumber' : 1
    }
  }


  return { paginationData, setPaginationValue, setPaginationEmpty  }
})
