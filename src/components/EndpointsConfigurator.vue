<template>
<div class="row">
  <div class="borderWithShadow fs-4 pt-2 ps-3" >
    Select endpoints to display for API:  <b>{{currentApiConfig[selectedApiKey]['name']}}</b>
  </div>

  <div class="row mt-3">
    <div class="col borderWithShadow me-3">
      <div class="fs-5 fw-bold">Endpoints delivered by API</div>

      <div class="row">
        <div class="col-4"  v-for="(endpointValue, endpointKey) in currentApiConfig[selectedApiKey]['endpoints_all']" :key="endpointKey">
          <button
              :class="setColorForSelectedButton(endpointKey)"
              @click="addEndpoint(endpointKey, endpointValue)">
            <font-awesome-icon :icon="['fas', 'plus']" size="xs" />
          </button>
          {{ endpointKey }}</div>
      </div>
    </div>

    <div class="col-3 borderWithShadow" style="overflow: hidden">
      <div class=" fs-5 fw-bold">Endpoints to display</div>
      <div v-for="(endpointValue, endpointKey) in currentApiConfig[selectedApiKey]['endpoints']" :key="endpointKey" :id="endpointKey" class="endpoints">
        <button class="btn btn-dark my-mini_btn" @click="removeEndpoint(endpointKey, endpointValue)" >
          <font-awesome-icon :icon="['fas', 'minus']" size="xs" />
        </button>
        {{ endpointKey }}
      </div>
    </div>
  </div>

  <div class="row pt-3">
    <div class="col-1">
      <button
          class="btn btn-dark "
          @click="router.back()"
          id="goBack"
          @mouseenter="bump('goBack')"
      >Go back</button>
    </div>
  </div>


</div>
</template>

<script>
import {useDataStore} from "@/stores/data";
import {storeToRefs} from "pinia";
import {useRouter} from "vue-router";
import {gsap} from "gsap";
import {SplitText} from "gsap/SplitText";
import {useAnimation} from "@/animations/useAnimation.";

gsap.registerPlugin(SplitText);

export default {
  name: "EndpointsConfigurator",
  setup(){
    const dataFromStore = useDataStore();
    const { currentApiConfig, selectedApiKey } = storeToRefs(dataFromStore)
    const { setEndpointItemToCurrentApiConfig, removeEndpointItemToCurrentApiConfig } = dataFromStore
    const router = useRouter()
    const { bump } = useAnimation();

    function addEndpoint(endpointKey, endpointValue){
      setEndpointItemToCurrentApiConfig(selectedApiKey.value, 'endpoints', endpointKey,  endpointValue)
      setTimeout(()=>{
        endpointIn(endpointKey)
      }, 1);
    }

    function removeEndpoint(endpointKey){
      endpointOut(endpointKey)
      setTimeout(()=>{
        removeEndpointItemToCurrentApiConfig(selectedApiKey.value, 'endpoints', endpointKey,)
      }, 400);
    }

    function setColorForSelectedButton(endpointKey){
      let classForButton="btn btn-outline-secondary my-mini_btn"
      Object.entries(currentApiConfig.value[selectedApiKey.value]['endpoints']).forEach(entry => {
        const [key, value] = entry;
        if(endpointKey===key){
          classForButton = "btn btn-dark my-mini_btn"
        }
      });
    return classForButton
    }

    function endpointIn(endpointKey){
      let id = document.getElementById(endpointKey)
      gsap.from(id, {duration: 1, opacity: 0, x:200,  ease:'elastic.out(0.65, 1)', stagger: 0.2});
    }

    function endpointOut(endpointKey){
      let id = document.getElementById(endpointKey)
      gsap.to(id, {duration: 1, opacity:0, x:200,  ease:'elastic.out(0.65, 1)', });


    }


    return { router, currentApiConfig, selectedApiKey, addEndpoint, removeEndpoint, setColorForSelectedButton, bump}
  }
}
</script>

<style scoped>
.my-mini_btn{
  width: 25px ;
  height: 25px;
  padding: 0 !important;
  margin: 0 !important;
}
</style>
