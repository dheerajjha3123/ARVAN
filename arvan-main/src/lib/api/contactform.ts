import { apiClient } from "@/lib/axiosClient";
import {Contact} from "../../components/admin/contact-list";

export const contactFormApi = {
    getAll: async () => {
        const { data } = await apiClient.get<Contact[]>("/api/send")
        return data
    }
    
}