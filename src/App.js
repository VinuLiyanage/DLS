import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';
import React from 'react';
import './Assests/css/materialize.min.css';
import './Assests/css/CustomCss/Main.css';

import Home from './Components/Main/Home';
import SideBar from './Components/Main/SideBar';
import Customers from './Components/Customers/CustomersList';
import Items from './Components/Items/ItemsList';
import Invoices from './Components/Invoices/InvoicesList';
import Receipts from './Components/Receipts/ReceiptsList';
import Claim from './Components/Claim/Claim';

import InvoiceReport from './Components/Reports/rptInvoice';
import ReceiptReport from './Components/Reports/rptReceipt';
import PrintConditions from './Components/Reports/PrintConditions';

function App(){
  return (
    <div>
      <BrowserRouter>
        <SideBar />
        <main>
          <Routes>
            <Route path="/" element = {<Home/>}/>   
            <Route path="/Customers" element={<Customers />} />
            <Route path="/Items" element={<Items />} />
            <Route path="/Invoices" element={<Invoices />} />
            <Route path="/Receipts" element={<Receipts />} />
            <Route path="/Claim" element={<Claim />} />
            <Route path="/PrintConditions" element={<PrintConditions />} />

            <Route path="/Invoice/Print/:id" element={<InvoiceReport />} />
            <Route path="/Receipt/Print/:id" element={<ReceiptReport />} />
            {/* <Route path="/test" element = {<Test/>}/>               */}
            {/* <Route path="/Studentslist/:ID" children = {<Studentslist/>}></Route>  */}
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;
