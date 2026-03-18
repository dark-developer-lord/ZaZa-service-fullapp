export class ArrivalStorage {
    static init() {
        if (!localStorage.getItem('new-arrival')) {
            const arrival = {
                name: '',
                provider_name: '',
                provider_phone: '',
                company_name: '',
                address: '',
                identification_info: '',
                provider_contact: '',
                status: '',
                warehouse_id: null,
                products: [],

            }
        }
    }
}