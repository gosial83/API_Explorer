<template>

  <div class="col-2" >
    {{ fieldKey }}
  </div>

  <div class="col-10" v-if="fieldValeType==='string'">
    {{fieldValue}}
  </div>

  <div class="col-10" v-else-if="fieldValeType==='date'">
    {{ formatDate(fieldValue) }}
  </div>

  <div class="col-10" v-else-if="fieldValeType==='link'">
    <a :href="fieldValue" target="_blank">{{fieldValue}}</a>
  </div>


  <div class="col-10 borderWithShadow "  v-else-if="fieldValeType==='object'" style=" position: relative">
    <font-awesome-icon
        v-if="isBoxWithJsonScrollable"
        @click="passDataToModal(fieldKey, fieldValue)"
        :icon="['fas', 'up-right-and-down-left-from-center']" size="sm"
        class="buttonBorderWithShadow iconInScrollableBox"
    />
      <div class="boxWithJson" ref="scrollableContent">
        {{ prettyPrintedJSON }}
      </div>
  </div>

  <div class="col-10" v-else>
    {{fieldValue}}
  </div>

</template>

<script>
import {ref, onMounted, nextTick  } from "vue";
import Modal from "@/components/Modal.vue";
import {useDataStore} from "@/stores/data";
import {storeToRefs} from "pinia";
export default {
  name: "PropertyRow",
  components: {
    Modal
  },
  props: [ 'fieldKey',  'fieldValue'],
  setup(props) {

    const dataFromStore = useDataStore();
    const { currentApiConfig, selectedApiKey, selectedEndpointKey, currentColumnsNames } = storeToRefs(dataFromStore)
    const { setCurrentDataInDetailsModal,  } = dataFromStore;

    const fieldValeType = ref(typeof props.fieldValue)
    const prettyPrintedJSON= ref(null)

    const isBoxWithJsonScrollable = ref(false);
    const scrollableContent = ref(null);

    const checkScrollability = () => {

      nextTick(() => {
        const content = scrollableContent.value;

        if (content && content.scrollHeight > content.clientHeight) {
          isBoxWithJsonScrollable.value = true;
        }
      });

    }

    onMounted(checkScrollability);

    if (fieldValeType.value==='string' && props.fieldValue.startsWith("http") ){
      fieldValeType.value = 'link'
    } else if(fieldValeType.value==='string' && (
        props.fieldKey === "created" ||
        props.fieldKey === "released" ||
        props.fieldKey ==="edited"
    ) ){
      let xd = new Date(props.fieldValue)
      fieldValeType.value = 'date'

    }else if(fieldValeType.value==='object' && props.fieldValue.length===0){
      fieldValeType.value = 'string'
    } else if(fieldValeType.value==='object'){
      prettyPrintedJSON.value = JSON.stringify(props.fieldValue, null, 4);
    }

    function formatDate(date) {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' }
        return new Date(date).toLocaleDateString('pl', options)
    }

    function passDataToModal(fieldKey, fieldValue){
      setCurrentDataInDetailsModal('fieldKey', fieldKey)
      setCurrentDataInDetailsModal('fieldValue', fieldValue)
      setCurrentDataInDetailsModal('isBackgroudVisible', true)
    }

    return {  props, fieldValeType, prettyPrintedJSON, formatDate, isBoxWithJsonScrollable,
      scrollableContent, passDataToModal  };
  }

}
</script>

<style scoped>
  .boxWithJson{
    white-space: pre;
    max-height: 15vh;
    overflow: auto;
  }
  .iconInScrollableBox{
    position: absolute;
    color: slategrey;
    right: 35px;
    top: 15px;
    z-index: 100;
    cursor: pointer;
  }

  .iconInScrollableBox:hover {
    background-color: #f3f2f2;
  }

  .buttonBorderWithShadow{
    border: 1px solid #808080a1;
    border-radius: 5px;
    padding: 5px;
    -webkit-box-shadow: 1px 1px 10px -4px rgba(88, 91, 111, 1);
    -moz-box-shadow: 1px 1px 10px -4px rgba(88, 91, 111, 1);
    box-shadow: 1px 1px 10px -4px rgba(88, 91, 111, 1);
  }
</style>
