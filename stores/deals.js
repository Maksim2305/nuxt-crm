import { defineStore } from "pinia";
import { account, databases } from "../utils/appwrite";
import { v4 as uuidv4 } from 'uuid';
import { DB, DEALS_ID } from "~/app.constants"; 

export const useDealsStore = defineStore('deals', {
    state: ()=>{
        return {
            deals: []
        }
    },
    getters:{
        dealsList(state){
            return state.deals;
        }
    },
    actions:{
        async getDeals(){
            const { documents } = await databases.listDocuments(DB, DEALS_ID);
            this.deals = documents;
        },
        async createDeal(payload){
            const deal = await databases.createDocument(DB, DEALS_ID, uuidv4(), payload);
            this.deals.push(deal);
        },
        async updateDeal(dealId, payload){
            const deal = await databases.updateDocument(DB, DEALS_ID, dealId, payload);
            if(deal){
                let indexDeal = this.deals.findIndex(item => item.$id === dealId);
                if(indexDeal > -1){
                    this.deals.splice(indexDeal, 1, deal);
                }
            }
        },
        async deleteDeal(dealId, payload){
            await databases.deleteDocument(DB, DEALS_ID, dealId, payload);
        },
    }

})