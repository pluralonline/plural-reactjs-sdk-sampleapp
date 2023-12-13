import CryptoJS from "crypto-js";


/**
 * generateCreateOrderHash:
 * Method for creating hash for x-verify header
 * @param request Data using which the hash will be generated
 * @param secret Secret using which the hash will be signed
 * @returns string
 */
export async function generateCreateOrderHash(request, secret) {
  return createHmacSha256(secret, request)
}


/**
 * generateFetchOrderHash:
 * Method for creating hash for pcc_DIA_SECRET
 * @param request Data using which the hash will be generated
 * @param secret Secret using which the hash will be signed
 * @returns string
 */
export async function generateFetchOrderHash(request, secret) {
  const sortedKeys = Object.keys(request).sort();

  const dataString = sortedKeys
    .map((key) => `${key}=${request[key]}`)
    .join('&');

  return createHmacSha256(secret, dataString);
}


/**
* verifyHash:
* Method for verifying hash received in the request
* @param hash Received hash in the response which will be checked
* @param request Data using which the hash will be generated
* @returns boolean
*/
export async function verifyHash(hash, request) {
  try {
    const sortedKeys = Object.keys(request).sort();

    const dataString = sortedKeys
      .map((key) => `${key}=${request[key]}`)
      .join('&');

    return createHmacSha256(this.merchant_secret, dataString).then(newHash => {
      return newHash.toUpperCase() === hash
    });

  } catch (error) {
    console.log(error);
    throw new Error('Failed to verify hash');
  }
}

async function createHmacSha256(key, data) {
  try {
    return CryptoJS.HmacSHA256(data, CryptoJS.enc.Hex.parse(key)).toString(CryptoJS.enc.Hex).toUpperCase();
  } catch (error) {
    console.log(error);
  }
}
