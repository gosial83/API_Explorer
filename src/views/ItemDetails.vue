<template>

  <div class="backgroundForModalExpand" ref="backgroundForModal"></div>
  <ModalExpandProperty></ModalExpandProperty>

  <div class="px-3">

    <div class=" borderWithShadow fs-4 mb-3 headerBox" >
      <div class="fw-bold pe-3">API: </div>
      <div v-if="selectedApiKey !== '' ">{{ currentApiConfig[selectedApiKey]['name'] }}</div>
      <div v-else>{{ selectedApiKey }}</div>
      <div class="fw-bold ps-5 pe-3">ENDPOIT:    </div>
      <div>{{ currentApiConfig[selectedApiKey]['endpoints'][selectedEndpointKey]['row']['url'] }}</div>
    </div>

    <div class="row borderWithShadow contentBox" >
      <div class="col-9 contentColumn">
        <div class="row headerRow" >
          <div class="col-2 fw-bold">Property </div>
          <div class="col-10 fw-bold">Value</div>
        </div>
        <div class="row detailsRow"  v-for="(fieldValue, fieldKey) in itemToDisplay ">
          <PropertyRow
            :fieldKey="fieldKey"
            :fieldValue="fieldValue"
          ></PropertyRow>
        </div>
      </div>
      <div class="col-3 imageColumn">
        <div class="row" v-for="(fieldValue, fieldKey) in imageItemToDisplay    ">
          <div class="col d-flex justify-content-center" v-if="fieldKey==='image'">
            <img :src="fieldValue"   alt="image" class="image">
          </div>
        </div>
      </div>
    </div>

    <div class="my-3">
      <button
          class="btn btn-dark"
          @click="router.back()"
          id="goToHomePage"
          @mouseenter="bump('goToHomePage')"
      >Go back</button>
    </div>

  </div>

  <Loading/>

</template>

<script>
import {useDataStore} from "@/stores/data";
import {storeToRefs} from "pinia";
import {useRouter} from "vue-router";
import {inject, ref, watch} from "vue";
import Loading from "@/components/Loading.vue";
import PropertyRow from "@/components/PropertyRow.vue";
import Modal from "@/components/Modal.vue";
import ModalExpandProperty from "@/components/ModalExpandProperty.vue";
import {gsap} from "gsap";
import {useAnimation} from "@/animations/useAnimation.";

export default {
  name: "ItemDetails",
  components: {ModalExpandProperty, PropertyRow, Loading, Modal},
  setup(){
    const dataFromStore = useDataStore();
    const { currentApiConfig, selectedApiKey,selectedEndpointKey, currentDataInDetailsModal } = storeToRefs(dataFromStore)
    const endpointApiService = inject('endpoint_api_service');
    const router = useRouter()
    const { bump } = useAnimation();

    const backgroundForModal = ref(null)
    let url =  currentApiConfig.value[selectedApiKey.value]['endpoints'][selectedEndpointKey.value]['row']['url']

    const imageItemToDisplay = ref({})
    const itemToDisplay = ref({})

    endpointApiService.fetchDetails(url).then((data) => {
      Object.entries(data).forEach(entry => {
        const [key, value] = entry;
        if(key==='image'){
          imageItemToDisplay.value[key]=value
        }else {
          itemToDisplay.value[key] = value;
        }
      });
    })

    watch(() => currentDataInDetailsModal.value.isBackgroudVisible, (newValue, oldValue) => {
      if(currentDataInDetailsModal.value.isBackgroudVisible !==false){
        openModal();
      }else if(currentDataInDetailsModal.value.isBackgroudVisible === false){
         closeModal();
      }

    }, { deep: true });

    let tween = gsap.timeline();
    window.gsap = gsap;

    function openModal(){
      tween.set(backgroundForModal.value, { opacity: 0,  display:'unset' });
      tween.to(backgroundForModal.value, { opacity: 1, duration: 0.5,  });
    }

    function closeModal(){
      tween.to(backgroundForModal.value, {  opacity: 0, display: 'none',  duration: 1});
    }

    return { currentApiConfig, selectedApiKey,selectedEndpointKey, itemToDisplay, imageItemToDisplay, currentDataInDetailsModal, backgroundForModal,  router, bump}
  }
}
</script>

<style scoped>
  .backgroundForModalExpand{
    min-height: 100%;
    min-width: 100%;
    background: rgb(160 157 157 / 80%);
    position: absolute;
    z-index: 200;
    display: none;
    opacity: 0;
  }
  .headerBox{
    display: flex;
    height: 6vh;
    align-items: center;
  }
  .contentBox{
    height: 76vh;
    overflow: auto;
    overflow-x: hidden;
  }
  .image{
    max-height: 400px;
    max-width: 350px
  }
  .detailsRow{
    margin-top: 10px;
    margin-bottom: 10px
  }
</style>
