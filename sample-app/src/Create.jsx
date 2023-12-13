import { useEffect, useState } from "react";
import "./App.css";
import { usePinelabs } from "pine-react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Link } from "react-router-dom";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Create() {
  const [isCustomerInfoCollapsed, setCustomerInfoCollapsed] = useState(true);
  const [isBillingAddressCollapsed, setBillingAddressCollapsed] =
    useState(true);
  const [isShippingAddressCollapsed, setShippingAddressCollapsed] =
    useState(true);
  const [isAdditionalFieldsCollapsed, setAdditionalFieldsCollapsed] =
    useState(true);

  const toggleCollapse = (section) => {
    switch (section) {
      case "customer_info":
        setCustomerInfoCollapsed(!isCustomerInfoCollapsed);
        break;
      case "billing_address":
        setBillingAddressCollapsed(!isBillingAddressCollapsed);
        break;
      case "shipping_address":
        setShippingAddressCollapsed(!isShippingAddressCollapsed);
        break;
      case "additional_fields":
        setAdditionalFieldsCollapsed(!isAdditionalFieldsCollapsed);
        break;
      default:
        break;
    }
  };

  const renderFontAwesomeIcon = (section) => {
    switch (section) {
      case "customer_info":
        return (
          <FontAwesomeIcon
            icon={isCustomerInfoCollapsed ? faChevronDown : faChevronUp}
            className="me-2 text-primary mt-1"
          />
        );
      case "billing_address":
        return (
          <FontAwesomeIcon
            icon={isBillingAddressCollapsed ? faChevronDown : faChevronUp}
            className="me-2 text-primary mt-1"
          />
        );
      case "shipping_address":
        return (
          <FontAwesomeIcon
            icon={isShippingAddressCollapsed ? faChevronDown : faChevronUp}
            className="me-2 text-primary mt-1"
          />
        );
      case "additional_fields":
        return (
          <FontAwesomeIcon
            icon={isAdditionalFieldsCollapsed ? faChevronDown : faChevronUp}
            className="me-2 text-primary mt-1"
          />
        );
      default:
        return null;
    }
  };

  const defaultProductData = JSON.stringify([
    {
      product_code: "testSKU1",
      product_amount: "2000000",
    },
    {
      product_code: "testSKU2",
      product_amount: "2000000",
    },
  ]);

  const [selectedOptions, setSelectedOptions] = useState({
    cards: true,
    netbanking: true,
    wallet: true,
    upi: true,
    emi: false,
    debit_emi: false,
    cardless_emi: false,
    bnpl: false,
    prebooking: false,
    paybypoints: false,
  });

  const [formData, setFormData] = useState({
    merchant_id: "106598",
    access_code: "4a39a6d4-46b7-474d-929d-21bf0e9ed607",
    secret: "55E0F73224EC458A8EC0B68F7B47ACAE",
    pg_mode: "true",
    txn_id: "",
    amount_in_paisa: "4000000",
    callback_url: "https://webhook.site/8afab818-6df9-4fa1-bdda-958486656d6c",
    response_data: defaultProductData,
    customer_id: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    address3: "",
    city: "",
    state: "",
    country: "",
    billing_pincode: "",
    shipping_firstname: "",
    shipping_lastname: "",
    shipping_phone: "",
    shipping_address1: "",
    shipping_address2: "",
    shipping_address3: "",
    shipping_city: "",
    shipping_state: "",
    shipping_pincode: "",
    shipping_country: "",
    udf1: "",
    udf2: "",
    udf3: "",
    udf4: "",
    udf5: "",
  });

  const { payment } = usePinelabs(
    formData.merchant_id,
    formData.access_code,
    formData.secret,
    formData.pg_mode
  );

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (option) => {
    setSelectedOptions((prevSelectedOptions) => ({
      ...prevSelectedOptions,
      [option]: !prevSelectedOptions[option],
    }));
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      console.log(formData);
      console.log(selectedOptions);

      const txn_data = {
        txn_id: formData.txn_id,
        callback: formData.callback_url,
        amount_in_paisa: formData.amount_in_paisa,
      };

      const customer_data = {
        email_id: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        mobile_no: formData.phone,
        customer_id: formData.customer_id,
      };

      const billing_data = {
        address1: formData.address1,
        address2: formData.address2,
        address3: formData.address3,
        pincode: formData.billing_pincode,
        city: formData.city,
        state: formData.state,
        country: formData.country,
      };

      const shipping_data = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        mobile_no: formData.mobile_no,
        address1: formData.address1,
        address2: formData.address2,
        address3: formData.address3,
        pincode: formData.billing_pincode,
        city: formData.city,
        state: formData.state,
        country: formData.country,
      };

      const udf_data = {
        udf_field_1: formData.udf1,
        udf_field_2: formData.udf2,
        udf_field_3: formData.udf3,
        udf_field_4: formData.udf4,
        udf_field_5: formData.udf5,
      };

      
    if ( /\S/.test(formData.response_data)) {

      const productsData = formData.response_data;

      const cleanedString = productsData.replace(/\\r\\n/g, "");
      const jsonData = JSON.parse(cleanedString);

      console.log(jsonData);

      var product_details = jsonData;
    } else {
     
      var product_details = [];
      console.log(product_details);
    } 

      const payment_mode = selectedOptions;

      const create_order_response = await payment.create(
        txn_data,
        payment_mode,
        customer_data,
        billing_data,
        shipping_data,
        udf_data,
        product_details
      );

      console.log(create_order_response);
      if (create_order_response && create_order_response.url) {
        window.location.replace(create_order_response.url);
      } else {
        console.error("Invalid response or missing URL.");
        res.send("Invalid response or missing URL.");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="container">
        <main>
          <div className="py-5 text-center">
            <h2>Test Form</h2>
            <div className="text-center">
              <p className="mb-2"> Create Order</p>
              <Link to={"/"}>Create Order</Link> |
              <Link to={"/fetch"}>Fetch Order</Link> |
              <Link to={"/emi"}>Fetch EMI Offers</Link> |
              <Link to={"/hash"}>Hash Verification</Link>
              <div className="col-md-12 text-center"></div>
            </div>
          </div>
        </main>
      </div>
      <div className="row m-4">
        <div className="col-md-6 col-lg-12 m-4">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-sm-6">
                <label htmlFor="mid" className="form-label">
                  Merchant ID
                </label>
                <input
                  type="text"
                  name="merchant_id"
                  className="form-control"
                  id="mid"
                  placeholder="Merchant ID"
                  value={formData.merchant_id}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-sm-6">
                <label htmlFor="access_code" className="form-label">
                  Access Code
                </label>
                <input
                  type="text"
                  name="access_code"
                  className="form-control"
                  id="access_code"
                  placeholder="API Access Code"
                  value={formData.access_code}
                  required
                  onChange={handleChange}
                />
              </div>

              <div className="col-sm-6">
                <label htmlFor="secret" className="form-label">
                  Secret
                </label>
                <input
                  type="text"
                  name="secret"
                  className="form-control"
                  id="secret"
                  placeholder="Secret"
                  value={formData.secret}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-sm-6">
                <label htmlFor="mode" className="form-label">
                  Gateway Mode
                </label>
                <select
                  name="pg_mode"
                  id="mode"
                  className="form-control"
                  value={formData.pg_mode}
                  onChange={handleChange}
                >
                  <option value="true">Sandbox</option>
                  <option value="false">Production</option>
                </select>
              </div>

              <div className="col-sm-3">
                <label htmlFor="txn_id" className="form-label">
                  Transacrtion ID
                </label>
                <input
                  type="text"
                  name="txn_id"
                  className="form-control"
                  id="txn_id"
                  placeholder="Transacrtion ID"
                  value={formData.txn_id}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-sm-3">
                <label htmlFor="amount" className="form-label">
                  Amount (In Paisa)
                </label>
                <input
                  type="text"
                  name="amount_in_paisa"
                  className="form-control"
                  id="amount"
                  placeholder="Amount (In Paisa)"
                  value={formData.amount_in_paisa}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-sm-6">
                <label htmlFor="callback_url" className="form-label">
                  Callback URL
                </label>
                <input
                  type="text"
                  name="callback_url"
                  className="form-control"
                  id="callback_url"
                  placeholder="Callback URL"
                  value={formData.callback_url}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-sm-6">
                <label htmlFor="response_data" className="form-label">
                  Product Details
                </label>
                <textarea
                  name="response_data"
                  id="response_data"
                  className="form-control"
                  rows="3"
                  value={formData.response_data}
                  onChange={handleChange}
                ></textarea>
              </div>

              <div className="col-sm-6">
                <label htmlFor="payment_mode" className="form-label">
                  Payment Mode
                </label>
                <div className="dropdown">
                  <button
                    className="btn btn-secondary dropdown-toggle"
                    type="button"
                    id="dropdownMenuButton"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Select Payment Mode
                  </button>
                  <ul
                    className="dropdown-menu"
                    aria-labelledby="dropdownMenuButton"
                  >
                    <li>
                      <label>
                        <input
                          type="checkbox"
                          checked={selectedOptions.cards}
                          onChange={() => handleCheckboxChange("cards")}
                          style={{ marginRight: "8px" }}
                        />
                        Cards
                      </label>
                    </li>

                    <li>
                      <label>
                        <input
                          type="checkbox"
                          checked={selectedOptions.netbanking}
                          onChange={() => handleCheckboxChange("netbanking")}
                          style={{ marginRight: "8px" }}
                        />
                        Net Banking
                      </label>
                    </li>
                    <li>
                      <label>
                        <input
                          type="checkbox"
                          checked={selectedOptions.wallet}
                          onChange={() => handleCheckboxChange("wallet")}
                          style={{ marginRight: "8px" }}
                        />
                        wallet
                      </label>
                    </li>

                    <li>
                      <label>
                        <input
                          type="checkbox"
                          checked={selectedOptions.upi}
                          onChange={() => handleCheckboxChange("upi")}
                          style={{ marginRight: "8px" }}
                        />
                        upi
                      </label>
                    </li>
                    <li>
                      <label>
                        <input
                          type="checkbox"
                          checked={selectedOptions.emi}
                          onChange={() => handleCheckboxChange("emi")}
                          style={{ marginRight: "8px" }}
                        />
                        emi
                      </label>
                    </li>

                    <li>
                      <label>
                        <input
                          type="checkbox"
                          checked={selectedOptions.debit_emi}
                          onChange={() => handleCheckboxChange("debit_emi")}
                          style={{ marginRight: "8px" }}
                        />
                        debit_emi
                      </label>
                    </li>

                    <li>
                      <label>
                        <input
                          type="checkbox"
                          checked={selectedOptions.cardless_emi}
                          onChange={() => handleCheckboxChange("cardless_emi")}
                          style={{ marginRight: "8px" }}
                        />
                        cardless emi
                      </label>
                    </li>

                    <li>
                      <label>
                        <input
                          type="checkbox"
                          checked={selectedOptions.bnpl}
                          onChange={() => handleCheckboxChange("bnpl")}
                          style={{ marginRight: "8px" }}
                        />
                        bnpl
                      </label>
                    </li>

                    <li>
                      <label>
                        <input
                          type="checkbox"
                          checked={selectedOptions.prebooking}
                          onChange={() => handleCheckboxChange("prebooking")}
                          style={{ marginRight: "8px" }}
                        />
                        prebooking
                      </label>
                    </li>

                    <li>
                      <label>
                        <input
                          type="checkbox"
                          checked={selectedOptions.paybypoints}
                          onChange={() => handleCheckboxChange("paybypoints")}
                          style={{ marginRight: "8px" }}
                        />
                        Pay By Points
                      </label>
                    </li>
                  </ul>
                </div>
              </div>

              <a
                className="text-dark text-decoration-none mt-4 mb-4 d-flex"
                href="#customer_info"
                data-bs-toggle="collapse"
                role="button"
                onClick={() => toggleCollapse("customer_info")}
              >
                {renderFontAwesomeIcon("customer_info")}
                <h5 className="mb-0">Customer Details</h5>
              </a>

              <div id="customer_info" className="collapse row">
                <div className="col-sm-4">
                  <label htmlFor="customer_id" className="form-label">
                    Customer Id
                  </label>
                  <input
                    type="text"
                    name="customer_id"
                    className="form-control"
                    id="customer_id"
                    placeholder="Customer Id"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-sm-4">
                  <label htmlFor="first_name" className="form-label">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    className="form-control"
                    id="first_name"
                    placeholder="Enter First Name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-sm-4">
                  <label htmlFor="last_name" className="form-label">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    className="form-control"
                    id="last_name"
                    placeholder="Enter Last Name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-sm-6 mt-2">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="text"
                    name="email"
                    className="form-control"
                    id="Enter email"
                    placeholder="Enter Email Id"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-sm-6 mt-2">
                  <label htmlFor="phone" className="form-label">
                    Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    className="form-control"
                    id="phone"
                    placeholder="Enter Phone No"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <a
                className="text-dark text-decoration-none mt-2 mb-4 d-flex"
                href="#billing_address"
                data-bs-toggle="collapse"
                role="button"
                onClick={() => toggleCollapse("billing_address")}
              >
                {renderFontAwesomeIcon("billing_address")}
                <h5 className="mb-0">Billing Address</h5>
              </a>

              <div id="billing_address" className="collapse row">
                <div className="col-sm-4">
                  <label htmlFor="address1" className="form-label">
                    Address 1
                  </label>
                  <input
                    type="text"
                    name="address1"
                    className="form-control"
                    id="billing_address1"
                    placeholder="Address 1"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-sm-4">
                  <label htmlFor="address2" className="form-label">
                    Address 2
                  </label>
                  <input
                    type="text"
                    name="address2"
                    className="form-control"
                    id="billing_address2"
                    placeholder="Address 2"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-sm-4">
                  <label htmlFor="address3" className="form-label">
                    Address 3
                  </label>
                  <input
                    type="text"
                    name="address3"
                    className="form-control"
                    id="billing_address3"
                    placeholder="Address 3"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-sm-3 mt-2">
                  <label htmlFor="city" className="form-label">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    className="form-control"
                    id="billing_city"
                    placeholder="City"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-sm-3 mt-2">
                  <label htmlFor="state" className="form-label">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    className="form-control"
                    id="billing_state"
                    placeholder="State"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-sm-3 mt-2">
                  <label htmlFor="country" className="form-label">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    className="form-control"
                    id="billing_country"
                    placeholder="Country"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-sm-3 mt-2">
                  <label htmlFor="pincode" className="form-label">
                    Pin Code
                  </label>
                  <input
                    type="text"
                    name="billing_pincode"
                    className="form-control"
                    id="pincode"
                    placeholder="Pin Code"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <a
                className="text-dark text-decoration-none mt-2 mb-4 d-flex"
                href="#shipping_address"
                data-bs-toggle="collapse"
                role="button"
                onClick={() => toggleCollapse("shipping_address")}
              >
                {renderFontAwesomeIcon("shipping_address")}
                <h5 className="mb-0">Shipping Address</h5>
              </a>

              <div id="shipping_address" className="collapse row">
                <div className="mb-3 col-md-4">
                  <label htmlFor="shipping_firstname">First Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter First Name"
                    name="shipping_firstname"
                    id="shipping_firstname"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3 col-md-4">
                  <label htmlFor="shipping_lastname">Last Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Last Name"
                    name="shipping_lastname"
                    id="shipping_lastname"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3 col-md-4">
                  <label htmlFor="shipping_phone">Phone No</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Phone No"
                    name="shipping_phone"
                    id="shipping_phone"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3 col-md-4">
                  <label htmlFor="shipping_address1">Address Line 1</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Address Line 1"
                    name="shipping_address1"
                    id="shipping_address1"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3 col-md-4">
                  <label htmlFor="shipping_address2">Address Line 2</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Address Line 2"
                    name="shipping_address2"
                    id="shipping_address2"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3 col-md-4">
                  <label htmlFor="shipping_address3">Address Line 3</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Address Line 3"
                    name="shipping_address3"
                    id="shipping_address3"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3 col-md-3 mt-2">
                  <label htmlFor="shipping_city">City</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter City"
                    name="shipping_city"
                    id="shipping_city"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3 col-md-3 mt-2">
                  <label htmlFor="shipping_state">State</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter State"
                    name="shipping_state"
                    id="shipping_state"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3 col-md-3 mt-2">
                  <label htmlFor="shipping_pincode">Pin Code</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Pin Code"
                    name="shipping_pincode"
                    id="shipping_pincode"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3 col-md-3 mt-2">
                  <label htmlFor="shipping_country">Country</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Country"
                    name="shipping_country"
                    id="shipping_country"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <a
                className="text-dark text-decoration-none mt-2 mb-4 d-flex"
                href="#additional_fields"
                data-bs-toggle="collapse"
                role="button"
                onClick={() => toggleCollapse("additional_fields")}
              >
                {renderFontAwesomeIcon("additional_fields")}
                <h5 className="mb-0">Additional Fields</h5>
              </a>

              <div id="additional_fields" className="collapse row">
                <div className="mb-3 col-md-6">
                  <label htmlFor="udf1">udf 1</label>
                  <input
                    type="text"
                    className="form-control"
                    id="udf1"
                    placeholder="Enter udf 1"
                    name="udf1"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3 col-md-6">
                  <label htmlFor="udf2">udf 2</label>
                  <input
                    type="text"
                    className="form-control"
                    id="udf2"
                    placeholder="Enter udf 2"
                    name="udf2"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3 col-md-6">
                  <label htmlFor="udf3">udf 3</label>
                  <input
                    type="text"
                    className="form-control"
                    id="udf3"
                    placeholder="Enter udf 3"
                    name="udf3"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3 col-md-6">
                  <label htmlFor="udf4">udf 4</label>
                  <input
                    type="text"
                    className="form-control"
                    id="udf4"
                    placeholder="Enter udf 4"
                    name="udf4"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3 col-md-6">
                  <label htmlFor="udf4">udf 5</label>
                  <input
                    type="text"
                    className="form-control"
                    id="udf5"
                    placeholder="Enter udf 5"
                    name="udf5"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            <button
              className="w-100 my-4 btn btn-primary btn-lg"
              type="submit"
              name="pay_now"
            >
              Pay Now
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Create;
