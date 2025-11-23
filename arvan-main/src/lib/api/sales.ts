import { apiClient } from "@/lib/axiosClient";
import { SalesOverview } from "../../components/admin/sales-overview";

export const salesApi = {
    getAll: async () => {
        const { data } = await apiClient.get<SalesOverview[]>("/api/sales/all-time")
        return data
    }
}
