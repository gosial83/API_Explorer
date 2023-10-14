<template>

  <span class="modalContainer" >
    <div :class="'modal ' + props.modalType" id="box" ref="myModal" >
      <div class="closeContainer">
        <div class="close" @click="closeModal">x</div>
      </div>

      <div class="textContainer">
        <slot name="text"></slot>
      </div>

      <div class="slotButtons">
        <div v-if="$slots.buttonYes && $slots.buttonNo" class="button">
          <div >
            <span @click="actionForYesButton">
              <slot  name="buttonYes" ></slot>
            </span>
            <span @click="closeModal">
              <slot  name="buttonNo" ></slot>
            </span>
          </div>
        </div>

        <div v-else class="button">
          <button> OK Default button</button>
          <button> Anuluj Default button</button>
        </div>
      </div>

    </div>
  </span>

  <span >
    <button
        id="columns"
        :class="props.classForOpenModal"
        @click="openModal"
        @mouseenter="bump('columns')"
    ><slot name="openModalButton" ></slot></button>
  </span>

</template>


<script setup>
  import { gsap } from "gsap";
  import {ref, watch} from "vue";
  import {useDataStore} from "@/stores/data";
  import {storeToRefs} from "pinia";
  import {useAnimation} from "@/animations/useAnimation.";

  const props= defineProps({
    classForOpenModal: String,
    modalType: String,
    funkcjonForYesButton: Function
  })

  const myModal = ref(null)
  const { bump } = useAnimation();
  const dataFromStore = useDataStore();
  const {  currentDataInDetailsModal } = storeToRefs(dataFromStore)


  watch(() => currentDataInDetailsModal, (newValue) => {
    if (newValue) {
      openModal();
    } else {
      closeModal();
    }
  });

  let tween = gsap.timeline();
  window.gsap = gsap;

  function actionForYesButton (){
    props.funkcjonForYesButton()
  }

  function closeModal(){
    if ( props.modalType === 'appearInCenter' ) {
      tween.to(myModal.value, { scale: 0.1, opacity: 0, duration: 1});
    } else if ( props.modalType === 'appearFromRight' ) {
      tween.to(myModal.value, { left:"100%", duration: 1});
    }
  }

  function openModal(){
    if ( props.modalType === 'appearInCenter' ) {
      tween.set(myModal.value, { xPercent:-50, yPercent:-50, left:"50%", top:"50%",  opacity: 0, scale: 0.1, display:'unset' });
      tween.to(myModal.value, { opacity: 1, duration: 0.5, scale: 1   });
    } else if ( props.modalType === 'appearFromRight' )  {
      tween.set(myModal.value, {   left:"100%", display:'unset' });
      tween.to(myModal.value, { left:"85%", duration: 0.5, scale: 1   });
    }
  }


</script>



<style scoped lang="css">
  .modalContainer{
  }

  .modal{
    display: none;
    font-size: 18px;
    width: 800px;
    height: 350px;
    background-color: white;
    color: black;
    border: solid 1px #1c1b1b;
    -webkit-box-shadow: 1px 1px 3px 0px rgb(98, 77, 50);
    -moz-box-shadow: 1px 1px 3px 0px rgb(114, 88, 53);
    box-shadow: 1px 1px 3px 0px rgb(126, 97, 58);
    border-radius: 5px;
    position: fixed;
    top: 0;
    z-index: 1;
  }

  .appearInCenter{
    width: 800px;
    height: 350px;
    left: 0;
  }

  .appearFromRight{
    width: 15%;
    height: 100%;
    left: 85%;
  }

  .modalButtonOn{
  }

  .modalButtonOff{
    z-index: -1;
  }
  .closeContainer{
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .close{
    padding: 0px 10px;
    font-weight: bold;
    font-size: 20px;
  }

  .slotButtons{
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 10px;
    font-weight: 700;

  }

  .button{
    font-weight: 700;
  }

  .textContainer{
    padding: 0px 20px;
  }
</style>
