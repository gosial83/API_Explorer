<template>

  <span class="modalContainer">
    <div class="modal" id="box" ref="myModal" >
      <div class="row" >
        <div class="col-6 d-flex align-items-center justify-content-center">
          <div class="logo-animation">
            <img class="img-fluid animationImage"  :src="getLoadingGifPath()"/>
          </div>
      </div>
      <div class="col-6">
        <div class="fs-4 logo-animation-text">Loading data form API...</div>
      </div>
    </div>
    </div>
  </span>

</template>

<script setup>
  import {ref, watch, onMounted} from "vue";
  import {gsap} from "gsap";
  import {ScrambleTextPlugin} from "gsap/ScrambleTextPlugin";
  import {useDataStore} from "@/stores/data";
  import {storeToRefs} from "pinia";

  gsap.registerPlugin(ScrambleTextPlugin);

  const dataFromStore = useDataStore();
  const { currentApiConfig, selectedApiKey, isLoadingData } = storeToRefs(dataFromStore)
  const myModal = ref(null)

  onMounted (() => {
    if(isLoadingData.value === true) {
      getLoadingGifPath()
      openModal();
    }
  })

  function getLoadingGifPath(){
    let fileName = "spinner.gif"

    try {
      let newFileName = currentApiConfig.value[selectedApiKey.value]['loading_gif'];
      if (newFileName) {
        fileName = currentApiConfig.value[selectedApiKey.value]['loading_gif']
      }
    }
    catch (e) {}

    let path = window.location.origin+"/" + fileName
    return path
  }

  watch(isLoadingData, () => {
    if( isLoadingData.value ){
      getLoadingGifPath()
      openModal()

    }else{
      closeModal()
    }
  })

  let tween = gsap.timeline();
  window.gsap = gsap;

  function closeModal(){
    tween.to(myModal.value, { delay: 0.5, scale: 0.1, opacity: 0, duration: 0.5});
  }

  function openModal(){
    tween.set(myModal.value, { xPercent:-50, yPercent:-50, left:"50%", top:"50%",  opacity: 0, scale: 0.1, display:'unset' });
    tween.to(myModal.value, { opacity: 1, duration: 0.5, scale: 1   });
    loadingTextAnimation();
  }

  function loadingTextAnimation(){
    gsap.to(".logo-animation-text",  {duration: 3, scrambleText:{text:"Loading data form API.....", chars:"0123456789", speed:0.6, revealDelay:0, tweenLength:false}});

  }

</script>




<style scoped lang="css">
  .modalContainer{
  }

  .modal{
    display: none;
    font-size: 18px;
    width: 800px;
    height: 330px;
    background-color: white;
    color: black;
    border: solid 1px #1c1b1b;
    -webkit-box-shadow: 1px 1px 3px 0px rgb(98, 77, 50);
    -moz-box-shadow: 1px 1px 3px 0px rgb(114, 88, 53);
    box-shadow: 1px 1px 3px 0px rgb(126, 97, 58);
    border-radius: 5px;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1;
  }

  .logo-animation img {
    padding: 30px;
  }

  .logo-animation-text{
    padding: 140px 0px;
  }

  .animationImage{
    max-height: 320px;
}
</style>
