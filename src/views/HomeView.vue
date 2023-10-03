<template>

  <div  class="px-3"    >

    <div class="row apiAndEndpointsSection borderWithShadow">
      <div class="col-10 selectionContainer">
          <div class="row my-1" id="api_section">

            <div class="col-2 d-flex align-items-center ps-2 labelContainer" >
              <label for="api"  id="chooseApi">Choose API: </label>
            </div>

            <div class="col-2">
              <select name="api"  @change="choseSelectedApi($event)" class="form-select " v-model="selectedApiKey">
                <option v-for="(apiValue, apiKey) in currentApiConfig " :value=apiKey> {{apiValue.name}} </option>
              </select>
            </div>

            <div class="col-3 errorMessage" v-if="isErrorFromApi" >
              Sorry, but this API don't work at this moment!
            </div>

          </div>
          <div class="row" id="emdpoints_section" v-if="endpointsCounter !== 0 && !isErrorFromApi ">

            <div class="col-2 d-flex align-items-center ps-2 labelContainer">
              <div  class=" " id="chooseEndpoint">Choose endpoint: </div>
            </div>

            <div class="col">

              <div class="my-2 endpointsContainer"  >
                <div class=""  v-for="(endpointValue, endpointKey) in currentApiConfig[selectedApiKey]['endpoints']">
                  <button
                      @click="getEndpointFromUser(selectedApiKey, endpointValue, endpointKey )"
                      :class="setColorForActiveButton(endpointKey)"
                      :id="endpointKey"
                      @mouseenter="bump(endpointKey)"

                  >{{endpointValue.label}}  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      <div class="col-2 pt-2 buttonsContainer" >
        <div class="">
          <button
              v-if="selectedApiKey && currentApiConfig[selectedApiKey]['endpoints_all'] "
              class="btn btn-outline-success mx-2"
              @click="showMoreEndpoints"
              id="endpoints"
              @mouseenter="bump('endpoints')"
          >
            <font-awesome-icon :icon="['fas', 'gear']" />
            <span id="endpoints" style="padding-left: 5px">endpoints
            ({{ endpointsCounter }}/{{ endpoints_allCounter }})</span>
          </button>
        </div>
        <Modal
            :classForOpenModal="'btn btn-outline-success m-2'"
            :modalType="'appearFromRight'"
            :funkcjonForYesButton="()=>{}"
            v-if="columns_allCounter !==0 "
        >
          <template #text>
            <p class="fw-bold">Select columns </p>
            <ColumnsConfigurator />
          </template>

          <template #buttonYes>
          </template>

          <template #buttonNo>
            <button
                class="btn btn-dark m-2"
                id="exitButton"
                @mouseenter="bump('exitButton')"
            >Exit</button>
          </template>

          <template #openModalButton>
            <font-awesome-icon  :icon="['fas', 'gear']" /> columns ({{ columnsCounter }}/{{ columns_allCounter }})
          </template>
        </Modal>
      </div>

    </div>

    <DataTable v-if="selectedEndpointKey != '' "></DataTable>

  </div>
  <Loading/>
</template>



<script>
import {onMounted, ref, inject} from "vue";
import { storeToRefs } from "pinia";
import {useDataStore} from "@/stores/data";
import DataTable from "@/components/DataTable.vue";
import Modal from "@/components/Modal.vue";
import { gsap } from "gsap";
import {SplitText} from "gsap/SplitText";
gsap.registerPlugin(SplitText);
import EndpointsConfigurator from "@/components/EndpointsConfigurator.vue";
import router from "@/router";
import Loading from "@/components/Loading.vue";
import ColumnsConfigurator from "@/components/ColumnsConfigurator.vue";
import {useAnimation} from "@/animations/useAnimation.";
import {usePaginationData} from "@/stores/paginationData";



export default {
  components: {
    ColumnsConfigurator,
    Loading,
    EndpointsConfigurator,
    Modal,
    DataTable
  },

  setup() {
    const endpointApiService = inject('endpoint_api_service');
    const { bump } = useAnimation();

    const dataFromStore = useDataStore();
    const { currentApiConfig, selectedApiKey, selectedEndpointKey, endpointsCounter, endpoints_allCounter,
      columnsCounter, columns_allCounter, isErrorFromApi} = storeToRefs(dataFromStore)
    const { setSelectedApiKey, setSelectedEndpointKey, setErrorFromApi } = dataFromStore;

    const paginationDataFromStore = usePaginationData() ;
    const {  setPaginationEmpty } = paginationDataFromStore;




    function choseSelectedApi(e){
      let apiKey = e.target.value
      setSelectedApiKey(apiKey)
      setErrorFromApi(false)
      endpointApiService.fetchEndpointsList();
      selectedEndpointKey.value = ""
      setPaginationEmpty()

      stopPulseText(tlApi)
      setTimeout(()=>{
        pulseText('chooseEndpoint', tlEndpoints )
        startPulseText(tlEndpoints);
        }, 500);
    }


    function getEndpointFromUser(apiKey, endpointValue, endpointKey ){
      setSelectedEndpointKey(endpointKey)
      setPaginationEmpty()

      let url = endpointApiService.getUrlForEndpoint(apiKey, endpointKey)
      endpointApiService.fetchDataFromEndpoint(url)

      stopPulseText(tlEndpoints)
    }


    function setColorForActiveButton(endpointKey){
      if(endpointKey===selectedEndpointKey.value){
        return "btn btn-dark me-2"
      }else {
        return "btn btn-outline-dark me-2"
      }
    }


    function showMoreEndpoints(){
      router.push("/endpointConfig")
    }

    let tlApi = gsap.timeline();
    let tlEndpoints = gsap.timeline();

    onMounted (() => {
      if(selectedApiKey.value===""){
        pulseText('chooseApi', tlApi)
      }else if(selectedEndpointKey.value===""){
        pulseText('chooseEndpoint', tlEndpoints )
      }
    })

    function pulseText(elementId, timeLine){
      let id = document.getElementById(elementId)
      let mySplitText = new SplitText(id, { type: "words, lines" });

      timeLine.to(mySplitText.lines, {
        duration: 0.2,
        scale: 1.077,
        color:"rgb(230, 0, 0)",
        ease: "none",
        stagger: 0.1,
        repeat: -1,
        yoyo: true,
        repeatDelay: 0.4
      });

    }


    function stopPulseText(timeLine){
      timeLine.revert();
      timeLine.pause()
    }

    function startPulseText(timeLine){
      timeLine.play()
    }


    return { selectedApiKey, selectedEndpointKey, currentApiConfig, choseSelectedApi, getEndpointFromUser, isErrorFromApi,
         setColorForActiveButton,  showMoreEndpoints,  endpointsCounter, endpoints_allCounter, columnsCounter, columns_allCounter,bump
    };
  }
}
</script>

<style scoped>
  .labelContainer{
    max-width: 10%;
    font-weight: 500;
  }
  .errorMessage{
    display: flex;
    align-content: center;
    justify-content: center;
    align-items: center;
    color: red;
    margin-left: 10px
  }

  .endpointsContainer{
    display: flex ;
    flex-direction: row;
    row-gap: 10px;
    flex-wrap: wrap;
  }

  .buttonsContainer{
    display: grid;
    justify-content: end
  }


</style>
