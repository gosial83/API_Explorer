<template>

    <div class="dataTable borderWithShadow" >

      <div class="row myHeader">
        <DataTableHeader></DataTableHeader>
      </div>

      <div v-if="columnsCounter !== 0" class="rowsContainer"  >

        <div class="row myRow rowWithData"
             v-for="(row, index) in currentApiConfig[selectedApiKey]['endpoints'][selectedEndpointKey]['data']" :key="index"
        >
          <div
              class="col cellContainer"
               v-for="column in  currentApiConfig[selectedApiKey]['endpoints'][selectedEndpointKey]['columns']" :key="column.name"
          >
            <div
                class="textInCell"
            >{{row[column.name]}}</div>
          </div>

          <div class="col-1">
            <button
                @click="goToDetails(row)"
                class="btn btn-outline-dark btn-sm"
                :id="`row${index}`"
                @mouseenter="bump(`row${index}`)"
            >
              Details</button>
          </div>

        </div>
      </div>
    </div>

    <Pagination v-if="selectedEndpointKey"></Pagination>


</template>

<script setup>
  import {useDataStore} from "@/stores/data";
  import {storeToRefs} from "pinia";
  import DataTableHeader from "@/components/DataTableHeader.vue";
  import {useRouter} from "vue-router";
  import Pagination from "@/components/Pagination.vue";
  import {gsap} from "gsap";
  import {nextTick} from "vue";
  import {useCurrentDataFromApiStore} from "@/stores/currentDataFromApi";
  import {useAnimation} from "@/animations/useAnimation.";

  const dataFromStore = useDataStore();
  const currentDataToDisplay = useCurrentDataFromApiStore();
  const { currentApiConfig, selectedApiKey, selectedEndpointKey, columnsCounter, endpointsCounter, endpoints_allCounter } = storeToRefs(dataFromStore)
  const { dataFromApi } = storeToRefs(currentDataToDisplay)
  const { setItemToEndpointInCurrentApiConfig } = dataFromStore
  const router = useRouter()
  const { bump } = useAnimation();


  function goToDetails(row){
    setItemToEndpointInCurrentApiConfig(selectedApiKey.value, selectedEndpointKey.value, 'row', row )
    let url = row.url.split("/")
    let id = url[url.length-2]
    router.push('/details/'+id)
  }

  currentDataToDisplay.$subscribe((mutation, state) => {
    endpointIn()
  })

  function endpointIn(){
    nextTick(() => {
      let id = document.getElementsByClassName('rowWithData')
      gsap.from(id, {duration: 0.5, opacity: 0, x:200,  ease:'elastic.out(0.5, 1.5)', stagger: 0.1});
    });
  }

</script>


<style scoped>
  .rowsContainer{
    height: 64vh;
    overflow: auto;
    overflow-x: hidden
  }
  .rowWithData{
    height: 50px;
    display: flex;
    align-items: center;
  }
  .cellContainer{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .textInCell{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-right: 10px
  }
</style>
