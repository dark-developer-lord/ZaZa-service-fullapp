import { DateRange } from "@mui/x-date-pickers-pro"
import { Dayjs } from "dayjs"
import { formatDateForAPI } from "@shared/lib"

interface FilterDto {
    type: "income" | "expense" | null
    category_id: number | null
    subcategory_id: number | null
    date: DateRange<Dayjs>
}

export const dtoToQuery = ({ type, category_id, subcategory_id, date }: FilterDto) => {
    const query = new URLSearchParams()

    if (type) {
        query.append("type", type.toString())
    }
    if (subcategory_id) {
        query.append("transaction_category_id", subcategory_id.toString())
    } else if (category_id) {
        query.append("transaction_category_id", category_id.toString())
    }
    if (date[0] && date[1]) {

        query.append('date_from', formatDateForAPI(date[0] as Dayjs))
        query.append('date_to', formatDateForAPI(date[1] as Dayjs))
    }

    return query
}