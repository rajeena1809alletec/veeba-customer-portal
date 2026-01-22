import axios from "axios";

const BACKEND_URL = "http://localhost:5000";
const BASE_API_URL = "/api";
const COMPANY_ID = "2d90f615-1d92-f011-b41a-6045bde7bf1a";

export const createCustomer = async (customerData) => {
    console.log("customer data: ", customerData);

    try {
        const response = await axios.post(`${BACKEND_URL}${BASE_API_URL}/alletec/app/v2.0/companies(${COMPANY_ID})/customer`,
            customerData,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log("Response of createCustomer (BusinessCentralAPI.js): ", response);
        return { success: true, data: response.data };
    } catch (error) {
        console.error('Error creating customer(BusinessCentralAPI.js):', error);
        return {
            success: false,
            error: error.response?.data?.details || error.message,
        };
    }
};


export const createCustomerCredentials = async (credentialsData) => {
    console.log("customer credentials data: ", credentialsData);

    try {
        const response = await axios.post(
            `${BACKEND_URL}${BASE_API_URL}/alletec/app/v2.0/companies(${COMPANY_ID})/customerCredentials`,
            credentialsData,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log("Response of createCustomerCredentials(BusinessCentralAPI.js): ", response);
        return { success: true, data: response.data };
    } catch (error) {
        console.error('Error creating customer credentials(BusinessCentralAPI.js):', error);
        return {
            success: false,
            error: error.response?.data?.details || error.message,
        };
    }
};

export const loginCustomer = async (email, password) => {
    // console.log("Login attempt for:", email);

    try {
        const response = await axios.get(
            `${BACKEND_URL}${BASE_API_URL}/alletec/app/v2.0/companies(${COMPANY_ID})/customerCredentials?$filter=emailId eq '${email}' and password eq '${password}'`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log("Login response(BusinessCentralAPI.js):", response);
        if (response.data && response.data.value && response.data.value.length > 0) {
            const userData = response.data.value[0];
            return {
                success: true,
                data: {
                    customerId: userData.customerId,
                    username: userData.username,
                    emailId: userData.emailId
                }
            };
        } else {
            return {
                success: false,
                error: 'Invalid email or password'
            };
        }
    } catch (error) {
        console.error('Login error(BusinessCentralAPI.js):', error);
        return {
            success: false,
            error: error.response?.data?.details || 'Login failed. Please try again.',
        };
    }
};


// export const getCustomerByCustomerId = async (customerId) => {
//     console.log("Fetching customer data for customerId:", customerId);

//     try {
//         const response = await axios.get(
//             `${BACKEND_URL}${BASE_API_URL}/alletec/app/v2.0/companies(${COMPANY_ID})/customer?$filter=no eq '${customerId}'`,
//             {
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//             }
//         );

//         console.log("Customer data response(BusinessCentralAPI.js):", response);

//         // Check if any records returned
//         if (response.data && response.data.value && response.data.value.length > 0) {
//             return { success: true, data: response.data.value[0] };
//         } else {
//             return { success: false, error: 'Customer not found' };
//         }
//     } catch (error) {
//         console.error('Error fetching customer(BusinessCentralAPI.js):', error);
//         return {
//             success: false,
//             error: error.response?.data?.details || 'Failed to fetch customer data',
//         };
//     }
// };

export const getCustomerByCustomerId = async (customerNo, filters = {}) => {
    try {
        let filterQuery = `no eq '${customerNo}'`;

        if (filters.dateFilterFrom && filters.dateFilterTo) {
            filterQuery += `&dateFilter eq '${filters.dateFilterFrom}..${filters.dateFilterTo}'`;
        }

        let queryParams = `$filter=${filterQuery}`;

        // console.log("URL: ", `${BACKEND_URL}${BASE_API_URL}/alletec/app/v2.0/companies(${COMPANY_ID})/customer?${queryParams}`);

        const response = await axios.get(
            `${BACKEND_URL}${BASE_API_URL}/alletec/app/v2.0/companies(${COMPANY_ID})/customer?${queryParams}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log("Customer response(BusinessCentralAPI.js):", response);

        if (response.data && response.data.value && response.data.value.length > 0) {
            return { success: true, data: response.data.value[0] };
        } else {
            return { success: false, error: 'Customer not found' };
        }
    } catch (error) {
        console.error('Error fetching customer(BusinessCentralAPI.js):', error);
        return {
            success: false,
            error: error.response?.data?.details || 'Failed to fetch customer',
        };
    }
};


export const getCustomerLedgerEntries = async (customerNo, filters = {}) => {
    try {
        // Base filter for customer number
        let filterQuery = `customerNo eq '${customerNo}'`;
        // Add additional filters if provided
        if (filters.open !== undefined) {
            filterQuery += ` and open eq ${filters.open}`;
        }
        if (filters.documentType) {
            filterQuery += ` and documentType eq '${filters.documentType}'`;
        }
        if (filters.postingDateFrom) {
            filterQuery += ` and postingDate ge ${filters.postingDateFrom}`;
        }
        if (filters.postingDateTo) {
            filterQuery += ` and postingDate le ${filters.postingDateTo}`;
        }
        // Build additional query parameters
        let queryParams = `$filter=${filterQuery}`;

        if (filters.orderBy) {
            queryParams += `&$orderby=${filters.orderBy}`;
        }

        if (filters.top) {
            queryParams += `&$top=${filters.top}`;
        }

        const response = await axios.get(
            `${BACKEND_URL}${BASE_API_URL}/alletec/app/v2.0/companies(${COMPANY_ID})/customerLedgerEntries?${queryParams}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log("Ledger entries response(BusinessCentralAPI.js):", response);

        if (response.data && response.data.value) {
            return { success: true, data: response.data.value };
        } else {
            return { success: false, error: 'No ledger entries found' };
        }
    } catch (error) {
        console.error('Error fetching ledger entries(BusinessCentralAPI.js):', error);
        return {
            success: false,
            error: error.response?.data?.details || 'Failed to fetch ledger entries',
        };
    }
};

export const getCurrentMonthInvoiceAmount = async (customerNo, dateFrom, dateTo) => {
    try {
        // Build filter query
        let filterQuery = `customer_No_Filter_FilterOnly eq '${customerNo}' and posting_Date_Filter_FilterOnly ge ${dateFrom} and posting_Date_Filter_FilterOnly le ${dateTo}`;
        // const encodedFilter = encodeURIComponent(filterQuery);
        let queryParams = `$filter=${filterQuery}`;

        // console.log('Current Month Invoice API URL:', `${BACKEND_URL}${BASE_API_URL}/alletec/app/v2.0/companies(${COMPANY_ID})/CustCurrentMonthInvoiceAmts?${queryParams}`);

        const response = await axios.get(
            `${BACKEND_URL}${BASE_API_URL}/alletec/app/v2.0/companies(${COMPANY_ID})/CustCurrentMonthInvoiceAmts?${queryParams}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log("Current Month Invoice Amount response(BusinessCentralAPI.js):", response);

        if (response.data && response.data.value && response.data.value.length > 0) {
            return { success: true, data: response.data.value[0] };
        } else {
            return { success: false, error: 'No invoice amount data found' };
        }
    } catch (error) {
        console.error('Error fetching current month invoice amount(BusinessCentralAPI.js):', error);
        return {
            success: false,
            error: error.response?.data?.error?.message || error.response?.data?.details || 'Failed to fetch current month invoice amount',
        };
    }
};


export const getOverdueInvoiceAmount = async (customerNo, dueDate) => {
    try {
        let filterQuery = `customer_No_Filter_FilterOnly eq '${customerNo}' and due_Date_Filter_FilterOnly le ${dueDate}`;
        // const encodedFilter = encodeURIComponent(filterQuery);
        let queryParams = `$filter=${filterQuery}`;

        // console.log('Overdue Invoice API URL:', `${BACKEND_URL}${BASE_API_URL}/alletec/app/v2.0/companies(${COMPANY_ID})/CustOverdueInvoiceAmts?${queryParams}`);

        const response = await axios.get(
            `${BACKEND_URL}${BASE_API_URL}/alletec/app/v2.0/companies(${COMPANY_ID})/CustOverdueInvoiceAmts?${queryParams}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log("Overdue Invoice Amount response(BusinessCentralAPI.js):", response);

        if (response.data && response.data.value && response.data.value.length > 0) {
            return { success: true, data: response.data.value[0] };
        } else {
            return { success: false, error: 'No overdue invoice amount data found' };
        }
    } catch (error) {
        console.error('Error fetching overdue invoice amount(BusinessCentralAPI.js):', error);
        return {
            success: false,
            error: error.response?.data?.error?.message || error.response?.data?.details || 'Failed to fetch overdue invoice amount',
        };
    }
};
