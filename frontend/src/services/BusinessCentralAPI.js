import axios from "axios";

const BACKEND_URL = "http://localhost:5000";
// const BACKEND_URL = "https://veeba-customer-portal-backend.onrender.com"
const BASE_API_URL = "/api";

// const COMPANY_ID = '2d90f615-1d92-f011-b41a-6045bde7bf1a';    //Alletec
const COMPANY_ID = "47a86198-daf0-ee11-a1fd-6045bd722f50";   //VEEBA

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
                data: response.data.value[0]
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

        console.log("Customer by Customer Id URL: ", `${BACKEND_URL}${BASE_API_URL}/alletec/app/v2.0/companies(${COMPANY_ID})/customer?${queryParams}`);

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
        // if (filters.documentType) {
        //     filterQuery += ` and documentType eq '${filters.documentType}'`;
        // }
        filterQuery += ` and documentType ne 0`;
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
        console.log("getCustomerLedgerEntries API: ", `${BACKEND_URL}${BASE_API_URL}/alletec/app/v2.0/companies(${COMPANY_ID})/customerLedgerEntries?${queryParams}`);

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

        console.log('Current Month Invoice API URL:', `${BACKEND_URL}${BASE_API_URL}/alletec/app/v2.0/companies(${COMPANY_ID})/CustCurrentMonthInvoiceAmts?${queryParams}`);

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

        console.log('Overdue Invoice API URL:', `${BACKEND_URL}${BASE_API_URL}/alletec/app/v2.0/companies(${COMPANY_ID})/CustOverdueInvoiceAmts?${queryParams}`);

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

        console.log('Invoiced Value Amount API URL:', `${BACKEND_URL}${BASE_API_URL}/alletec/app/v2.0/companies(${COMPANY_ID})/CustInvoicedValueAmts?${queryParams}`);


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

        console.log('Payment Value Amount API URL:', `${BACKEND_URL}${BASE_API_URL}/alletec/app/v2.0/companies(${COMPANY_ID})/CustPaymentValueAmts?${queryParams}`);


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


export const getDispatchDetails = async (customerNo, postingDateFrom, postingDateTo) => {
    try {
        let filterQuery = `sellToCustomerNo eq '${customerNo}'`;
        if (postingDateFrom && postingDateTo) {
            filterQuery += ` and postingDate ge ${postingDateFrom} and postingDate le ${postingDateTo}`;
        } else if (postingDateFrom) {
            filterQuery += ` and postingDate ge ${postingDateFrom}`;
        } else if (postingDateTo) {
            filterQuery += ` and postingDate le ${postingDateTo}`;
        }

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
        let filterQuery = `no_Filter_FilterOnly eq '${customerNo}'`;
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

export const loginSalesperson = async (code, credentials) => {
    console.log("Salesperson login attempt for code:", code);

    try {
        const response = await axios.get(
            `${BACKEND_URL}${BASE_API_URL}/alletec/app/v2.0/companies(${COMPANY_ID})/salespersonPurchaserLogins?$filter=code eq '${code}' and credentials eq '${credentials}'`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log("Salesperson login response(BusinessCentralAPI.js):", response);

        if (response.data && response.data.value && response.data.value.length > 0) {
            return {
                success: true,
                data: response.data.value[0]
            };
        } else {
            return {
                success: false,
                error: `Salesperson with code: ${code} does not exist`
            };
        }
    } catch (error) {
        console.error('Salesperson login error(BusinessCentralAPI.js):', error);
        return {
            success: false,
            error: error.response?.data?.details || 'Login failed. Please try again.',
        };
    }
};

export const getCustomersFromSalespersonCode = async (salespersonCode) => {
    console.log("Fetching customers for salesperson code:", salespersonCode);

    try {
        const response = await axios.get(
            `${BACKEND_URL}${BASE_API_URL}/alletec/app/v2.0/companies(${COMPANY_ID})/customerSalespersonCode?$filter=salespersonCode eq '${salespersonCode}'`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        console.log("Customers for salesperson(BusinessCentralAPI.js):", response);

        return {
            success: true,
            data: response.data.value || []
        };
    } catch (error) {
        console.error('Error fetching customers for salesperson(BusinessCentralAPI.js):', error);
        return {
            success: false,
            error: error.response?.data?.details || error.message,
        };
    }
};

export const getCustomersByNoList = async (customersForSalesperson, filters = {}) => {
    try {
        // Split pipe-separated string into individual customer nos
        const customerNos = customersForSalesperson.split('|').map(c => c.trim()).filter(Boolean);

        if (customerNos.length === 0) {
            return { success: false, error: 'No customer numbers provided' };
        }

        let filterQuery = customerNos
            .map(no => `no eq '${no}'`)
            .join(' or ');

        if (filters.dateFilterFrom && filters.dateFilterTo) {
            filterQuery += `&dateFilter eq '${filters.dateFilterFrom}..${filters.dateFilterTo}'`;
        }

        const queryParams = `$filter=${filterQuery}`;

        console.log('getCustomersByNoList URL: ', `${BACKEND_URL}${BASE_API_URL}/alletec/app/v2.0/companies(${COMPANY_ID})/customer?${queryParams}`);

        const response = await axios.get(
            `${BACKEND_URL}${BASE_API_URL}/alletec/app/v2.0/companies(${COMPANY_ID})/customer?${queryParams}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log("Customers by No. list response(BusinessCentralAPI.js):", response);

        if (response.data && response.data.value && response.data.value.length > 0) {
            return { success: true, data: response.data.value };  // returns array
        } else {
            return { success: false, error: 'No customers found' };
        }
    } catch (error) {
        console.error('Error fetching customers by No. list(BusinessCentralAPI.js):', error);
        return {
            success: false,
            error: error.response?.data?.details || 'Failed to fetch customers',
        };
    }
};

export const getSPCurrentMonthInvoiceAmount = async (salespersonCode, dateFrom, dateTo) => {
    try {
        const codes = salespersonCode.split('|').map(c => c.trim()).filter(Boolean);
        const codeFilter = codes.map(code => `salesperson_Code_Filter_FilterOnly eq '${code}'`).join(' or ');
        let filterQuery = `(${codeFilter}) and posting_Date_Filter_FilterOnly ge ${dateFrom} and posting_Date_Filter_FilterOnly le ${dateTo}`;
        // let filterQuery = `salesperson_Code_Filter_FilterOnly eq '${salespersonCode}' and posting_Date_Filter_FilterOnly ge ${dateFrom} and posting_Date_Filter_FilterOnly le ${dateTo}`;
        let queryParams = `$filter=${filterQuery}`;

        console.log(
            'SP Current Month Invoice API URL:',
            `${BACKEND_URL}${BASE_API_URL}/alletec/app/v2.0/companies(${COMPANY_ID})/SPCustCurrentMonthInvoiceAmts?${queryParams}`
        );

        const response = await axios.get(
            `${BACKEND_URL}${BASE_API_URL}/alletec/app/v2.0/companies(${COMPANY_ID})/SPCustCurrentMonthInvoiceAmts?${queryParams}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log("SP Current Month Invoice Amount response(BusinessCentralAPI.js):", response);

        if (response.data && response.data.value && response.data.value.length > 0) {
            return { success: true, data: response.data.value[0] };
        } else {
            return { success: false, error: 'No current month invoice amount data found' };
        }
    } catch (error) {
        console.error('Error fetching SP current month invoice amount(BusinessCentralAPI.js):', error);
        return {
            success: false,
            error: error.response?.data?.error?.message || error.response?.data?.details || 'Failed to fetch SP current month invoice amount',
        };
    }
};


export const getSPOverdueInvoiceAmount = async (salespersonCode, dueDate) => {
    try {
        const codes = salespersonCode.split('|').map(c => c.trim()).filter(Boolean);
        const codeFilter = codes.map(code => `salesperson_Code_Filter_FilterOnly eq '${code}'`).join(' or ');
        let filterQuery = `(${codeFilter}) and due_Date_Filter_FilterOnly le ${dueDate}`;
        // let filterQuery = `salesperson_Code_Filter_FilterOnly eq '${salespersonCode}' and due_Date_Filter_FilterOnly le ${dueDate}`;
        let queryParams = `$filter=${filterQuery}`;

        console.log(
            'SP Overdue Invoice API URL:',
            `${BACKEND_URL}${BASE_API_URL}/alletec/app/v2.0/companies(${COMPANY_ID})/SPCustOverdueInvoiceAmts?${queryParams}`
        );

        const response = await axios.get(
            `${BACKEND_URL}${BASE_API_URL}/alletec/app/v2.0/companies(${COMPANY_ID})/SPCustOverdueInvoiceAmts?${queryParams}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log("SP Overdue Invoice Amount response(BusinessCentralAPI.js):", response);

        if (response.data && response.data.value && response.data.value.length > 0) {
            return { success: true, data: response.data.value[0] };
        } else {
            return { success: false, error: 'No overdue invoice amount data found' };
        }
    } catch (error) {
        console.error('Error fetching SP overdue invoice amount(BusinessCentralAPI.js):', error);
        return {
            success: false,
            error: error.response?.data?.error?.message || error.response?.data?.details || 'Failed to fetch SP overdue invoice amount',
        };
    }
};


export const getSPInvoicedValueAmount = async (salespersonCode, dateFrom, dateTo) => {
    try {
        const codes = salespersonCode.split('|').map(c => c.trim()).filter(Boolean);
        const codeFilter = codes.map(code => `salesperson_Code_Filter_FilterOnly eq '${code}'`).join(' or ');
        let filterQuery = `(${codeFilter}) and posting_Date_Filter_FilterOnly ge ${dateFrom} and posting_Date_Filter_FilterOnly le ${dateTo}`;
        // let filterQuery = `salesperson_Code_Filter_FilterOnly eq '${salespersonCode}' and posting_Date_Filter_FilterOnly ge ${dateFrom} and posting_Date_Filter_FilterOnly le ${dateTo}`;
        let queryParams = `$filter=${filterQuery}`;

        console.log(
            'SP Invoiced Value Amount API URL:',
            `${BACKEND_URL}${BASE_API_URL}/alletec/app/v2.0/companies(${COMPANY_ID})/SPCustInvoicedValueAmts?${queryParams}`
        );

        const response = await axios.get(
            `${BACKEND_URL}${BASE_API_URL}/alletec/app/v2.0/companies(${COMPANY_ID})/SPCustInvoicedValueAmts?${queryParams}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log("SP Invoiced Value Amount response(BusinessCentralAPI.js):", response);

        if (response.data && response.data.value && response.data.value.length > 0) {
            return { success: true, data: response.data.value[0] };
        } else {
            return { success: false, error: 'No invoiced value amount data found' };
        }
    } catch (error) {
        console.error('Error fetching SP invoiced value amount(BusinessCentralAPI.js):', error);
        return {
            success: false,
            error: error.response?.data?.error?.message || error.response?.data?.details || 'Failed to fetch SP invoiced value amount',
        };
    }
};


export const getSPPaymentValueAmount = async (salespersonCode, dateFrom, dateTo) => {
    try {
        const codes = salespersonCode.split('|').map(c => c.trim()).filter(Boolean);
        const codeFilter = codes.map(code => `salesperson_Code_Filter_FilterOnly eq '${code}'`).join(' or ');
        let filterQuery = `(${codeFilter}) and posting_Date_Filter_FilterOnly ge ${dateFrom} and posting_Date_Filter_FilterOnly le ${dateTo}`;
        // let filterQuery = `salesperson_Code_Filter_FilterOnly eq '${salespersonCode}' and posting_Date_Filter_FilterOnly ge ${dateFrom} and posting_Date_Filter_FilterOnly le ${dateTo}`;
        let queryParams = `$filter=${filterQuery}`;

        console.log(
            'SP Payment Value Amount API URL:',
            `${BACKEND_URL}${BASE_API_URL}/alletec/app/v2.0/companies(${COMPANY_ID})/SPCustPaymentValueAmts?${queryParams}`
        );

        const response = await axios.get(
            `${BACKEND_URL}${BASE_API_URL}/alletec/app/v2.0/companies(${COMPANY_ID})/SPCustPaymentValueAmts?${queryParams}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log("SP Payment Value Amount response(BusinessCentralAPI.js):", response);

        if (response.data && response.data.value && response.data.value.length > 0) {
            return { success: true, data: response.data.value[0] };
        } else {
            return { success: false, error: 'No payment value amount data found' };
        }
    } catch (error) {
        console.error('Error fetching SP payment value amount(BusinessCentralAPI.js):', error);
        return {
            success: false,
            error: error.response?.data?.error?.message || error.response?.data?.details || 'Failed to fetch SP payment value amount',
        };
    }
};


export const getSPOpenOrderValue = async (salespersonCode) => {
    try {
        const codes = salespersonCode.split('|').map(c => c.trim()).filter(Boolean);
        const codeFilter = codes.map(code => `code_Filter_FilterOnly eq '${code}'`).join(' or ');
        let filterQuery = `(${codeFilter})`;
        // let filterQuery = `code_Filter_FilterOnly eq '${salespersonCode}'`;
        let queryParams = `$filter=${filterQuery}`;

        console.log(
            'SP Open Order Value API URL:',
            `${BACKEND_URL}${BASE_API_URL}/alletec/app/v2.0/companies(${COMPANY_ID})/SPOpenOrderValues?${queryParams}`
        );

        const response = await axios.get(
            `${BACKEND_URL}${BASE_API_URL}/alletec/app/v2.0/companies(${COMPANY_ID})/SPOpenOrderValues?${queryParams}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log("SP Open Order Value response(BusinessCentralAPI.js):", response);

        if (response.data && response.data.value && response.data.value.length > 0) {
            return { success: true, data: response.data.value[0] };
        } else {
            return { success: false, error: 'No open order value data found' };
        }
    } catch (error) {
        console.error('Error fetching SP open order value(BusinessCentralAPI.js):', error);
        return {
            success: false,
            error: error.response?.data?.error?.message || error.response?.data?.details || 'Failed to fetch SP open order value',
        };
    }
};


export const getSPBlockedOrderValue = async (salespersonCode) => {
    try {
        const codes = salespersonCode.split('|').map(c => c.trim()).filter(Boolean);
        const codeFilter = codes.map(code => `code_Filter_FilterOnly eq '${code}'`).join(' or ');
        let filterQuery = `(${codeFilter})`;
        // let filterQuery = `code_Filter_FilterOnly eq '${salespersonCode}'`;
        let queryParams = `$filter=${filterQuery}`;

        console.log(
            'SP Blocked Order Value API URL:',
            `${BACKEND_URL}${BASE_API_URL}/alletec/app/v2.0/companies(${COMPANY_ID})/SPBlockOrderValues?${queryParams}`
        );

        const response = await axios.get(
            `${BACKEND_URL}${BASE_API_URL}/alletec/app/v2.0/companies(${COMPANY_ID})/SPBlockOrderValues?${queryParams}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log("SP Blocked Order Value response(BusinessCentralAPI.js):", response);

        if (response.data && response.data.value && response.data.value.length > 0) {
            return { success: true, data: response.data.value[0] };
        } else {
            return { success: false, error: 'No blocked order value data found' };
        }
    } catch (error) {
        console.error('Error fetching SP blocked order value(BusinessCentralAPI.js):', error);
        return {
            success: false,
            error: error.response?.data?.error?.message || error.response?.data?.details || 'Failed to fetch SP blocked order value',
        };
    }
};

export const getSPLedgerEntries = async (customersForSalesperson, filters = {}) => {
    console.log("Fetching ledger entries for SP customers:", customersForSalesperson);

    try {
        const customerNos = customersForSalesperson.split('|').map(c => c.trim()).filter(Boolean);

        if (customerNos.length === 0) {
            return { success: false, error: 'No customer numbers provided' };
        }

        const customerFilter = customerNos.map(no => `customerNo eq '${no}'`).join(' or ');

        // Wrap in parentheses so AND conditions don't break OR logic
        let filterQuery = `(${customerFilter})`;

        if (filters.open !== undefined) {
            filterQuery += ` and open eq ${filters.open}`;
        }
        filterQuery += ` and documentType ne 0`;
        if (filters.documentType) {
            filterQuery += ` and documentType eq '${filters.documentType}'`;
        }
        if (filters.postingDateFrom) {
            filterQuery += ` and postingDate ge ${filters.postingDateFrom}`;
        }
        if (filters.postingDateTo) {
            filterQuery += ` and postingDate le ${filters.postingDateTo}`;
        }

        // let queryParams = `$filter=${encodeURIComponent(filterQuery)}`;
        let queryParams = `$filter=${filterQuery}`;

        if (filters.orderBy) {
            queryParams += `&$orderby=${filters.orderBy}`;
        }
        if (filters.top) {
            queryParams += `&$top=${filters.top}`;
        }
        queryParams += '&$expand=customer($expand=salesperson($expand=salespersonsHierarchyNSM,salespersonsHierarchyRSM,salespersonsHierarchyZSM,salespersonsHierarchyASM,salespersonsHierarchyASO,salespersonsHierarchyVP))';


        console.log('getSPLedgerEntries URL: ', `${BACKEND_URL}${BASE_API_URL}/alletec/app/v2.0/companies(${COMPANY_ID})/customerLedgerEntries?${queryParams}`);

        const response = await axios.get(
            `${BACKEND_URL}${BASE_API_URL}/alletec/app/v2.0/companies(${COMPANY_ID})/customerLedgerEntries?${queryParams}`,
            {
                headers: { 'Content-Type': 'application/json' },
            }
        );

        console.log("getSPLedgerEntries response:", response);

        if (response.data && response.data.value) {
            return { success: true, data: response.data.value };
        } else {
            return { success: false, error: 'No ledger entries found' };
        }
    } catch (error) {
        console.error('Error fetching SP ledger entries:', error);
        return {
            success: false,
            error: error.response?.data?.details || 'Failed to fetch SP ledger entries',
        };
    }
};

export const getSPDispatchDetails = async (customersForSalesperson, postingDateFrom, postingDateTo) => {
    console.log('Fetching dispatch details for SP customers:', customersForSalesperson, 'postingDateFrom:', postingDateFrom, 'postingDateTo:', postingDateTo);

    try {
        const customerNos = customersForSalesperson.split('|').map(c => c.trim()).filter(Boolean);

        if (customerNos.length === 0) {
            return { success: true, data: [] };
        }
        const customerFilter = customerNos.map(no => `sellToCustomerNo eq '${no}'`).join(' or ');
        let filterQuery = `(${customerFilter})`;
        if (postingDateFrom && postingDateTo) {
            filterQuery += ` and postingDate ge ${postingDateFrom} and postingDate le ${postingDateTo}`;
        } else if (postingDateFrom) {
            filterQuery += ` and postingDate ge ${postingDateFrom}`;
        } else if (postingDateTo) {
            filterQuery += ` and postingDate le ${postingDateTo}`;
        }

        const queryParams = `$filter=${filterQuery}&$expand=customer($expand=salesperson($expand=salespersonsHierarchyNSM,salespersonsHierarchyRSM,salespersonsHierarchyZSM,salespersonsHierarchyASM,salespersonsHierarchyASO,salespersonsHierarchyVP))`;
        console.log('SP Dispatch Details URL:', `${BACKEND_URL}${BASE_API_URL}/alletec/app/v2.0/companies(${COMPANY_ID})/dispatchdetails?${queryParams}`);

        const response = await axios.get(
            `${BACKEND_URL}${BASE_API_URL}/alletec/app/v2.0/companies(${COMPANY_ID})/dispatchdetails?${queryParams}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log("SP Dispatch Details response(BusinessCentralAPI.js):", response);

        if (response.data && response.data.value && response.data.value.length > 0) {
            return { success: true, data: response.data.value };
        } else {
            return { success: true, data: [] };
        }
    } catch (error) {
        console.error('Error fetching SP dispatch details(BusinessCentralAPI.js):', error);
        return {
            success: false,
            error: error.response?.data?.details || 'Failed to fetch SP dispatch details',
        };
    }
};

export const getAllASOSalespersons = async (levelField, loggedInCode) => {
    console.log("Fetching ASO salespersons for:", levelField, loggedInCode);

    try {
        const filterQuery = `level eq 'ASO' and ${levelField} eq '${loggedInCode}'`;
        const queryParams = `$filter=${filterQuery}`;
        console.log('getAllASOSalespersons URL:', `${BACKEND_URL}${BASE_API_URL}/alletec/app/v2.0/companies(${COMPANY_ID})/asoSalespersons?${queryParams}`);

        const response = await axios.get(
            `${BACKEND_URL}${BASE_API_URL}/alletec/app/v2.0/companies(${COMPANY_ID})/asoSalespersons?${queryParams}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log("getAllASOSalespersons response(BusinessCentralAPI.js):", response);

        if (response.data && response.data.value && response.data.value.length > 0) {
            return { success: true, data: response.data.value };
        } else {
            return { success: true, data: [] };
        }
    } catch (error) {
        console.error('Error fetching ASO salespersons(BusinessCentralAPI.js):', error);
        return {
            success: false,
            error: error.response?.data?.details || 'Failed to fetch ASO salespersons',
        };
    }
};

export const getCustomersForMultipleSalespersons = async (asoCodes) => {
    console.log("Fetching customers for multiple salespersons:", asoCodes);

    try {
        const spCodes = asoCodes.split('|').map(c => c.trim()).filter(Boolean);

        if (spCodes.length === 0) {
            return { success: true, data: [] };
        }

        const spFilter = spCodes.map(code => `salespersonCode eq '${code}'`).join(' or ');
        const filterQuery = `(${spFilter})`;
        const queryParams = `$filter=${filterQuery}`;
        console.log('getCustomersForMultipleSalespersons URL:', `${BACKEND_URL}${BASE_API_URL}/alletec/app/v2.0/companies(${COMPANY_ID})/customerSalespersonCode?${queryParams}`);

        const response = await axios.get(
            `${BACKEND_URL}${BASE_API_URL}/alletec/app/v2.0/companies(${COMPANY_ID})/customerSalespersonCode?${queryParams}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log("getCustomersForMultipleSalespersons response(BusinessCentralAPI.js):", response);

        if (response.data && response.data.value && response.data.value.length > 0) {
            return { success: true, data: response.data.value };
        } else {
            return { success: true, data: [] };
        }
    } catch (error) {
        console.error('Error fetching customers for multiple salespersons(BusinessCentralAPI.js):', error);
        return {
            success: false,
            error: error.response?.data?.details || 'Failed to fetch customers for salespersons',
        };
    }
};
export const getSalesOrder = async (customerNo, postingDateFrom, postingDateTo) => {
    try {
        let filterQuery = `sellToCustomerNo eq '${customerNo}' and documentType eq 'Order' and shortCloseSO eq false`;

        if (postingDateFrom && postingDateTo) {
            filterQuery += ` and postingDate ge ${postingDateFrom} and postingDate le ${postingDateTo}`;
        } else if (postingDateFrom) {
            filterQuery += ` and postingDate ge ${postingDateFrom}`;
        } else if (postingDateTo) {
            filterQuery += ` and postingDate le ${postingDateTo}`;
        }
        let queryParams = `$filter=${filterQuery}`;

        console.log('getSalesOrder URL:', `${BACKEND_URL}${BASE_API_URL}/alletec/app/v2.0/companies(${COMPANY_ID})/customerOrders?${queryParams}`);

        const response = await axios.get(
            `${BACKEND_URL}${BASE_API_URL}/alletec/app/v2.0/companies(${COMPANY_ID})/customerOrders?${queryParams}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        console.log("getSalesOrder response(BusinessCentralAPI.js):", response);

        if (response.data && response.data.value && response.data.value.length > 0) {
            return { success: true, data: response.data.value };
        } else {
            return { success: true, data: [] };
        }
    } catch (error) {
        console.error('Error fetching sales orders(BusinessCentralAPI.js):', error);
        return {
            success: false,
            error: error.response?.data?.details || 'Failed to fetch sales orders',
        };
    }
};

export const getSPSalesOrder = async (customersForSalesperson, postingDateFrom, postingDateTo) => {
    console.log("Fetching sales orders for SP customers:", customersForSalesperson);

    try {
        const customerNos = customersForSalesperson.split('|').map(c => c.trim()).filter(Boolean);

        if (customerNos.length === 0) {
            return { success: false, error: 'No customer numbers provided' };
        }

        const customerFilter = customerNos.map(no => `sellToCustomerNo eq '${no}'`).join(' or ');

        let filterQuery = `(${customerFilter}) and documentType eq 'Order' and shortCloseSO eq false`;

        if (postingDateFrom && postingDateTo) {
            filterQuery += ` and postingDate ge ${postingDateFrom} and postingDate le ${postingDateTo}`;
        } else if (postingDateFrom) {
            filterQuery += ` and postingDate ge ${postingDateFrom}`;
        } else if (postingDateTo) {
            filterQuery += ` and postingDate le ${postingDateTo}`;
        }

        // let queryParams = `$filter=${filterQuery}`;
        let queryParams = `$filter=${filterQuery}&$expand=customer($expand=salesperson($expand=salespersonsHierarchyNSM,salespersonsHierarchyRSM,salespersonsHierarchyZSM,salespersonsHierarchyASM,salespersonsHierarchyASO,salespersonsHierarchyVP))`;


        console.log(
            'getSPSalesOrder URL:',
            `${BACKEND_URL}${BASE_API_URL}/alletec/app/v2.0/companies(${COMPANY_ID})/customerOrders?${queryParams}`
        );

        const response = await axios.get(
            `${BACKEND_URL}${BASE_API_URL}/alletec/app/v2.0/companies(${COMPANY_ID})/customerOrders?${queryParams}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log("getSPSalesOrder response(BusinessCentralAPI.js):", response);

        if (response.data && response.data.value) {
            return { success: true, data: response.data.value };
        } else {
            return { success: true, data: [] };
        }
    } catch (error) {
        console.error('Error fetching SP sales orders(BusinessCentralAPI.js):', error);
        return {
            success: false,
            error: error.response?.data?.details || 'Failed to fetch SP sales orders',
        };
    }
};

export const getSalesOrderFromDocNo = async (documentNo, documentType) => {
    try {
        if (!documentNo || !documentType) {
            return { success: false, error: 'Document No and Document Type are required' };
        }

        const filterQuery = `no eq '${documentNo}' and documentType eq '${documentType}'`;
        const queryParams = `$filter=${filterQuery}&$expand=customerOrdersLines,dispatchdetails`;
        console.log('getSPSalesOrder URL:', `${BACKEND_URL}${BASE_API_URL}/alletec/app/v2.0/companies(${COMPANY_ID})/customerOrders?${queryParams}`);

        const response = await axios.get(
            `${BACKEND_URL}${BASE_API_URL}/alletec/app/v2.0/companies(${COMPANY_ID})/customerOrders?${queryParams}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log("getSalesOrderFromDocNo response(BusinessCentralAPI.js):", response);
        if (response.data && response.data.value && response.data.value.length > 0) {
            return { success: true, data: response.data.value[0] };
        } else {
            return { success: false, error: 'Sales order not found' };
        }
    } catch (error) {
        console.error('Error fetching sales order by document no:', error);
        return {
            success: false,
            error: error.response?.data?.error?.message || 'Failed to fetch sales order details',
        };
    }
};

export const getDispatchDetailsFromDocNo = async (documentNo) => {
    try {
        if (!documentNo) {
            return { success: false, error: 'Document No is required' };
        }

        const filterQuery = `no eq '${documentNo}'`;
        const queryParams = `$filter=${filterQuery}&$expand=dispatchDetailsLines`;
        console.log('getDispatchDetailsFromDocNo URL:', `${BACKEND_URL}${BASE_API_URL}/alletec/app/v2.0/companies(${COMPANY_ID})/dispatchdetails?${queryParams}`);

        const response = await axios.get(
            `${BACKEND_URL}${BASE_API_URL}/alletec/app/v2.0/companies(${COMPANY_ID})/dispatchdetails?${queryParams}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log('getDispatchDetailsFromDocNo response(BusinessCentralAPI.js):', response);

        if (response.data && response.data.value && response.data.value.length > 0) {
            return { success: true, data: response.data.value[0] };
        } else {
            return { success: false, error: 'Dispatch details not found' };
        }
    } catch (error) {
        console.error('Error fetching dispatch details by document no:', error);
        return {
            success: false,
            error: error.response?.data?.error?.message || 'Failed to fetch dispatch details',
        };
    }
};

export const getSPPendingInvoiceAmount = async (salespersonCode) => {
    try {
        const codes = salespersonCode.split('|').map(c => c.trim()).filter(Boolean);
        const codeFilter = codes.map(code => `salesperson_Code_Filter_FilterOnly eq '${code}'`).join(' or ');

        const filterQuery = `(${codeFilter})`;
        const queryParams = `$filter=${filterQuery}`;

        console.log('getSPPendingInvoiceAmount:', `${BACKEND_URL}${BASE_API_URL}/alletec/app/v2.0/companies(${COMPANY_ID})/SPCustPendingInvoiceAmts?${queryParams}`);

        const response = await axios.get(
            `${BACKEND_URL}${BASE_API_URL}/alletec/app/v2.0/companies(${COMPANY_ID})/SPCustPendingInvoiceAmts?${queryParams}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log('getSPPendingInvoiceAmount response(BusinessCentralAPI.js):', response);

        if (response.data && response.data.value && response.data.value.length > 0) {
            return { success: true, data: response.data.value[0] };
        } else {
            return { success: false, error: 'No pending invoice amount data found' };
        }
    } catch (error) {
        console.error('Error fetching SP pending invoice amount(BusinessCentralAPI.js):', error);
        return {
            success: false,
            error:
                error.response?.data?.error?.message ||
                error.response?.data?.details ||
                'Failed to fetch SP pending invoice amount',
        };
    }
};

export const getPendingInvoiceAmount = async (customerNo) => {
    try {
        let filterQuery = `customer_No_Filter_FilterOnly eq '${customerNo}'`;
        let queryParams = `$filter=${filterQuery}`;

        console.log('Pending Invoice API URL:', `${BACKEND_URL}${BASE_API_URL}/alletec/app/v2.0/companies(${COMPANY_ID})/CustPendingInvoiceAmts?${queryParams}`);

        const response = await axios.get(
            `${BACKEND_URL}${BASE_API_URL}/alletec/app/v2.0/companies(${COMPANY_ID})/CustPendingInvoiceAmts?${queryParams}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        console.log("Pending Invoice Amount response(BusinessCentralAPI.js):", response);

        if (response.data && response.data.value && response.data.value.length > 0) {
            return { success: true, data: response.data.value[0] };
        } else {
            return { success: false, error: 'No pending invoice amount data found' };
        }
    } catch (error) {
        console.error('Error fetching pending invoice amount(BusinessCentralAPI.js):', error);
        return {
            success: false,
            error: error.response?.data?.error?.message || error.response?.data?.details || 'Failed to fetch pending invoice amount',
        };
    }
};

export const getCustomersByNoListExpanded = async (customersForSalesperson, filters = {}) => {
    try {
        // Split pipe-separated string into individual customer nos
        const customerNos = customersForSalesperson.split('|').map(c => c.trim()).filter(Boolean);

        if (customerNos.length === 0) {
            return { success: false, error: 'No customer numbers provided' };
        }

        let filterQuery = customerNos
            .map(no => `no eq '${no}'`)
            .join(' or ');

        if (filters.dateFilterFrom && filters.dateFilterTo) {
            filterQuery += `&dateFilter eq '${filters.dateFilterFrom}..${filters.dateFilterTo}'`;
        }

        const queryParams = `$filter=${filterQuery}&$expand=salesperson($expand=salespersonsHierarchyNSM,salespersonsHierarchyRSM,salespersonsHierarchyZSM,salespersonsHierarchyASM,salespersonsHierarchyASO,salespersonsHierarchyVP)`;

        console.log('getCustomersByNoListExpanded URL: ', `${BACKEND_URL}${BASE_API_URL}/alletec/app/v2.0/companies(${COMPANY_ID})/customerexpandeddetails?${queryParams}`);

        const response = await axios.get(
            `${BACKEND_URL}${BASE_API_URL}/alletec/app/v2.0/companies(${COMPANY_ID})/customerexpandeddetails?${queryParams}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log("getCustomersByNoListExpanded response(BusinessCentralAPI.js):", response);

        if (response.data && response.data.value && response.data.value.length > 0) {
            return { success: true, data: response.data.value };  // returns array
        } else {
            return { success: false, error: 'No customers found' };
        }
    } catch (error) {
        console.error('Error fetching customers by No. list(BusinessCentralAPI.js):', error);
        return {
            success: false,
            error: error.response?.data?.details || 'Failed to fetch customers',
        };
    }
};

export const getCustomerLedgerEntriesByCustomerNo = async (customerNo, filters = {}) => {
    console.log("Fetching ledger entries for customer:", customerNo);

    try {
        if (!customerNo || !customerNo.trim()) {
            return { success: false, error: 'No customer number provided' };
        }

        let filterQuery = `customerNo eq '${customerNo.trim()}'`;


        let queryParams = `$filter=${filterQuery}`;

        queryParams += '&$expand=customer($expand=salesperson($expand=salespersonsHierarchyNSM,salespersonsHierarchyRSM,salespersonsHierarchyZSM,salespersonsHierarchyASM,salespersonsHierarchyASO,salespersonsHierarchyVP)), postedNarrations';

        const url = `${BACKEND_URL}${BASE_API_URL}/alletec/app/v2.0/companies(${COMPANY_ID})/customerLedgerEntries?${queryParams}`;

        console.log('getCustomerLedgerEntriesByCustomerNo URL:', url);

        const response = await axios.get(url, {
            headers: { 'Content-Type': 'application/json' },
        });

        console.log("getCustomerLedgerEntriesByCustomerNo response:", response);

        if (response.data && response.data.value) {
            return { success: true, data: response.data.value };
        } else {
            return { success: false, error: 'No ledger entries found' };
        }
    } catch (error) {
        console.error('Error fetching customer ledger entries:', error);
        return {
            success: false,
            error: error.response?.data?.details || 'Failed to fetch customer ledger entries',
        };
    }
};

export const getCustomerByNoExpanded = async (customerNo) => {
    try {
        if (!customerNo || !customerNo.trim()) {
            return { success: false, error: 'No customer number provided' };
        }

        const filterQuery = `$filter=no eq '${customerNo.trim()}'&$expand=salesperson`;

        const response = await axios.get(
            `${BACKEND_URL}${BASE_API_URL}/alletec/app/v2.0/companies(${COMPANY_ID})/customer?${filterQuery}`,
            {
                headers: { 'Content-Type': 'application/json' },
            }
        );

        if (response.data?.value?.length > 0) {
            return { success: true, data: response.data.value[0] };
        }

        return { success: false, error: 'Customer not found' };
    } catch (error) {
        console.error('Error fetching customer by no:', error);
        return {
            success: false,
            error: error.response?.data?.details || 'Failed to fetch customer data',
        };
    }
};

export const getCustomerOverdueInvoiceAmount = async (customerNo, dueDate) => {
    try {
        let filterQuery = `customer_No_Filter_FilterOnly eq '${customerNo}' and due_Date_Filter_FilterOnly le ${dueDate}`;
        // const encodedFilter = encodeURIComponent(filterQuery);
        let queryParams = `$filter=${filterQuery}`;

        console.log('Overdue Invoice API URL:', `${BACKEND_URL}${BASE_API_URL}/alletec/app/v2.0/companies(${COMPANY_ID})/CustOverdueInvoiceAmts?${queryParams}`);

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