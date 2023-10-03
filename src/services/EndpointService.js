import { useDataStore } from '@/stores/data'
import { storeToRefs } from "pinia";
import {computed} from "vue";
import {PaginationService} from "@/services/PaginationService";
import {useCurrentDataFromApiStore} from "@/stores/currentDataFromApi";
import {usePaginationData} from "@/stores/paginationData";

export class EndpointsService {
    constructor() {
        const dataFromStore = useDataStore();
        const { currentApiConfig, selectedApiKey, selectedEndpointKey, isLoadingData, isErrorFromApi } = storeToRefs(dataFromStore)
        const { setItemToCurrentApiConfig, setIsLoadingData, setErrorFromApi, setItemToEndpointInCurrentApiConfig,  } = dataFromStore;

        const currentDataFromApi = useCurrentDataFromApiStore()
        const { dataFromApi } = storeToRefs(currentDataFromApi)
        const { setDataToStore } = currentDataFromApi

        const paginationDataFromStore = usePaginationData() ;
        const { paginationData } = storeToRefs(paginationDataFromStore)
        const {  setPaginationValue } = paginationDataFromStore;

        this.paginationService = new PaginationService(this)
        this.currentApiConfig = currentApiConfig;
        this.selectedApiKey = selectedApiKey;
        this.selectedEndpointKey = selectedEndpointKey;
        this.setItemToCurrentApiConfig = setItemToCurrentApiConfig;
        this.setItemToEndpointInCurrentApiConfig = setItemToEndpointInCurrentApiConfig;

        this.paginationData = paginationData
        this.setPaginationValue = setPaginationValue;

        this.isLoadingData = isLoadingData
        this.setIsLoadingData = setIsLoadingData

        this.isErrorFromApi = isErrorFromApi
        this.setErrorFromApi = setErrorFromApi
        this.lastResponseHeaders = {}

        this.dataFromApi = dataFromApi
        this.setDataToStore = setDataToStore

    }


    getUrlToPage(pageNumber){
        return this.paginationService.prepareUrlToPage(pageNumber)
    }

    getUrlForEndpoint(apiKey, endpointKey){
        return this.paginationService.prepareUrlForEndpoint(apiKey, endpointKey)
    }



    fetchEndpointsList() {

        this.setIsLoadingData(true)


        let urlApi = this.currentApiConfig.value[this.selectedApiKey.value]['url']
        let endpointValue = {}
        this.setItemToCurrentApiConfig(this.selectedApiKey.value,'endpoints_all', endpointValue )


        this.get(urlApi)
            .then((data) => {

                this.setIsLoadingData(false)

                let allEndpoints = data

                this.saveAllEndpoints(this.selectedApiKey.value, allEndpoints)

                let quantityEndpointsSelectedToDisplay = Object.keys(this.currentApiConfig.value[this.selectedApiKey.value]['endpoints']).length
                if(quantityEndpointsSelectedToDisplay===0){
                    this.saveFewEndpointsAsChosen(this.selectedApiKey.value, allEndpoints)
                }
            })
            .catch((error) => {
                this.setIsLoadingData(false);
                this.setErrorFromApi(true);
            });
    }
    saveAllEndpoints(apiKey, allEndpoints){
        let allEndpointsToAdd = {}
        let apiUrl = this.currentApiConfig.value[this.selectedApiKey.value]['url']
        Object.entries(allEndpoints).forEach(entry => {
            const [key, value] = entry;

            if(key !== "graphQL"){

                let endpointUrl = ""
                if (value.indexOf("http") === -1){
                    endpointUrl = apiUrl+value
                }else{
                    endpointUrl = value
                }
                allEndpointsToAdd[key]={
                    "label" : key,
                    "url" : endpointUrl,
                    "columns": [],

                }
            }

        });
        this.setItemToCurrentApiConfig(apiKey, 'endpoints_all', allEndpointsToAdd )
    }
    saveFewEndpointsAsChosen(apiKey, allEndpoints){
        let sampleEndpointsToAdd = {}
        let quantityEndpointsForSample = 2
        let i = 1
        let apiUrl = this.currentApiConfig.value[this.selectedApiKey.value]['url']
        Object.entries(allEndpoints).forEach(entry => {
            const [key, value] = entry;

            if(key !=="graphQL"){
                let endpointUrl = ""
                if (value.indexOf("http") === -1){
                    endpointUrl = apiUrl+value
                }else{
                    endpointUrl = value
                }
                if(i<=quantityEndpointsForSample){
                    sampleEndpointsToAdd[key]={
                        "label" : key,
                        "url" : endpointUrl,
                        "columns": [],
                    }
                    i++
                }
            }
        });

        this.setItemToCurrentApiConfig(apiKey, 'endpoints', sampleEndpointsToAdd )
    }

    fetchDataFromEndpoint(url){
        this.setIsLoadingData(true)

        this.get(url).then((data) => {

            this.setIsLoadingData(false)

            let dataFromEndpoint = null
            let dataObjectName = null

            try {
                dataObjectName = this.currentApiConfig.value[this.selectedApiKey.value]['paginationData']['dataObjectName']
            }catch (e) {

            }
            if ( dataObjectName === 'results' || 'results' in data){
                dataFromEndpoint = data.results
            }else if ( dataObjectName === 'data' || 'data' in data){
                dataFromEndpoint = data.data
            }else {
                dataFromEndpoint = data
            }

            this.saveAllColumns(this.selectedApiKey.value, this.selectedEndpointKey.value, dataFromEndpoint)

            let itemsPerPage = this.paginationData.value['itemsPerPage']

            if (dataFromEndpoint.length > itemsPerPage) {
                let partDataFromEndpoint = dataFromEndpoint.slice(0, itemsPerPage);
                dataFromEndpoint = partDataFromEndpoint
            }

            this.setItemToEndpointInCurrentApiConfig(this.selectedApiKey.value, this.selectedEndpointKey.value, 'data', dataFromEndpoint )
            this.setDataToStore(dataFromEndpoint)
            this.paginationService.preparePaginationData(data)

            let quantityColumnsSelectedToDisplay = Object.keys(this.currentApiConfig.value[this.selectedApiKey.value]['endpoints'][this.selectedEndpointKey.value]['columns']).length
            if ( quantityColumnsSelectedToDisplay === 0 ){
                this.saveFewColumnsAsChosen(this.selectedApiKey.value,this.selectedEndpointKey.value, dataFromEndpoint )
            }
        })
    }
    saveAllColumns(apiKey, endpointKey,  dataFromEndpoint){
        let columnsNames=Object.keys(dataFromEndpoint[0])
        let columnsFromEndpointToSave = []

        columnsNames.forEach((column)=>{
            let columnToSave = {
                "name": column,
                "label": this.prepareColumnLabel(column)
            }
            columnsFromEndpointToSave.push(columnToSave)
        })

        this.setItemToEndpointInCurrentApiConfig(apiKey, endpointKey, 'columns_all', columnsFromEndpointToSave )
    }


    prepareColumnLabel(columnName) {
        let capitalizeFirstLetter = columnName.charAt(0).toUpperCase() + columnName.slice(1);
        return capitalizeFirstLetter.split('_').join(' ');
    }
    saveFewColumnsAsChosen(apiKey, endpointKey,  dataFromEndpoint, ) {
        let sampleColumnsFromEndpointToSave = []
        let quantityColumnsForSample = 3
        let i = 1
        Object.entries(dataFromEndpoint[0]).forEach(entry => {
            const [key, value] = entry;
            if (i <= quantityColumnsForSample && typeof value) {
                let columnToSave = {
                    "name": key,
                    "label": key
                }
                sampleColumnsFromEndpointToSave.push(columnToSave)
                i++
            }
        });
        this.setItemToEndpointInCurrentApiConfig(apiKey, endpointKey, 'columns', sampleColumnsFromEndpointToSave )
    }

    fetchDetails(url) {

        this.setIsLoadingData(true)

        return this.get(url).then((data) => {
            this.setIsLoadingData(false)
            return data;
        })
    }
    get(url) {
        let vm = this;
        return fetch(url).then((res)=> {
            let paginationObjectName = ""
            try {
                    paginationObjectName = this.currentApiConfig.value[this.selectedApiKey.value]['pagination']['paginationObjectName']
                }
                catch (e) {

                }

                if (paginationObjectName==="linkHeaderInfo"){
                    vm.lastResponseHeaders = res.headers;
                }
                return res.json()
            }
        );
    }


}
