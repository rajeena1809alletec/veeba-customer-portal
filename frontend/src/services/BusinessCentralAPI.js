import axios from "axios";

// const BACKEND_URL = "http://localhost:5000";
const BACKEND_URL = "https://veeba-customer-portal-backend.onrender.com"
const BASE_API_URL = "/api";
const COMPANY_ID = "47a86198-daf0-ee11-a1fd-6045bd722f50";

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
        // console.log("getCustomerLedgerEntries API: ", `${BACKEND_URL}${BASE_API_URL}/alletec/app/v2.0/companies(${COMPANY_ID})/customerLedgerEntries?${queryParams}`);

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

export const getInvoicedValueAmount = async (customerNo, dateFrom, dateTo) => {
    try {
        let filterQuery = `customer_No_Filter_FilterOnly eq '${customerNo}' and posting_Date_Filter_FilterOnly ge ${dateFrom} and posting_Date_Filter_FilterOnly le ${dateTo}`;
        let queryParams = `$filter=${filterQuery}`;

        // console.log('Invoiced Value Amount API URL:', `${BACKEND_URL}${BASE_API_URL}/alletec/app/v2.0/companies(${COMPANY_ID})/CustInvoicedValueAmts?${queryParams}`);


        const response = await axios.get(
            `${BACKEND_URL}${BASE_API_URL}/alletec/app/v2.0/companies(${COMPANY_ID})/CustInvoicedValueAmts?${queryParams}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log("Cust Invoiced Value Amount response(BusinessCentralAPI.js):", response);

        if (response.data && response.data.value && response.data.value.length > 0) {
            return { success: true, data: response.data.value[0] };
        } else {
            return { success: false, error: 'No invoiced value amount data found' };
        }
    } catch (error) {
        console.error('Error fetching cust invoiced value amount(BusinessCentralAPI.js):', error);
        return {
            success: false,
            error: error.response?.data?.error?.message || error.response?.data?.details || 'Failed to fetch cust invoiced value amount',
        };
    }
};

export const getPaymentValueAmount = async (customerNo, dateFrom, dateTo) => {
    try {
        let filterQuery = `customer_No_Filter_FilterOnly eq '${customerNo}' and posting_Date_Filter_FilterOnly ge ${dateFrom} and posting_Date_Filter_FilterOnly le ${dateTo}`;
        let queryParams = `$filter=${filterQuery}`;

        // console.log('Payment Value Amount API URL:', `${BACKEND_URL}${BASE_API_URL}/alletec/app/v2.0/companies(${COMPANY_ID})/CustPaymentValueAmts?${queryParams}`);


        const response = await axios.get(
            `${BACKEND_URL}${BASE_API_URL}/alletec/app/v2.0/companies(${COMPANY_ID})/CustPaymentValueAmts?${queryParams}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log("Cust Payment Value Amount response(BusinessCentralAPI.js):", response);

        if (response.data && response.data.value && response.data.value.length > 0) {
            return { success: true, data: response.data.value[0] };
        } else {
            return { success: false, error: 'No payment value amount data found' };
        }
    } catch (error) {
        console.error('Error fetching cust payment value amount(BusinessCentralAPI.js):', error);
        return {
            success: false,
            error: error.response?.data?.error?.message || error.response?.data?.details || 'Failed to fetch cust payment value amount',
        };
    }
};


export const getDispatchDetails = async (customerNo) => {
    try {
        let filterQuery = `sellToCustomerNo eq '${customerNo}'`;

        let queryParams = `$filter=${filterQuery}`;
        console.log('Dispatch Details URL:', `${BACKEND_URL}${BASE_API_URL}/alletec/app/v2.0/companies(${COMPANY_ID})/dispatchdetails?${queryParams}`);
        const response = await axios.get(
            `${BACKEND_URL}${BASE_API_URL}/alletec/app/v2.0/companies(${COMPANY_ID})/dispatchdetails?${queryParams}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        console.log("Dispatch Details response(BusinessCentralAPI.js):", response);

        if (response.data && response.data.value && response.data.value.length > 0) {
            return { success: true, data: response.data.value };
        } else {
            return { success: true, data: [] };
        }
    } catch (error) {
        console.error('Error fetching dispatch details(BusinessCentralAPI.js):', error);
        return {
            success: false,
            error: error.response?.data?.details || 'Failed to fetch dispatch details',
        };
    }
};

export const getOpenOrderValue = async (customerNo) => {
    try {
        let filterQuery = `sell_to_Customer_No_Filter_FilterOnly eq '${customerNo}'`;
        let queryParams = `$filter=${filterQuery}`;

        console.log('Open Order Value API URL:', `${BACKEND_URL}${BASE_API_URL}/alletec/app/v2.0/companies(${COMPANY_ID})/OpenOrderValues?${queryParams}`);

        const response = await axios.get(
            `${BACKEND_URL}${BASE_API_URL}/alletec/app/v2.0/companies(${COMPANY_ID})/OpenOrderValues?${queryParams}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log("Open Order Value response(BusinessCentralAPI.js):", response);

        if (response.data && response.data.value && response.data.value.length > 0) {
            return { success: true, data: response.data.value[0] };
        } else {
            return { success: false, error: 'No open order value data found' };
        }
    } catch (error) {
        console.error('Error fetching open order value(BusinessCentralAPI.js):', error);
        return {
            success: false,
            error: error.response?.data?.error?.message || error.response?.data?.details || 'Failed to fetch open order value',
        };
    }
};

export const getBlockedOrderValue = async (customerNo) => {
    try {
        let filterQuery = `no_Filter_FilterOnly eq '${customerNo}'`;
        let queryParams = `$filter=${filterQuery}`;
        console.log('Blocked Order Value API URL:', `${BACKEND_URL}${BASE_API_URL}/alletec/app/v2.0/companies(${COMPANY_ID})/BlockOrderValues?${queryParams}`);
        const response = await axios.get(
            `${BACKEND_URL}${BASE_API_URL}/alletec/app/v2.0/companies(${COMPANY_ID})/BlockOrderValues?${queryParams}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log("Blocked Order Value response(BusinessCentralAPI.js):", response);

        if (response.data && response.data.value && response.data.value.length > 0) {
            return { success: true, data: response.data.value[0] };
        } else {
            return { success: false, error: 'No blocked order value data found' };
        }
    } catch (error) {
        console.error('Error fetching blocked order value(BusinessCentralAPI.js):', error);
        return {
            success: false,
            error: error.response?.data?.error?.message || error.response?.data?.details || 'Failed to fetch blocked order value',
        };
    }
};