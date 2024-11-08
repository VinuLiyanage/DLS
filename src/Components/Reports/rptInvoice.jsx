import React from "react";
import { useLocation } from "react-router-dom";
import ReactToPrint from "react-to-print";
import axios from "axios";
import "../../Assests/css/CustomCss/Report.css";
import "../../Assests/css/CustomCss/Invoice.css";

import commonConstants from "../Common/CommonConstants";
import invoiceConstants from "../Invoices/InvoiceConstants";
import logo from "../../Assests/images/CompanyLogo.png";
import authentication from "react-azure-b2c";
import { isEmptyObject } from "jquery";
import { withRouter } from "react-router";
import { Link, useParams } from "react-router-dom";
import Moment from "moment";
import moment from "moment";

const invoiceURL = invoiceConstants.getInvoiceURL();
//const printConditionURL = commonConstants.getpPintConditionsURL();

class rptInvoice extends React.Component {
  constructor(props) {
    super(props);
    this.token = authentication.getAccessToken().accessToken; //get token
    //this.printConditions = this.getPrintConditions().bind();
    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    const InvoiceId = window.location.href.split("/")[5];
    const id = InvoiceId.split()[1];
    console.log("id :" + InvoiceId);
    console.log("url" + invoiceURL);
    axios({
      method: "GET",
      url: invoiceURL + "/GetInvoiceById/" + InvoiceId,
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

  renderInvoiceLines() {
    if (
      this.state.data !== undefined &&
      this.state.data !== null &&
      this.state.data.length !== 0
    ) {
      return this.state.data.invoiceLines.map((line) => {
        return (
          <tr key={line.id}>
            <td>{line.item.itemCode}</td>
            <td>{line.item.itemName}</td>
            <td>{line.description}</td>
            <td>{line.itemValue.toLocaleString()}</td>
            <td>{line.quantity}</td>
          </tr>
        );
      });
    }
  }

  // getPrintConditions(){
  //   return (
  //     axios({
  //         "method": "GET",
  //         "url": printConditionURL
  //     })
  //         .then((response) => {
  //            // setinvoiceResponseData(response.data)
  //         })
  //         .catch((error) => {
  //             console.log(error)
  //         })
  // );
  // }

  render() {
    var invInterest =
      this.state.data.totalInterest === undefined
        ? 0
        : this.state.data.totalInterest;
    var invTotal =
      this.state.data.invoiceTotal === undefined
        ? 0
        : this.state.data.invoiceTotal;

    // console.log("invoice id: " + id);

    return (
      <>
        <div className="container btnPrint">
          <ReactToPrint
            trigger={() => {
              return (
                <a className="waves-effect waves-light btn-small" href="#">
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
          {/*Upper part*/}
          {/*header*/}
          <div className="row">
            <div className="col s2">
              <img src={logo} alt="Company Logo" />
            </div>
            <div
              className="col s6"
              style={{ marginLeft: "-50px", marginTop: "15px" }}
            >
              <div
                className="card-content black-text"
                style={{ fontSize: "10pt", marginTop: "-20px" }}
              >
                <div>
                  <h5>
                    <b>BMS PAWNING CENTER </b>
                  </h5>
                </div>
                <div style={{ marginTop: "-13px" }}>
                  <p>
                    <b>Dambulla Road, Melsiripura</b>
                    <br></br>
                    <b>077 607 0096 / 070 607 0096</b>
                  </p>
                </div>
              </div>
            </div>
            <div
              className="col s4"
              style={{ textAlign: "right", float: "right", marginTop: "-5px" }}
            >
              <div style={{ fontSize: "13pt" }}>
                <p>
                  <b>
                    DATE :
                    <span>
                      {" "}
                      {moment(this.state.data.invoiceDate).format("MM/DD/YYYY")}
                    </span>
                  </b>
                </p>
              </div>
              <div style={{ marginTop: "-18px" }}>
                <h5>PAWN INVOICE</h5>
              </div>
              <div style={{ marginTop: "-10px" }}>
                Print Date : {moment(Date()).format("YYYY-MM-DD hh:mm:ss A")}
              </div>
            </div>
          </div>

          {/*Codes div*/}
          <div
            className="row"
            style={{
              borderTop: "solid ",
              borderBottom: "solid ",
              paddingTop: "-10px",
              borderWidth: "thin",
              fontSize: "12pt",
              fontWeight: "bold",
              textAlign: "center",
              marginTop: "-10px",
            }}
          >
            <div
              className="col s3"
              style={{ borderRight: "solid", borderWidth: "thin" }}
            >
              Customer Details
            </div>
            <div
              className="col s3"
              style={{ borderRight: "solid", borderWidth: "thin" }}
            >
              {this.state.data.customer === undefined
                ? ""
                : this.state.data.customer.customerCode}
            </div>
            <div
              className="col s3"
              style={{ borderRight: "solid", borderWidth: "thin" }}
            >
              Invoice Details
            </div>
            <div className="col s3">{this.state.data.invoiceNumber}</div>
          </div>

          {/*Detail div*/}
          <div
            className="row"
            style={{ fontSize: "11pt", marginTop: "-25px", padding: "0px" }}
          >
            <div
              className="col s6"
              style={{
                borderRight: "solid",
                borderWidth: "thin",
                padding: "0px",
              }}
            >
              <div className="col s12" style={{ marginTop: "10px" }}>
                <div className="col s6">Name (නම)</div>
                <div className="col s6">
                  :{" "}
                  {this.state.data.customer === undefined
                    ? ""
                    : this.state.data.customer.fname}{" "}
                  {this.state.data.customer === undefined
                    ? ""
                    : this.state.data.customer.lName}
                </div>
                <div className="col s6">NIC (ජා.හැ)</div>
                <div className="col s6">
                  :{" "}
                  {this.state.data.customer === undefined
                    ? ""
                    : this.state.data.customer.nic}
                </div>
                <div className="col s6">Phone #1 (දුරකථන අංක 1)</div>
                <div className="col s6">
                  :{" "}
                  {this.state.data.customer === undefined
                    ? ""
                    : this.state.data.customer.contact1}
                </div>
                <div className="col s6">Phone #2 (දුරකථන අංක 2)</div>
                <div className="col s6">
                  :{" "}
                  {this.state.data.customer === undefined
                    ? ""
                    : this.state.data.customer.contact2}
                </div>
                <div className="col s6">Address (ලිපිනය)</div>
                <div className="col s6">
                  :{" "}
                  {this.state.data.customer === undefined
                    ? ""
                    : this.state.data.customer.addressLine1}
                  ,
                  {this.state.data.customer === undefined
                    ? ""
                    : this.state.data.customer.addressLine2}
                  ,<br></br>
                  {this.state.data.customer === undefined
                    ? ""
                    : this.state.data.customer.addressLine3}
                </div>
              </div>
              <div
                className="col s12"
                style={{
                  padding: "0px",
                  fontSize: "11pt",
                }}
              >
                <div
                  style={{
                    borderBottom: "solid",
                    borderWidth: "thin",
                    paddingLeft: "5px",
                  }}
                >
                  <h6>
                    <b>Pawned Items</b>
                  </h6>
                </div>
                <table id="tblInvLines">
                  <thead>
                    <tr>
                      <th>ItemCode</th>
                      <th>ItemName</th>
                      <th>Description</th>
                      <th>Advance</th>
                      <th>Qty</th>
                    </tr>
                  </thead>
                  <tbody id="invLines" style={{ fontSize: "11px" }}>
                    {this.renderInvoiceLines()}
                  </tbody>
                </table>
              </div>
              <div
                className="col s12"
                style={{
                  fontSize: "8pt",
                  // marginTop: "70px",
                  borderTop: "solid",
                  borderBottom: "solid",
                  borderWidth: "thin",
                }}
              >
                <div>
                  <p>
                    *I mortgage the goods gold jewellary which belongs to me at
                    BMS pawing center at Dambulla road,Melsiripura agreeing to
                    the conditions overleaf and put my usual signature below.
                  </p>
                  <p>
                    * මැල්සිරිපුර දඹුල්ල පාරේ BMS Pawing Center උකස්
                    මධ්‍යස්ථානයේ මට අයිති රන් භාණ්ඩ මම කොන්දේසිවලට එකඟව උකස් කර,
                    මගේ සුපුරුදු අත්සන පහතින් තබමි.
                  </p>
                </div>
              </div>
              <div
                className="col s12"
                style={{
                  borderBottom: "solid",
                  borderWidth: "thin",
                  fontSize: "8pt",
                  paddingTop: "10px",
                }}
              >
                <div className="col s4" style={{verticleAlign: "bottom"}}>
                  <p>
                    ............................
                    <br></br>
                    Estimated By
                  </p>
                </div>
                <div className="col s4"></div>
                <div className="col s4">
                  <p>
                    ............................
                    <br></br>
                    Approved by
                  </p>
                </div>
              </div>
              <div className="col s12" style={{ fontSize: "11pt", paddingBottom: "10px" }}>
                උකස් අත්තිකාරම් :
              </div>
            </div>

            <div
              className="col s6"
              style={{
                //borderRight: "solid",
                borderWidth: "thin",
                padding: "0px",
                fontSize: "11pt",
              }}
            >
              <div
                className="col s12"
                style={{
                  //borderRight: "solid",

                  padding: "0px",
                }}
              >
                <div style={{ marginTop: "0px" }}>
                  <table>
                    <tr>
                      <th style={{ border: "solid", borderWidth: "thin" }}>
                        <div>Credit period (Months)</div>
                        <br></br>
                        <div style={{ marginTop: "15px" }}>ණය කාලය (මාස)</div>
                      </th>
                      <td
                        style={{
                          border: "solid",
                          borderWidth: "thin",
                          textAlign: "right",
                        }}
                      >
                        {this.state.data.creditPeriod}
                      </td>
                    </tr>
                    <tr>
                      <th style={{ border: "solid", borderWidth: "thin" }}>
                        <div>Monthly Interest Rate(%)</div>
                        <br></br>
                        <div style={{ marginTop: "15px" }}>
                          පොලී අනුපාතය මාසිකව (%)
                        </div>
                      </th>
                      <td
                        style={{
                          border: "solid",
                          borderWidth: "thin",
                          textAlign: "right",
                        }}
                      >
                        {(this.state.data.interestRate / 12).toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <th style={{ border: "solid", borderWidth: "thin" }}>
                        <div>Total Gold Weight (gram)</div>
                        <br></br>
                        <div style={{ marginTop: "15px" }}>
                          මුළු රන් බර (ග්‍රෑම්)
                        </div>
                      </th>
                      <td
                        style={{
                          border: "solid",
                          borderWidth: "thin",
                          textAlign: "right",
                        }}
                      >
                        {this.state.data.totalWeight}
                      </td>
                    </tr>
                    <tr>
                      <th style={{ border: "solid", borderWidth: "thin" }}>
                        <div>Net Gold Weight (gram)</div>
                        <br></br>
                        <div style={{ marginTop: "15px" }}>
                          ශුද්ධ රන් බර (ග්‍රෑම්)
                        </div>
                      </th>
                      <td
                        style={{
                          border: "solid",
                          borderWidth: "thin",
                          textAlign: "right",
                        }}
                      >
                        {(this.state.data.totalNetWeight / 1).toFixed(4)}
                      </td>
                    </tr>
                    <tr>
                      <th style={{ border: "solid", borderWidth: "thin" }}>
                        <div>Assessed value (LKR)</div>
                        <br></br>
                        <div style={{ marginTop: "15px" }}>
                          තක්සේරු වටිනාකම (රුපියල්)
                        </div>
                      </th>
                      <td
                        style={{
                          border: "solid",
                          borderWidth: "thin",
                          textAlign: "right",
                        }}
                      >
                        {this.state.data.estimatedValue}
                      </td>
                    </tr>
                    <tr>
                      <th style={{ border: "solid", borderWidth: "thin" }}>
                        <div>Market value (LKR)</div>
                        <br></br>
                        <div style={{ marginTop: "15px" }}>
                          වෙළඳපල වටිනාකම (රුපියල්)
                        </div>
                      </th>
                      <td
                        style={{
                          border: "solid",
                          borderWidth: "thin",
                          textAlign: "right",
                        }}
                      >
                        {this.state.data.marketValue}
                      </td>
                    </tr>
                    <tr>
                      <th style={{ border: "solid", borderWidth: "thin" }}>
                        <div>Advance value (LKR)</div>
                        <br></br>
                        <div style={{ marginTop: "15px" }}>
                          අත්තිකාරම් වටිනාකම (රුපියල්)
                        </div>
                      </th>
                      <td
                        style={{
                          border: "solid",
                          borderWidth: "thin",
                          textAlign: "right",
                        }}
                      >
                        {this.state.data.advance}
                      </td>
                    </tr>
                    <tr>
                      <th style={{ border: "solid", borderWidth: "thin" }}>
                        <div>Monthly Interest (LKR)</div>
                        <br></br>
                        <div style={{ marginTop: "15px" }}>
                          පොලී මුදල මාසිකව (රුපියල්)
                        </div>
                      </th>
                      <td
                        style={{
                          border: "solid",
                          borderWidth: "thin",
                          textAlign: "right",
                        }}
                      >
                        {(this.state.data.totalInterest / 12).toFixed(2)}
                      </td>
                    </tr>
                    <tr style={{ border: "none", borderWidth: "thin" }}>
                      <th style={{ borderRight: "solid", borderWidth: "thin" }}>
                        <div>ගණන : .................................</div>
                      </th>
                      <td style={{ border: "none", borderWidth: "thin" }}>
                        <div style={{ marginLeft: "49px" }}>
                          <div style={{ marginTop: "30px" }}>
                            ..........................................
                          </div>
                          <div style={{ marginTop: "13px" }}>
                            pawner(උකස්කරු)
                          </div>
                        </div>
                      </td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/*2nd Section*/}
          <div
            id="invReport"
            className="container"
            style={{ marginTop: "76px" }}
          >

    {/*header*/}
    <div className="row">
            <div className="col s2">
              <img src={logo} alt="Company Logo" />
            </div>
            <div
              className="col s6"
              style={{ marginLeft: "-50px", marginTop: "15px" }}
            >
              <div
                className="card-content black-text"
                style={{ fontSize: "10pt", marginTop: "-20px" }}
              >
                <div>
                  <h5>
                    <b>BMS PAWNING CENTER </b>
                  </h5>
                </div>
                <div style={{ marginTop: "-13px" }}>
                  <p>
                    <b>Dambulla Road, Melsiripura</b>
                    <br></br>
                    <b>077 607 0096 / 070 607 0096</b>
                  </p>
                </div>
              </div>
            </div>
            <div
              className="col s4"
              style={{ textAlign: "right", float: "right", marginTop: "-5px" }}
            >
              <div style={{ fontSize: "13pt" }}>
                <p>
                  <b>
                    DATE :
                    <span>
                      {" "}
                      {moment(this.state.data.invoiceDate).format("MM/DD/YYYY")}
                    </span>
                  </b>
                </p>
              </div>
              <div style={{ marginTop: "-18px" }}>
                <h5>PAWN INVOICE</h5>
              </div>
              <div style={{ marginTop: "-10px" }}>
                Print Date : {moment(Date()).format("YYYY-MM-DD hh:mm:ss A")}
              </div>
            </div>
          </div>

          {/*Codes div*/}
          <div
            className="row"
            style={{
              borderTop: "solid ",
              borderBottom: "solid ",
              paddingTop: "-10px",
              borderWidth: "thin",
              fontSize: "12pt",
              fontWeight: "bold",
              textAlign: "center",
              marginTop: "-10px",
            }}
          >
            <div
              className="col s3"
              style={{ borderRight: "solid", borderWidth: "thin" }}
            >
              Customer Details
            </div>
            <div
              className="col s3"
              style={{ borderRight: "solid", borderWidth: "thin" }}
            >
              {this.state.data.customer === undefined
                ? ""
                : this.state.data.customer.customerCode}
            </div>
            <div
              className="col s3"
              style={{ borderRight: "solid", borderWidth: "thin" }}
            >
              Invoice Details
            </div>
            <div className="col s3">{this.state.data.invoiceNumber}</div>
          </div>

          {/*Detail div*/}
          <div
            className="row"
            style={{ fontSize: "11pt", marginTop: "-25px", padding: "0px" }}
          >
            <div
              className="col s6"
              style={{
                borderRight: "solid",
                borderWidth: "thin",
                padding: "0px",
              }}
            >
              <div className="col s12" style={{ marginTop: "10px" }}>
                <div className="col s6">Name (නම)</div>
                <div className="col s6">
                  :{" "}
                  {this.state.data.customer === undefined
                    ? ""
                    : this.state.data.customer.fname}{" "}
                  {this.state.data.customer === undefined
                    ? ""
                    : this.state.data.customer.lName}
                </div>
                <div className="col s6">NIC (ජා.හැ)</div>
                <div className="col s6">
                  :{" "}
                  {this.state.data.customer === undefined
                    ? ""
                    : this.state.data.customer.nic}
                </div>
                <div className="col s6">Phone #1 (දුරකථන අංක 1)</div>
                <div className="col s6">
                  :{" "}
                  {this.state.data.customer === undefined
                    ? ""
                    : this.state.data.customer.contact1}
                </div>
                <div className="col s6">Phone #2 (දුරකථන අංක 2)</div>
                <div className="col s6">
                  :{" "}
                  {this.state.data.customer === undefined
                    ? ""
                    : this.state.data.customer.contact2}
                </div>
                <div className="col s6">Address (ලිපිනය)</div>
                <div className="col s6">
                  :{" "}
                  {this.state.data.customer === undefined
                    ? ""
                    : this.state.data.customer.addressLine1}
                  ,
                  {this.state.data.customer === undefined
                    ? ""
                    : this.state.data.customer.addressLine2}
                  ,<br></br>
                  {this.state.data.customer === undefined
                    ? ""
                    : this.state.data.customer.addressLine3}
                </div>
              </div>
              <div
                className="col s12"
                style={{
                  padding: "0px",
                  fontSize: "11pt",
                }}
              >
                <div
                  style={{
                    borderBottom: "solid",
                    borderWidth: "thin",
                    paddingLeft: "5px",
                  }}
                >
                  <h6>
                    <b>Pawned Items</b>
                  </h6>
                </div>
                <table id="tblInvLines">
                  <thead>
                    <tr>
                      <th>ItemCode</th>
                      <th>ItemName</th>
                      <th>Description</th>
                      <th>Advance</th>
                      <th>Qty</th>
                    </tr>
                  </thead>
                  <tbody id="invLines" style={{ fontSize: "11px" }}>
                    {this.renderInvoiceLines()}
                  </tbody>
                </table>
              </div>
              <div
                className="col s12"
                style={{
                  fontSize: "8pt",
                  // marginTop: "70px",
                  borderTop: "solid",
                  borderBottom: "solid",
                  borderWidth: "thin",
                }}
              >
                <div>
                  <p>
                    *I mortgage the goods gold jewellary which belongs to me at
                    BMS pawing center at Dambulla road,Melsiripura agreeing to
                    the conditions overleaf and put my usual signature below.
                  </p>
                  <p>
                    * මැල්සිරිපුර දඹුල්ල පාරේ BMS Pawing Center උකස්
                    මධ්‍යස්ථානයේ මට අයිති රන් භාණ්ඩ මම කොන්දේසිවලට එකඟව උකස් කර,
                    මගේ සුපුරුදු අත්සන පහතින් තබමි.
                  </p>
                </div>
              </div>
              <div
                className="col s12"
                style={{
                  borderBottom: "solid",
                  borderWidth: "thin",
                  fontSize: "8pt",
                  paddingTop: "10px",
                }}
              >
                <div className="col s4" style={{verticleAlign: "bottom"}}>
                  <p>
                    ............................
                    <br></br>
                    Estimated By
                  </p>
                </div>
                <div className="col s4"></div>
                <div className="col s4">
                  <p>
                    ............................
                    <br></br>
                    Approved by
                  </p>
                </div>
              </div>
              <div className="col s12" style={{ fontSize: "11pt", paddingBottom: "10px" }}>
                උකස් අත්තිකාරම් :
              </div>
            </div>

            <div
              className="col s6"
              style={{
                //borderRight: "solid",
                borderWidth: "thin",
                padding: "0px",
                fontSize: "11pt",
              }}
            >
              <div
                className="col s12"
                style={{
                  //borderRight: "solid",

                  padding: "0px",
                }}
              >
                <div style={{ marginTop: "0px" }}>
                  <table>
                    <tr>
                      <th style={{ border: "solid", borderWidth: "thin" }}>
                        <div>Credit period (Months)</div>
                        <br></br>
                        <div style={{ marginTop: "15px" }}>ණය කාලය (මාස)</div>
                      </th>
                      <td
                        style={{
                          border: "solid",
                          borderWidth: "thin",
                          textAlign: "right",
                        }}
                      >
                        {this.state.data.creditPeriod}
                      </td>
                    </tr>
                    <tr>
                      <th style={{ border: "solid", borderWidth: "thin" }}>
                        <div>Monthly Interest Rate(%)</div>
                        <br></br>
                        <div style={{ marginTop: "15px" }}>
                          පොලී අනුපාතය මාසිකව (%)
                        </div>
                      </th>
                      <td
                        style={{
                          border: "solid",
                          borderWidth: "thin",
                          textAlign: "right",
                        }}
                      >
                        {(this.state.data.interestRate / 12).toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <th style={{ border: "solid", borderWidth: "thin" }}>
                        <div>Total Gold Weight (gram)</div>
                        <br></br>
                        <div style={{ marginTop: "15px" }}>
                          මුළු රන් බර (ග්‍රෑම්)
                        </div>
                      </th>
                      <td
                        style={{
                          border: "solid",
                          borderWidth: "thin",
                          textAlign: "right",
                        }}
                      >
                        {this.state.data.totalWeight}
                      </td>
                    </tr>
                    <tr>
                      <th style={{ border: "solid", borderWidth: "thin" }}>
                        <div>Net Gold Weight (gram)</div>
                        <br></br>
                        <div style={{ marginTop: "15px" }}>
                          ශුද්ධ රන් බර (ග්‍රෑම්)
                        </div>
                      </th>
                      <td
                        style={{
                          border: "solid",
                          borderWidth: "thin",
                          textAlign: "right",
                        }}
                      >
                        {(this.state.data.totalNetWeight / 1).toFixed(4)}
                      </td>
                    </tr>
                    <tr>
                      <th style={{ border: "solid", borderWidth: "thin" }}>
                        <div>Assessed value (LKR)</div>
                        <br></br>
                        <div style={{ marginTop: "15px" }}>
                          තක්සේරු වටිනාකම (රුපියල්)
                        </div>
                      </th>
                      <td
                        style={{
                          border: "solid",
                          borderWidth: "thin",
                          textAlign: "right",
                        }}
                      >
                        {this.state.data.estimatedValue}
                      </td>
                    </tr>
                    <tr>
                      <th style={{ border: "solid", borderWidth: "thin" }}>
                        <div>Market value (LKR)</div>
                        <br></br>
                        <div style={{ marginTop: "15px" }}>
                          වෙළඳපල වටිනාකම (රුපියල්)
                        </div>
                      </th>
                      <td
                        style={{
                          border: "solid",
                          borderWidth: "thin",
                          textAlign: "right",
                        }}
                      >
                        {this.state.data.marketValue}
                      </td>
                    </tr>
                    <tr>
                      <th style={{ border: "solid", borderWidth: "thin" }}>
                        <div>Advance value (LKR)</div>
                        <br></br>
                        <div style={{ marginTop: "15px" }}>
                          අත්තිකාරම් වටිනාකම (රුපියල්)
                        </div>
                      </th>
                      <td
                        style={{
                          border: "solid",
                          borderWidth: "thin",
                          textAlign: "right",
                        }}
                      >
                        {this.state.data.advance}
                      </td>
                    </tr>
                    <tr>
                      <th style={{ border: "solid", borderWidth: "thin" }}>
                        <div>Monthly Interest (LKR)</div>
                        <br></br>
                        <div style={{ marginTop: "15px" }}>
                          පොලී මුදල මාසිකව (රුපියල්)
                        </div>
                      </th>
                      <td
                        style={{
                          border: "solid",
                          borderWidth: "thin",
                          textAlign: "right",
                        }}
                      >
                        {(this.state.data.totalInterest / 12).toFixed(2)}
                      </td>
                    </tr>
                    <tr style={{ border: "none", borderWidth: "thin" }}>
                      <th style={{ borderRight: "solid", borderWidth: "thin" }}>
                        <div>ගණන : .................................</div>
                      </th>
                      <td style={{ border: "none", borderWidth: "thin" }}>
                        <div style={{ marginLeft: "49px" }}>
                          <div style={{ marginTop: "30px" }}>
                            ..........................................
                          </div>
                          <div style={{ marginTop: "13px" }}>
                            pawner(උකස්කරු)
                          </div>
                        </div>
                      </td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>
          </div>


          </div>
        </div>
      </>
    );
  }
}

// import React from 'react';
// import '../../Assests/css/CustomCss/Report.css';

// class invoiceReport extends React.Component{
//   render(){
//       return(
//         <div className='container'>
//           <div className='row' id='invReport'>
//             <div className='col-4'>addddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddaaa</div>
//             <div className='col-4'>aaaa</div>
//           </div>
//         </div>
//       );
//   }
// }

export default rptInvoice;
