import React from "react";
import ReactToPrint from "react-to-print";
import axios from "axios";
import "../../Assests/css/CustomCss/Report.css";
import "../../Assests/css/CustomCss/Invoice.css";
import receitConstants from "../Receipts/ReceiptConstants";
import authentication from "react-azure-b2c";
import logo from "../../Assests/images/CompanyLogo.png";
import moment from "moment";

const receiptURL = receitConstants.getReceiptURL();

class rptReceipt extends React.Component {
  constructor(props) {
    super(props);
    this.token = authentication.getAccessToken().accessToken; //get token
    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    const ReceiptCode = window.location.href.split("/")[5];
    const id = ReceiptCode.split()[1];
    console.log("id :" + ReceiptCode);

    axios({
      method: "GET",
      url: receiptURL + "/GetReceiptByCode/" + ReceiptCode,
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    })
      .then((response) => {
        this.setState({ data: response.data });
        console.log("Result :" + response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  
  render() {
    return (
      <>
        <div className="container btnPrint">
          <ReactToPrint
            trigger={() => {
              return (
                <a class="waves-effect waves-light btn-small" href="#">
                  Print
                </a>
              );
            }}
            content={() => this.componentRef}
          />
        </div>
        <div
          id="invReport"
          className="container"
          ref={(el) => (this.componentRef = el)}
          //style={{ fontFamily: "courier new" }}
        >
          <div className="row">
            <div className="col s2">
              <img src={logo} alt="Company Logo" />
            </div>
            <div
              class="col s6"
              style={{ marginLeft: "-50px", marginTop: "15px" }}
            >
              <div class="card-content black-text">
                <p>
                  <b>BMS Pawning</b>
                  <br></br>
                  <b>Dambulla Road, Melsiripura</b>
                  <br></br>
                  <b>077 607 0096 / 070 607 0096</b>
                </p>
              </div>
            </div>
            <div
              className="col s4"
              style={{ textAlign: "right", lineHeight: 0.3 }}
            >
              <div>
                <h5>PAWN RECEIPT</h5>
              </div>
              <div>
                <p>
                  {" "}
                  <br></br>
                  Print Date : {moment(Date()).format("YYYY-MM-DD hh:mm:ss A")}
                </p>
              </div>
            </div>
          </div>
          <div style={{ marginTop: "-20px", paddingBottom: "0px" }}>
            <div className="row">
              <div className="col s7">
                <h6>
                  <b>Customer Details</b>
                </h6>
                <hr></hr>
                <div className="row">
                  <div className="col s6">
                    <div>
                      {" "}
                      <p style={{ lineHeight: "1.6" }}>
                        Customer Code : {this.state.data.customerCode}
                        <br></br>
                        Name : {this.state.data.customerName}
                        <br></br>
                        NIC : {this.state.data.nic}
                        <br></br>
                        Contact No 1 : {this.state.data.contact1}
                        <br></br>
                        Contact No 2 : {this.state.data.contact2}
                        <br></br>
                      </p>
                    </div>
                  </div>
                  <div className="col s6">
                    <p>
                      Address :<br></br> {this.state.data.address}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col s5">
                <h6>
                  <b>Invoice Details</b>
                </h6>
                <hr></hr>
                <div className="row">
                  <div className="col s6">
                    <p style={{ lineHeight: "1.6" }}>
                      Invoice Code : {this.state.data.invoiceCode}
                      <br></br>
                      Invoice Date :{" "}
                      {moment(this.state.data.invoiceDate).format("MM/DD/YYYY")}
                      <br></br>
                      Advance Value :<br></br>
                      Invoice Total : {this.state.data.invoiceTotal}
                      <br></br>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <hr style={{ marginTop: "-40px" }}></hr>
          </div>
          <div className="row">
            <div className="col s12" style={{ marginTop: "-20px" }}>
              <h6>
                <b>Receipt Details</b>
              </h6>
              <table>
                <thead>
                  <tr>
                    <th>Receipt Code</th>
                    <th>Receipt Date</th>
                    <th>Description</th>
                    <th>Cumulative Interest(LKR)</th>
                    <th>Customer Payment(LKR)</th>
                    
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td>{this.state.data.receiptCode}</td>
                    <td>
                      {moment(this.state.data.createdDate).format("MM/DD/YYYY")}
                    </td>
                    <td>{this.state.data.description}</td>
                    <td style={{ textAlign: "center" }}>
                      {this.state.data.cumulativeInterest}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {this.state.data.payment}
                    </td>
                   
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="row">
            <div className="col s12" style={{ marginTop: "18%" }}>
              <div className="col s6">
                <p>
                  ............................
                  <br></br>
                  Approved By
                </p>
              </div>

              <div className="col s6" style={{ textAlign: "right" }}>
                <p>
                  ............................
                  <br></br>
                  Customer
                </p>
              </div>
            </div>
          </div>

          <div id="invReport" className="container">
            <div className="row">
              <div className="col s2">
                <img src={logo} alt="Company Logo" />
              </div>
              <div
                class="col s6"
                style={{ marginLeft: "-50px", marginTop: "15px" }}
              >
                <div class="card-content black-text">
                  <p>
                    <b>BMS Pawning</b>
                    <br></br>
                    <b>Dambulla Road, Melsiripura</b>
                    <br></br>
                    <b>077 607 0096 / 070 607 0096</b>
                  </p>
                </div>
              </div>
              <div
                className="col s4"
                style={{ textAlign: "right", lineHeight: 0.3 }}
              >
                <div>
                  <h5>PAWN RECEIPT</h5>
                </div>
                <div>
                  <p>
                    {" "}
                    <br></br>
                    Print Date :{" "}
                    {moment(Date()).format("YYYY-MM-DD hh:mm:ss A")}
                  </p>
                </div>
              </div>
            </div>
            <div style={{ marginTop: "-20px", paddingBottom: "0px" }}>
              <div className="row">
                <div className="col s7">
                  <h6>
                    <b>Customer Details</b>
                  </h6>
                  <hr></hr>
                  <div className="row">
                    <div className="col s6">
                      <div>
                        {" "}
                        <p style={{ lineHeight: "1.6" }}>
                          Customer Code : {this.state.data.customerCode}
                          <br></br>
                          Name : {this.state.data.customerName}
                          <br></br>
                          NIC : {this.state.data.nic}
                          <br></br>
                          Contact No 1 : {this.state.data.contact1}
                          <br></br>
                          Contact No 2 : {this.state.data.contact2}
                          <br></br>
                        </p>
                      </div>
                    </div>
                    <div className="col s6">
                      <p>
                        Address :<br></br> {this.state.data.address}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col s5">
                  <h6>
                    <b>Invoice Details</b>
                  </h6>
                  <hr></hr>
                  <div className="row">
                    <div className="col s6">
                      <p style={{ lineHeight: "1.6" }}>
                        Invoice Code : {this.state.data.invoiceCode}
                        <br></br>
                        Invoice Date :{" "}
                        {moment(this.state.data.invoiceDate).format(
                          "MM/DD/YYYY"
                        )}
                        <br></br>
                        Advance Value :<br></br>
                        Invoice Total : {this.state.data.invoiceTotal}
                        <br></br>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <hr style={{ marginTop: "-40px" }}></hr>
            </div>
            <div className="row">
              <div className="col s12" style={{ marginTop: "-20px" }}>
                <h6>
                  <b>Receipt Details</b>
                </h6>
                <table>
                  <thead>
                    <tr>
                      <th>Receipt Code</th>
                      <th>Receipt Date</th>
                      <th>Description</th>
                      <th>Cumulative Interest(LKR)</th>
                      <th>Customer Payment(LKR)</th>
                      
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td>{this.state.data.receiptCode}</td>
                      <td>
                        {moment(this.state.data.createdDate).format(
                          "MM/DD/YYYY"
                        )}
                      </td>
                      <td>{this.state.data.description}</td>
                      <td style={{ textAlign: "center" }}>
                        {this.state.data.cumulativeInterest}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {this.state.data.payment}
                      </td>
                     
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="row">
              <div className="col s12" style={{ marginTop: "18%" }}>
                <div className="col s6">
                  <p>
                    ............................
                    <br></br>
                    Approved By
                  </p>
                </div>

                <div className="col s6" style={{ textAlign: "right" }}>
                  <p>
                    ............................
                    <br></br>
                    Customer
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
export default rptReceipt;
