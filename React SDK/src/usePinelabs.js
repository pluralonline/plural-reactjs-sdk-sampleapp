import { generateCreateOrderHash, generateFetchOrderHash, verifyHash } from "./hash";
import { Buffer } from "buffer";

export function usePinelabs(merchantId, merchantAccessCode, merchantSecret, is_test = false) {
    const defaultConfig = {
        merchant_id: merchantId,
        merchant_access_code: merchantAccessCode,
        merchant_secret: merchantSecret,
        is_test: is_test,
    };

    return {
        payment: {
            create: createOrder.bind(defaultConfig),
            fetch: fetchOrder.bind(defaultConfig),
        },
        emi: {
            calculate: calculateEmi.bind(defaultConfig)
        },
        hash: {
            verify: verifyHash.bind(defaultConfig)
        }
    }
}

/**
 * createOrder:
 * Method for creating order from pinelabs using provided parameters
 * @param txn_data Transaction details (Mandatory)
 * @param customer_data Basic customer info (Mandatory)
 * @param billing_data Billing address (Optional)
 * @param shipping_data Shipping address (Optional)
 * @param udf_data Optional data (Optional)
 * @param payment_modes Payment methods which needs to be shown on the checkout (Mandatory)
 * @param product_detail Product details for multi-cart
 */
async function createOrder(txn_data, payment_modes, customer_data = {}, billing_data = {}, shipping_data = {}, udf_data = {}, product_detail = []) {
    try {
        const methods = getPaymentMethods(payment_modes);
        const body = {
            merchant_data: {
                merchant_id: this?.merchant_id,
                merchant_access_code: this?.merchant_access_code,
                unique_merchant_txn_id: txn_data?.txn_id,
                merchant_return_url: txn_data?.callback,
            },
            payment_data: {
                amount_in_paisa: txn_data?.amount_in_paisa,
            },
            txn_data: {
                navigation_mode: 2,
                payment_mode: methods.join(','),
                transaction_type: 1
            },
            customer_data: {
                ...customer_data,
                billing_data: billing_data,
                shipping_data: shipping_data
            },
            udf_data: udf_data,
            product_details: product_detail
        };
        const endpoint = this.is_test ? "https://uat.pinepg.in/api/" : 'https://pinepg.in/api/';
        const url = endpoint + "v2/accept/payment";
        const base64Data = Buffer.from(JSON.stringify(body)).toString("base64");
        return await generateCreateOrderHash(base64Data, this?.merchant_secret).then(async (hash) => {
            const data = await fetch(url, {
                method: "POST",
                body: JSON.stringify({
                    request: base64Data,
                }),
                headers: {
                    "Content-Type": "application/json",
                    "X-VERIFY": hash
                }
            }).then(async (data) => {
                if (data.status == 200) {
                    return data.json();
                }
                throw new Error(JSON.stringify(await data.json()));
            });
            return {
                status: true,
                url: data.redirect_url,
                token: data.token
            };
        });
    } catch (error) {
        throw new Error(error);
    }
}


/**
 * getPaymentMethods:
 * Method for getting payment mode array for pinelabs
 * @param methods Methods selected by the merchant to be shown on checkout
 * @returns array<number>
 */
function getPaymentMethods(methods) {
    const modes = [];
    const conditions = [
        { condition: () => methods?.cards === true, value: 1 },
        { condition: () => methods?.netbanking === true, value: 3 },
        { condition: () => methods?.emi === true, value: 4 },
        { condition: () => methods?.cardless_emi === true, value: 19 },
        { condition: () => methods?.upi === true, value: 10 },
        { condition: () => methods?.wallet === true, value: 11 },
        { condition: () => methods?.debit_emi === true, value: 14 },
        { condition: () => methods?.prebooking === true, value: 16 },
        { condition: () => methods?.bnpl === true, value: 17 },
        { condition: () => methods?.paybypoints === true, value: 20 },
    ];
    conditions.forEach((param) => {
        if (param.condition()) {
            modes.push(param.value);
        }
    })
    return modes;
}


/**
 * httpBuildQuery:
 * Http param query builder
 * @param params Parameters using which the query will be generated
 * @returns string
 */
function httpBuildQuery(params) {
    const queryParts = [];

    for (const key in params) {
        if (params.hasOwnProperty(key)) {
            const value = params[key];
            if (Array.isArray(value)) {
                for (const item of value) {
                    queryParts.push(encodeURIComponent(key) + '[]=' + encodeURIComponent(item));
                }
            } else {
                queryParts.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
            }
        }
    }

    return queryParts.join('&');
}


/**
* fetchOrder:
* Method for fetching order details using the `unique merchant transaction id` and `transaction type`
* @param txnId `unique merchant transaction id` of the transaction for which the details needs to be fetched
* @param txnType `transaction type` type of the transaction
* @returns unknown
* @function
*/
export async function fetchOrder(txnId, txnType = 3) {
    try {
        const body = {
            "ppc_MerchantID": this.merchant_id,
            "ppc_MerchantAccessCode": this.merchant_access_code,
            "ppc_TransactionType": txnType,
            "ppc_UniqueMerchantTxnID": txnId,
        };
        const endpoint = this.is_test ? "https://uat.pinepg.in/api/" : 'https://pinepg.in/api/';
        const url = endpoint + "PG/V2";
        return await generateFetchOrderHash(body, this?.merchant_secret).then(async (hash) => {
            const data = await fetch(url, {
                method: "POST",
                body: httpBuildQuery({
                    ...body,
                    "ppc_DIA_SECRET": hash,
                    "ppc_DIA_SECRET_TYPE": "sha256"
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(data => data.json());
            return await data;
        })

    } catch (error) {
        throw new Error(JSON.stringify(error?.response?.data));
    }
}


/**
 * calculateEmi:
 * Method for fetching EMIs for a product
 * @param txnData Transaction data
 * @param productsDetails Product details for which the EMI data needs to be fetched
 * @returns unknown
 */
export async function calculateEmi(txnData, productsDetails = []) {
    try {
        const body = {
            merchant_data: {
                merchant_id: this.merchant_id,
                merchant_access_code: this.merchant_access_code
            },
            payment_data: {
                amount_in_paisa: txnData?.amount_in_paisa ?? null
            },
            product_details: productsDetails
        }
        const endpoint = this.is_test ? "https://uat.pinepg.in/api/" : 'https://pinepg.in/api/';
        const url = endpoint + "v2/emi/calculator";
        const data = await fetch(url, {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json"
            }
        });
        return await data.json();
    } catch (error) {
        throw new Error(JSON.stringify(error?.response?.data ?? error));
    }
}
