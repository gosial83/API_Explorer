<template>
  <div class="row pageHeaderContainer" >

    <div class="col-1" @click="router.push('/')" >
      <img src="/src/assets/api_explorer.png" height="80">
    </div>

    <div class="col myAppName  fs-1 fw-bolder p-2"
         id="myAppName"
         @mouseenter="bump('myAppName')"
         @click="router.push('/')"
    >
      API Explorer
    </div>

    <div class="col  fs-1 fw-bolder p-2"
         @click="router.push('/')">
    </div>


  </div>

</template>

<script setup>
  import {useRouter} from "vue-router";
  import {onMounted} from "vue";
  import {useAnimation} from "@/animations/useAnimation.";
  import {gsap} from "gsap";
  import {SplitText} from "gsap/SplitText";
  import CSSRulePlugin from "gsap/CSSRulePlugin";

  gsap.registerPlugin(SplitText);
  gsap.registerPlugin(CSSRulePlugin);

  const router = useRouter()
  const { bump } = useAnimation();

  onMounted (() => {
    let mySplitText = new SplitText(".myAppName", { type: "words,chars" });
    let chars = mySplitText.chars;
    gsap.from(chars, {
      duration: 1,
      opacity: 0,
      rotation: 0,
      y: -50,
      ease: "elastic.out(1, 0.3)",
      stagger: 0.15
    });
  })

</script>




<style scoped>
  .pageHeaderContainer{
    margin-bottom: 8px
  }


</style>
