import { useEffect, useState } from "react";
import "./App.css";
import { usePinelabs } from "pine-react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Link } from "react-router-dom";

function Fetch() {
  
  const [formData, setFormData] = useState({
    merchant_id: "106598",
    access_code: "4a39a6d4-46b7-474d-929d-21bf0e9ed607",
    secret: "55E0F73224EC458A8EC0B68F7B47ACAE",
    pg_mode: "true",
    txn_id: "",
   });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const { payment } = usePinelabs(
    formData.merchant_id,
    formData.access_code,
    formData.secret,
    formData.pg_mode
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    const txn_id = formData.txn_id;
    const txn_type = 3;
    
    try {
        const fetch_response = await payment.fetch(txn_id, txn_type);
        console.log(fetch_response);
  
        const responseDiv = document.getElementById("response");
        responseDiv.classList.add("response");
        responseDiv.innerText = JSON.stringify(fetch_response, null, 2);
      } catch (error) {
        console.error("Error fetching payment details:", error);
      }

    
  };

  return (
    <>
      <div className="container">
        <main>
          <div className="py-5 text-center">
            <h2>Test Form</h2>
            <div className="text-center">
              <p className="mb-2">Fetch EMI Offers</p>
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
        <div className="col-md-6 col-lg-12">
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
                 Transaction ID
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
            </div>
            <button className="w-100 my-4 btn btn-primary btn-lg" type="submit">
              Fetch Details
            </button>
          </form>
        </div>
        <div id="response" className=""></div>
      </div>
    </>
  );
}

export default Fetch;
