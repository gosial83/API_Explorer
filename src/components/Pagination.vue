<template>

  <div class="row">

    <div class="col-4">
      <div class="d-flex align-items-center justify-content-left mt-3 ps-1 " v-if=" paginationTypeWithPageSize()" >Items per page:
        <span class="ps-1">
          <select v-model="selectedItemsPerPage" @change="setSelectedItemsPerPage">
            <option v-for="option in optionsForItemsPerPage" :value="option.value">
              {{ option.text }}
            </option>
          </select>
         </span>
      </div>
    </div>

    <div class="col-4">
      <div class="d-flex align-items-center justify-content-center my-3" >

        <button
            class="btn btn-outline-dark btn-sm mx-1"
            v-if="paginationData.currentPageNumber>=2"
            @click="goToFirstPage()"
        >&#60;&#60;</button>

        <button
            class="btn btn-outline-dark btn-sm mx-1"
            v-if="paginationData.currentPageNumber>=2"
            @click="goToPreviousPage()"
        >&#60; </button>

        <button
            class="btn btn-outline-dark btn-sm mx-1"
            @click="goToPageNumber(paginationData.currentPageNumber - 2)"
            v-if="paginationData.currentPageNumber>=3"
        > {{ paginationData.currentPageNumber - 2 }}
        </button>

        <button
            class="btn btn-outline-dark btn-sm mx-1"
            @click="goToPageNumber(paginationData.currentPageNumber - 1)"
            v-if="paginationData.currentPageNumber>=2"
        > {{ paginationData.currentPageNumber -1 }}
        </button>


        <button
            class="btn btn-dark btn-sm mx-1"
        >{{ paginationData.currentPageNumber }}
        </button>

        <button
            class="btn btn-outline-dark btn-sm mx-1"
            @click="goToPageNumber(paginationData.currentPageNumber + 1)"
            v-if="paginationData.currentPageNumber<=paginationData.lastPageNumber-1"
        > {{ paginationData.currentPageNumber + 1 }}
        </button>

        <button
            class="btn btn-outline-dark  btn-sm mx-1"
            @click="goToPageNumber(paginationData.currentPageNumber + 2)"
            v-if="paginationData.currentPageNumber<=paginationData.lastPageNumber-2"
        > {{ paginationData.currentPageNumber +2 }}
        </button>


        <button
            class="btn btn-outline-dark btn-sm mx-1"
            v-if="paginationData.currentPageNumber<=paginationData.lastPageNumber-1"
            @click="goToNextPage()"
        >&#62;</button>

        <button
            class="btn btn-outline-dark btn-sm mx-1"
            v-if="paginationData.currentPageNumber<=paginationData.lastPageNumber-1"
            @click="goToLastPage()"
        >&#62;&#62; </button>

      </div>

    </div>

    <div class="col-4">
      <div class="d-flex align-items-center justify-content-end mt-3 pe-1 ">
        Page {{paginationData.currentPageNumber }} of {{paginationData.lastPageNumber}}
      </div>
    </div>

  </div>




</template>

<script>
import {useDataStore} from "@/stores/data";
import {storeToRefs} from "pinia";
import {computed, inject, ref} from "vue";
import {usePaginationData} from "@/stores/paginationData";


export default {
  name: "Pagination",
  setup() {
    const dataFromStore = useDataStore();
    const { currentApiConfig, selectedApiKey, selectedEndpointKey, columnsCounter  } = storeToRefs(dataFromStore)

    const paginationDataFromStore = usePaginationData() ;
    const { paginationData } = storeToRefs(paginationDataFromStore)
    const {  setPaginationValue } = paginationDataFromStore;

    const endpointApiService = inject('endpoint_api_service');
    const selectedItemsPerPage = ref(20)
    const optionsForItemsPerPage = ref([
      { text: '10', value: 10 },
      { text: '20', value: 20 },
      { text: '30', value: 30 }
    ])


    function paginationTypeWithPageSize (){
      if (currentApiConfig.value[selectedApiKey.value]['pagination']['paginationType']==='limitAndOffset'
          ||  currentApiConfig.value[selectedApiKey.value]['pagination']['paginationType']==='pageAndPageSize'){
        return true
      }else{
        return false
      }
    }

    function goToLastPage(){
      if ( paginationData.value.lastUrl !== null){
        endpointApiService.fetchDataFromEndpoint(paginationData.value.lastUrl)
        setPaginationValue("currentPageNumber", paginationData.value.lastPageNumber)
      } else{
        goToPageNumber(paginationData.value.lastPageNumber)
      }
    }

    function goToFirstPage(){
      if ( paginationData.value.firstUrl !== null){
        endpointApiService.fetchDataFromEndpoint(paginationData.value.firstUrl)
        setPaginationValue("currentPageNumber", 1)
      } else{
        goToPageNumber(1)
      }

    }

    function setSelectedItemsPerPage(){
      setPaginationValue('itemsPerPage', selectedItemsPerPage.value)
      setPaginationValue('currentPageNumber', 1)
      let url = endpointApiService.getUrlForEndpoint(selectedApiKey.value, selectedEndpointKey.value)
      endpointApiService.fetchDataFromEndpoint(url)
    }

    function goToNextPage(){
      let currentPageNumber = paginationData.value['currentPageNumber']
      let nextUrl = paginationData.value['nextUrl']
      endpointApiService.fetchDataFromEndpoint(nextUrl)
      setPaginationValue("currentPageNumber", currentPageNumber+1)
    }


    function goToPreviousPage(){
      let currentPageNumber = paginationData.value['currentPageNumber']
      let previousUrl = paginationData.value['previousUlr']
      endpointApiService.fetchDataFromEndpoint(previousUrl)
      setPaginationValue("currentPageNumber", currentPageNumber-1)
    }

    function goToPageNumber(number){
      setPaginationValue("currentPageNumber", number)
      let nextUrl = endpointApiService.getUrlToPage(number)
      endpointApiService.fetchDataFromEndpoint(nextUrl)
    }

    return { currentApiConfig, selectedApiKey, selectedEndpointKey, columnsCounter, goToNextPage, goToPreviousPage, goToPageNumber,
      paginationData, selectedItemsPerPage, optionsForItemsPerPage, setSelectedItemsPerPage, goToLastPage, goToFirstPage, paginationTypeWithPageSize  }
  }
}
</script>

<style scoped>

</style>
