<template>
  <span class="modalContainer ">
    <div class="modal " id="box" ref="myModal" >

      <div class="closeContainer">
        <div> <b>Propery:</b> {{currentDataInDetailsModal.fieldKey}}</div>
        <div class="buttonBorderWithShadow close" @click="closeModal">X</div>
      </div>

      <div class="row textContainer">
        <div class="col-1"> <b>Value:</b> </div>
        <div class="col boxWithJson expandJson" >
          {{currentDataInDetailsModal.fieldValue}}
        </div>
      </div>

    </div>
  </span>


</template>

<script>
import {ref, watch} from "vue";
import {useDataStore} from "@/stores/data";
import {storeToRefs} from "pinia";
import {gsap} from "gsap";
import {SplitText} from "gsap/SplitText";

gsap.registerPlugin(SplitText);

export default {
  name: "ModalExpandProperty",
  setup(props) {

    const myModal = ref(null)

    const dataFromStore = useDataStore();
    const {  currentDataInDetailsModal,  isLoadingData } = storeToRefs(dataFromStore)
    const { setCurrentDataInDetailsModal  } = dataFromStore;

    watch(() => currentDataInDetailsModal.value.fieldKey, (newValue, oldValue) => {
      if(currentDataInDetailsModal.value.fieldKey !==""){
        openModal();
      }
    }, { deep: true });


    let tween = gsap.timeline();
    window.gsap = gsap;


    function closeModal(){
      tween.to(myModal.value, { scale: 0.1, opacity: 0, duration: 1});
      setCurrentDataInDetailsModal('isBackgroudVisible', false)
      setTimeout(()=>{
        setCurrentDataInDetailsModal('fieldKey', "" )
      }, 500);
      setTimeout(()=>{
        setCurrentDataInDetailsModal('fieldValue', "" )
      }, 500);
    }

    function openModal(){
      tween.set(myModal.value, { xPercent:-50, yPercent:-50, left:"50%", top:"50%",  opacity: 0, scale: 0.5, display:'unset' });
      tween.to(myModal.value, { opacity: 1, duration: 0.5, scale: 1   });
    }



    return { closeModal, openModal, myModal, props, currentDataInDetailsModal };
  }
}
</script>

<style scoped>
.modal{
  display: none;
  /*font-size: 18px;*/
  width: 75vw;
  max-height: 85vh;
  height: auto;

  background-color: white;
  color: black;


  border: 1px solid #808080a1;
  border-radius: 5px;
  padding: 10px;
  -webkit-box-shadow: 1px 1px 10px -4px rgba(88, 91, 111, 1);
  -moz-box-shadow: 1px 1px 10px -4px rgba(88, 91, 111, 1);
  box-shadow: 1px 1px 10px -4px rgba(88, 91, 111, 1);

  position: fixed;
  top: 0;
  z-index: 300;

}

.textContainer{
  padding-left: 20px;
  padding-right: 5px;
  margin-top: 10px;

  margin-bottom: 5px;

}

.closeContainer{
  padding-left: 20px;
  padding-right: 3px;

  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close{
  color: slategrey;
  cursor: pointer;

  font-weight: bold;
  font-size: 12px;

  height: 25px;
  width: 23px;

  display: flex;
  align-items: center;
  justify-content: center;
}

.close:hover {
  background-color: #f3f2f2;
}

.boxWithJson{
  white-space: pre;
  max-height: 75vh;
  overflow: auto;
}

.buttonBorderWithShadow{
  border: 1px solid #808080a1;
  border-radius: 5px;

  -webkit-box-shadow: 1px 1px 10px -4px rgba(88, 91, 111, 1);
  -moz-box-shadow: 1px 1px 10px -4px rgba(88, 91, 111, 1);
  box-shadow: 1px 1px 10px -4px rgba(88, 91, 111, 1);
}
</style>
