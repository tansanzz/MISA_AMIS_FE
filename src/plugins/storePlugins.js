import { $api } from "../services/api.js";

export default function(store) {
    try {   
        store.$api = $api
    } catch (error) {
        console.log(error);
    }
}