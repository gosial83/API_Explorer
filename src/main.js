import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {faPhone, faGear, faUpRightAndDownLeftFromCenter, faMaximize} from "@fortawesome/free-solid-svg-icons";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { faFloppyDisk } from "@fortawesome/free-regular-svg-icons";
import { faBan } from "@fortawesome/free-solid-svg-icons";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { faTextWidth } from "@fortawesome/free-solid-svg-icons";
import { faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";
import {faCircleInfo} from "@fortawesome/free-solid-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faMinus, faMobileScreenButton, faTabletScreenButton, faDisplay } from "@fortawesome/free-solid-svg-icons";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { faSort, faArrowUpShortWide, faArrowDownWideShort, faBars } from "@fortawesome/free-solid-svg-icons";
import App from './App.vue'
import router from './router'
import { EndpointsService } from "@/services/EndpointService";


import './assets/main.css'
import {PaginationService} from "@/services/PaginationService";

const app = createApp(App)

library.add(faDisplay);
library.add(faTextWidth);
library.add(faMobileScreenButton);
library.add(faTabletScreenButton);
library.add(faPhone, faGear);
library.add(faCopy);
library.add(faPenToSquare)
library.add(faFloppyDisk)
library.add(faBan)
library.add(faTrashCan)
library.add(faMagnifyingGlass)
library.add(faEye)
library.add(faArrowUp)
library.add(faArrowDown)
library.add(faCircleInfo)
library.add(faXmark)
library.add(faPlus)
library.add(faMinus)
library.add(faFilter)
library.add(faEyeSlash)
library.add(faSort, faArrowUpShortWide, faArrowDownWideShort, faBars, )
library.add(faUpRightAndDownLeftFromCenter, faMaximize)

app.use(createPinia())
app.use(router)
app.component("font-awesome-icon", FontAwesomeIcon)

let endpointApiService = new EndpointsService();

app.provide('endpoint_api_service', endpointApiService)
app.mount('#app')
