import { useDataStore } from '@/stores/data'
import { storeToRefs } from "pinia";
import {computed} from "vue";
import {usePaginationData} from "@/stores/paginationData";

export class PaginationService {
    constructor(endpointService) {
        const dataFromStore = useDataStore();
        const { currentApiConfig, selectedApiKey, selectedEndpointKey   } = storeToRefs(dataFromStore)

        const paginationDataFromStore = usePaginationData() ;
        const { paginationData } = storeToRefs(paginationDataFromStore)
        const {  setPaginationValue } = paginationDataFromStore;


        this.currentApiConfig = currentApiConfig;
        this.selectedApiKey = selectedApiKey;
        this.selectedEndpointKey = selectedEndpointKey;
        this.paginationData = paginationData;
        this.endpointService = endpointService;
        this.setPaginationValue = setPaginationValue;

        this.urlForEndpoint = ""
        this.limitName = ""
        this.offsetName = ""
        this.paginationType = ""
        this.itemsPerPage = null
        this.currentPageNumber = null
    }

    prepareUrlForEndpoint(apiKey, endpointKey){
        this.urlForEndpoint = this.currentApiConfig.value[this.selectedApiKey.value ]['endpoints'][this.selectedEndpointKey.value]['url']
        this.limitName = this.currentApiConfig.value[this.selectedApiKey.value]['pagination']['limitName']
        this.offsetName = this.currentApiConfig.value[this.selectedApiKey.value]['pagination']['offsetName']
        this.paginationType = this.currentApiConfig.value[this.selectedApiKey.value]['pagination']['paginationType']
        this.paginationObjectName = this.currentApiConfig.value[this.selectedApiKey.value]['pagination']['paginationObjectName']
        this.itemsPerPage = this.paginationData.value['itemsPerPage']
        this.currentPageNumber = this.paginationData.value['currentPageNumber']
        this.lastPageNumber = this.paginationData.value['lastPageNumber']


        if ( this.paginationType ===  'limitAndOffset' && this.paginationObjectName === 'withoutPaginationData' && this.lastPageNumber === null){
            // 1 https://bobsburgers-api.herokuapp.com/characters?limit=20&skip=0
        }else if ( this.paginationType ===  'limitAndOffset'){
            // https://bobsburgers-api.herokuapp.com/characters?limit=20&skip=0
            // https://pokeapi.co/api/v2/pokemon?offset=20&limit=20"
            this.urlForEndpoint = this.urlForEndpoint + "?" + this.limitName  + "=" + this.itemsPerPage  + "&" + this.offsetName + "=" + (this.currentPageNumber-1)
        } else if (this.paginationType ===  'pageAndPageSize'){
            // 1 https://anapioficeandfire.com/api/characters?page=1&pageSize=10"
            this.urlForEndpoint = this.urlForEndpoint + "?" + "page=" + this.currentPageNumber + "&pageSize=" + this.itemsPerPage
        }

        return this.urlForEndpoint
    }


    prepareUrlToPage(pageNumber){
        this.urlForEndpoint = this.currentApiConfig.value[this.selectedApiKey.value ]['endpoints'][this.selectedEndpointKey.value]['url']

        let urlToPageNumber = this.urlForEndpoint + "?"

        if (this.paginationType ===  'pageAndPageSize'){
            //   https://anapioficeandfire.com/api/characters?page=1&pageSize=10
            urlToPageNumber = urlToPageNumber + 'page=' + pageNumber + '&pageSize=' + this.itemsPerPage
        }

        if (this.paginationType ===  'onlyPageNumber'){
            //   "https://swapi.dev/api/people/?page=2"
            urlToPageNumber = urlToPageNumber + 'page=' + pageNumber
        }

        if (this.paginationType ===  'limitAndOffset'){
            // https://bobsburgers-api.herokuapp.com/characters?limit=20&skip=0
            // https://pokeapi.co/api/v2/pokemon?offset=20&limit=20"

            urlToPageNumber = urlToPageNumber + this.limitName + "=" + this.itemsPerPage + "&" + this.offsetName + "=" + ((pageNumber-1)*this.itemsPerPage)
        }

        if (this.paginationType ===  'pageAndPageSize'){
            // 1 https://anapioficeandfire.com/api/characters?page=1&pageSize=10"
            urlToPageNumber = urlToPageNumber + "?" + "page=" + this.currentPageNumber + "&pageSize=" + this.itemsPerPage
        }

        return urlToPageNumber
    }
    preparePaginationData(dataFromApi){

        let paginationConfig = this.currentApiConfig.value[this.selectedApiKey.value]['pagination']
        let paginationObjectName = this.currentApiConfig.value[this.selectedApiKey.value]['pagination']['paginationObjectName']

        if (paginationObjectName==='info'){
            let paginationData = dataFromApi['info']
            //{count: 826, pages: 42, next: 'https://rickandmortyapi.com/api/character?page=2', prev: null}
            this.preparePaginationDataForApiWithCountNextPrevious(paginationData, dataFromApi.results )
        }

        if (paginationObjectName==='mainObject'){
            let paginationData = dataFromApi
            //{count: 1281, next: 'https://pokeapi.co/api/v2/pokemon?offset=60&limit=20', previous: 'https://pokeapi.co/api/v2/pokemon?offset=20&limit=20', results: Array(20)}
            // {count: 82, next: 'https://swapi.dev/api/people/?page=4', previous: 'https://swapi.dev/api/people/?page=2', results: Array(10)}
            this.preparePaginationDataForApiWithCountNextPrevious(paginationData, dataFromApi.results )
        }

        if (paginationObjectName==='linkHeaderInfo'){
            let propertyName = paginationConfig['linkHeaderPropertyName']
                let linkHeaderInfo = this.endpointService.lastResponseHeaders.get(propertyName)
                this.preparePaginationDataForApiWithPaginationInLinkHeaderInfo(linkHeaderInfo)
        }

        if (paginationObjectName==='withoutPaginationData'){
            this.preparePaginationDataForApiWithoutPaginationInfo(dataFromApi.length)
        }

    }

    preparePaginationDataForApiWithPaginationInLinkHeaderInfo(linkHeaderInfo){
        let paginationConfig = this.currentApiConfig.value[this.selectedApiKey.value]['pagination']
        let paginationInfoLinks = linkHeaderInfo.split(",")

        paginationInfoLinks.forEach( (linkInfo)=>{
            let linkStart = linkInfo.indexOf("<");
            let linkstop = linkInfo.indexOf(">");
            let link = linkInfo.substring(linkStart+1, linkstop)

            let linkTypeStart = linkInfo.indexOf('="');
            let linkTypeStop = linkInfo.length;
            let linkType = linkInfo.substring(linkTypeStart+2, linkTypeStop-1)

            if (paginationConfig['paginationProperties']['previous'] === linkType ){
                this.setPaginationValue('previousUlr', link )
            }
            if (paginationConfig['paginationProperties']['next'] === linkType ){
                this.setPaginationValue('nextUrl', link )
            }

            if (paginationConfig['paginationProperties']['first'] === linkType ){
                this.setPaginationValue('firstUrl', link )
            }
            if (paginationConfig['paginationProperties']['last'] === linkType ){
                this.setPaginationValue('lastUrl', link )
                //<https://anapioficeandfire.com/api/characters?page=72&pageSize=30>; rel="last"
                let pageStart = linkInfo.indexOf('page=');
                let pageStop = linkInfo.indexOf('&');
                let pageNumber = linkInfo.substring(pageStart+5, pageStop)
                this.setPaginationValue('lastPageNumber', parseInt(pageNumber)  )
            }
        })


    }
    preparePaginationDataForApiWithoutPaginationInfo( count ){
        this.urlForEndpoint = this.currentApiConfig.value[this.selectedApiKey.value ]['endpoints'][this.selectedEndpointKey.value]['url']
        this.currentPageNumber = this.paginationData.value['currentPageNumber']
        let lastPageNumber = null
        let previousPageUrl = null
        let nextPageUrl = null

        if (this.paginationData.value['totalItemsCount']=== null){
            this.setPaginationValue('totalItemsCount', count)
            lastPageNumber = Math.ceil(count/this.itemsPerPage);
            this.setPaginationValue('lastPageNumber', lastPageNumber )
        } else if (this.currentPageNumber ===1 ){
            lastPageNumber = Math.ceil(this.paginationData.value['totalItemsCount']/this.itemsPerPage );
            this.setPaginationValue('lastPageNumber', lastPageNumber )
        }

        // 1 https://bobsburgers-api.herokuapp.com/characters?limit=20&skip=0
        // 2 https://bobsburgers-api.herokuapp.com/characters?limit=40&skip=20
        // 3 https://bobsburgers-api.herokuapp.com/characters?limit=60&skip=40

        nextPageUrl = this.urlForEndpoint  + "?" + this.limitName + "=" + this.itemsPerPage  + "&"+ this.offsetName  + "=" + this.itemsPerPage  * (this.currentPageNumber )

        if(this.currentPageNumber  > 1){
            previousPageUrl =  this.urlForEndpoint  + "?" + this.limitName + "=" + this.itemsPerPage  + "&"+ this.offsetName  + "=" + this.itemsPerPage  * (this.currentPageNumber -2)
        } else if(this.currentPageNumber ===lastPageNumber){
            nextPageUrl = null
        }

        this.setPaginationValue('nextUrl', nextPageUrl)
        this.setPaginationValue('previousUlr', previousPageUrl)

    }


    preparePaginationDataForApiWithCountNextPrevious(paginationData, results){
        //{count: 826, pages: 42, next: 'https://rickandmortyapi.com/api/character?page=2', prev: null}
        //{count: 1281, next: 'https://pokeapi.co/api/v2/pokemon?offset=60&limit=20', previous: 'https://pokeapi.co/api/v2/pokemon?offset=20&limit=20', results: Array(20)}
        let propertyForPrevious = this.currentApiConfig.value[this.selectedApiKey.value]['pagination']['paginationProperties']['previous']
        this.setPaginationValue('totalItemsCount', paginationData.count)
        this.setPaginationValue('nextUrl', paginationData.next)
        this.setPaginationValue('previousUlr', paginationData[propertyForPrevious])

        if ('pages' in paginationData){
            this.setPaginationValue('lastPageNumber', paginationData.pages)
        } else if(paginationData.previous===null){
            let lastPage = Math.ceil(paginationData.count/results.length);
            this.setPaginationValue('lastPageNumber', lastPage)
        }
    }

}
