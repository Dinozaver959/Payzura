import Link from "next/link";
import React, { useState, useEffect, Fragment } from "react";
import { IconContext } from "react-icons";

import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { MdKeyboardArrowUp } from "react-icons/md";
import { MdKeyboardArrowDown } from "react-icons/md";

import { styled } from "@mui/material/styles";
import Moralis from "moralis";
import {
  GetWallet_NonMoralis,
  ReturnPayment_Moralis,
  ClaimFunds_Moralis,
  StartDispute_Moralis,
  ConfirmDelivery_Moralis,
} from "../JS/local_web3_Moralis";
import Navigation from "../components/Navigation.js";
import Button from "../components/ui/Button";
import PlaceholderIc from "./../components/icons/Placeholder";

const StyledTableRow = styled(TableRow)({
  //'&:nth-of-type(odd)': {
  //  backgroundColor: "#343a3f",
  //  color: "white", // useless
  //},
  // hide last border
  //'&:last-child td, &:last-child th': {
  //  border: 0,
  //},
});

const StyledTableCell = styled(TableCell)({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#4F575D",
    color: "white",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,

    backgroundColor: "#343a3f",
    color: "white",
  },

  /*
  backgroundColor: "#343a3f",
  color: "white",
*/
});

const StyledInnerTableCell = styled(TableCell)({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#4F575D",
    color: "white",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,

    backgroundColor: "#4F575D",
    color: "white",
  },

  /*
  backgroundColor: "#343a3f",
  color: "white",
*/
});

function wrapArbiters(wallets){
  if(!wallets){return "Payzura Platform"}
  else {
    return wallets.replaceAll(",", "\n");
  }
}

function wrapDelegates(wallets){
  if(!wallets){return ""}
  else {
    return wallets.replaceAll(",", "\n");
  }
}


export default function MyAgreements() {

  const [data, setData] = useState([]);

  // load options using API call
  async function getCollectionsDetails() {
    const connectedAddress = await GetWallet_NonMoralis();
    // const data = await fetch(`./api/api-getUserAgreements`)   /// append user wallet
    const data = await fetch(
      `./api/api-getUserAgreements` + "?UserWallet=" + connectedAddress
    )
      .then((res) => res.json())
      .then((json) => setData(json));

    console.log(data);

    return data;
  }

  // Calling the function on component mount
  useEffect(() => {
    getCollectionsDetails();
  }, []);

  return (
    <Fragment>
      <Navigation
        darkMode={props.darkMode}
        changeDarkMode={props.changeDarkMode}
        dropdownOpen={props.dropdownOpen}
        setDropdownOpen={props.setDropdownOpen}
        OpenDropdownFn={props.OpenDropdownFn}
      />

      <div className="containerMain">
        <div className="pageHeader">
          <h1>My Agreements</h1>
        </div>

        <div className="card mt-10">
          <div className="cardHeader">
            <div className="cardTitle">
              <h2>List of Agreements</h2>
            </div>
          </div>

          <div className="cardBody">
            {data && data[0] ? (
              <>
                <Table_normal data={data} />
              </>
            ) : (
              <div className="noData">
                <i>
                  <PlaceholderIc />
                </i>
                <h2>There are no Agreements.</h2>
                <div className="submitButtonOuter">
                  <Button
                    link="/createOffer"
                    classes={"button primary rounded"}
                  >
                    <span>Create Offer Now</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
}

function Table_normal(props) {
  const { data } = props;

  return (
    <>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <StyledTableRow>
              <StyledTableCell />
              <StyledTableCell>Title</StyledTableCell>
              <StyledTableCell>State</StyledTableCell>
              <StyledTableCell>Price (ETH)</StyledTableCell>
              <StyledTableCell>Time to Deliver (hours)</StyledTableCell>
              <StyledTableCell>Return Payment</StyledTableCell>
              <StyledTableCell>Claim Funds</StyledTableCell>
              <StyledTableCell>Start Dispute</StyledTableCell>
              <StyledTableCell>Confirm Delivery</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {data.map((item) => (
              <Row_normal key={item.id} item={item.name} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <p id="submitFeedback" hidden></p>
    </>
  );
}

function Row_normal(props) {
  const { item } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <StyledTableRow sx={{ '& > *': { borderBottom: 'unset'} }}>

          <StyledTableCell>
          <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
          >
              <IconContext.Provider value={{ color: "white" }} >                {/*  specify the color for the arrow */}
              {open ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
              </IconContext.Provider>
          </IconButton>
          </StyledTableCell>
          <StyledTableCell component="th" scope="row">
            {item.OfferTitle}
          </StyledTableCell>
          <StyledTableCell>{item.State}</StyledTableCell>
          <StyledTableCell>{item.Price}</StyledTableCell>
          <StyledTableCell>{item.TimeToDeliver}</StyledTableCell>



                  var formData = new FormData();
                  formData.append("BuyerAccount", Moralis.User.current().id);

          <StyledTableCell>
            <input className={styles.interactButton} type="submit" value="Return Payment (seller)" onClick={() => 
              ReturnPayment_Moralis(item.index)
              .then(async (transactionHash) => {

                // show the feedback text 
                document.getElementById('submitFeedback').style.display = 'inline';
                document.getElementById('submitFeedback').innerText = 'Returning payment...'

                var formData = new FormData();
                formData.append('BuyerAccount', (Moralis.User.current()).id);

                const connectedAddress = await GetWallet_NonMoralis();
                formData.append('BuyerWallet', connectedAddress);
                formData.append('transactionHash', transactionHash);
                formData.append('objectId', item.objectId);

                var xhr = new XMLHttpRequest();
                xhr.open('POST', '/api/api-returnPayment', false);                                                // new API required
                xhr.onload = function () {
                  // update the feedback text 
                  document.getElementById('submitFeedback').style.display = 'inline';
                  document.getElementById('submitFeedback').innerText = 'Payment returned'

                  // prevent the Submit button to be clickable and functionable
                  // removeHover()
                  // document.getElementById('SubmitButton').disabled = true

                  // think about also removing the hover effect
                  // you can create a seperate class for the hover (can be reused on other elements as well) and just remove the hover class from this element
                  console.log("Payment returned")
                };
                xhr.send(formData);
              })
              .catch((error) => {
                console.error(error);
                console.log("accept Offer error code: " + error.code);
                console.log("accept Offer error message: " + error.message);
                if(error.data && error.data.message){document.getElementById('submitFeedback').innerText = error.data.message;}
                else {document.getElementById('submitFeedback').innerText = error.message;}    
                document.getElementById('submitFeedback').style.visibility = "visible";
                process.exitCode = 1;
              })
            }></input>
          </StyledTableCell>

          <StyledTableCell>
            <input className={styles.interactButton} type="submit" value="Claim funds (seller)" onClick={() => 
              ClaimFunds_Moralis(item.index)
              .then(async (transactionHash) => {

                // show the feedback text 
                document.getElementById('submitFeedback').style.display = 'inline';
                document.getElementById('submitFeedback').innerText = 'Claiming Funds...'

                var formData = new FormData();
                formData.append('BuyerAccount', (Moralis.User.current()).id);

                const connectedAddress = await GetWallet_NonMoralis();
                formData.append('BuyerWallet', connectedAddress);
                formData.append('transactionHash', transactionHash);
                formData.append('objectId', item.objectId);

                var xhr = new XMLHttpRequest();
                xhr.open('POST', '/api/api-claimFunds', false);                                                // new API required
                xhr.onload = function () {
                  // update the feedback text 
                  document.getElementById('submitFeedback').style.display = 'inline';
                  document.getElementById('submitFeedback').innerText = 'Funds claimed'

                  // prevent the Submit button to be clickable and functionable
                  // removeHover()
                  // document.getElementById('SubmitButton').disabled = true

                  // think about also removing the hover effect
                  // you can create a seperate class for the hover (can be reused on other elements as well) and just remove the hover class from this element
                  console.log("Funds claimed")
                };
                xhr.send(formData);
              })
              .catch((error) => {
                console.error(error);
                console.log("accept Offer error code: " + error.code);
                console.log("accept Offer error message: " + error.message);
                if(error.data && error.data.message){document.getElementById('submitFeedback').innerText = error.data.message;}
                else {document.getElementById('submitFeedback').innerText = error.message;}    
                document.getElementById('submitFeedback').style.visibility = "visible";
                process.exitCode = 1;
              })
            }></input>
          </StyledTableCell>

          <StyledTableCell>
            <input className={styles.interactButton} type="submit" value="Start Dispute (buyer)" onClick={() => 
              StartDispute_Moralis(item.index)
              .then(async (transactionHash) => {

                // show the feedback text 
                document.getElementById('submitFeedback').style.display = 'inline';
                document.getElementById('submitFeedback').innerText = 'Starting Dispute...'

                var formData = new FormData();
                formData.append('BuyerAccount', (Moralis.User.current()).id);

                const connectedAddress = await GetWallet_NonMoralis();
                formData.append('BuyerWallet', connectedAddress);
                formData.append('SellerWallet', item.SellerWallet);
                formData.append('transactionHash', transactionHash);
                formData.append('objectId', item.objectId);

                var xhr = new XMLHttpRequest();
                xhr.open('POST', '/api/api-startDispute', false);                                                // new API required
                xhr.onload = function () {
                  // update the feedback text 
                  document.getElementById('submitFeedback').style.display = 'inline';
                  document.getElementById('submitFeedback').innerText = 'Dispute started'

                  // prevent the Submit button to be clickable and functionable
                  // removeHover()
                  // document.getElementById('SubmitButton').disabled = true

                  // think about also removing the hover effect
                  // you can create a seperate class for the hover (can be reused on other elements as well) and just remove the hover class from this element
                  console.log("Dispute started")
                };
                xhr.send(formData);
              })
              .catch((error) => {
                console.error(error);
                console.log("accept Offer error code: " + error.code);
                console.log("accept Offer error message: " + error.message);
                if(error.data && error.data.message){document.getElementById('submitFeedback').innerText = error.data.message;}
                else {document.getElementById('submitFeedback').innerText = error.message;}    
                document.getElementById('submitFeedback').style.visibility = "visible";
                process.exitCode = 1;
              })
            }></input>
          </StyledTableCell>

          <StyledTableCell>
            <input className={styles.interactButton} type="submit" value="Confirm Delivery (buyer)" onClick={() => 
              ConfirmDelivery_Moralis(item.index)
              .then(async (transactionHash) => {

                // show the feedback text 
                document.getElementById('submitFeedback').style.display = 'inline';
                document.getElementById('submitFeedback').innerText = 'Confirming Delivery...'

                var formData = new FormData();
                formData.append('BuyerAccount', (Moralis.User.current()).id);

                const connectedAddress = await GetWallet_NonMoralis();
                formData.append('BuyerWallet', connectedAddress);
                formData.append('transactionHash', transactionHash);
                formData.append('objectId', item.objectId);

                var xhr = new XMLHttpRequest();
                xhr.open('POST', '/api/api-confirmDelivery', false);                                                // new API required
                xhr.onload = function () {
                  // update the feedback text 
                  document.getElementById('submitFeedback').style.display = 'inline';
                  document.getElementById('submitFeedback').innerText = 'Delivery confirmed'

                  // prevent the Submit button to be clickable and functionable
                  // removeHover()
                  // document.getElementById('SubmitButton').disabled = true

                  // think about also removing the hover effect
                  // you can create a seperate class for the hover (can be reused on other elements as well) and just remove the hover class from this element
                  console.log("Delivery confirmed")
                };
                xhr.send(formData);
              })
              .catch((error) => {
                console.error(error);
                console.log("accept Offer error code: " + error.code);
                console.log("accept Offer error message: " + error.message);
                if(error.data && error.data.message){document.getElementById('submitFeedback').innerText = error.data.message;}
                else {document.getElementById('submitFeedback').innerText = error.message;}    
                document.getElementById('submitFeedback').style.visibility = "visible";
                process.exitCode = 1;
              })
            }></input>
          </StyledTableCell>
      </StyledTableRow>

      
      <StyledTableRow>
        <StyledTableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
        <Collapse in={open} timeout="auto" unmountOnExit>            
          <Box sx={{ margin: 1 }}>
          <Table size="small" aria-label="details">
            <TableBody>

              <TableRow>
                <StyledInnerTableCell></StyledInnerTableCell>
                <StyledInnerTableCell>Description</StyledInnerTableCell>
                <StyledInnerTableCell>{item.OfferDescription}</StyledInnerTableCell>
              </TableRow>

              <TableRow>
                <StyledInnerTableCell></StyledInnerTableCell>
                <StyledInnerTableCell>Seller Wallet</StyledInnerTableCell>
                <StyledInnerTableCell>{item.SellerWallet}</StyledInnerTableCell>
              </TableRow>

              <TableRow>
                <StyledInnerTableCell></StyledInnerTableCell>
                <StyledInnerTableCell>Buyer Wallet</StyledInnerTableCell>
                <StyledInnerTableCell>{item.BuyerWallet}</StyledInnerTableCell>
              </TableRow>

              <TableRow>
                <StyledInnerTableCell></StyledInnerTableCell>
                <StyledInnerTableCell>Arbiters</StyledInnerTableCell>
                <StyledInnerTableCell>{wrapArbiters(item.Arbiters)}</StyledInnerTableCell>
              </TableRow>

              <TableRow>
                <StyledInnerTableCell></StyledInnerTableCell>
                <StyledInnerTableCell>BuyerDelegates</StyledInnerTableCell>
                <StyledInnerTableCell>{wrapDelegates(item.BuyerDelegates)}</StyledInnerTableCell>
                <StyledInnerTableCell>
                

                  {/*
                    Needs to be adjusted:  
                      1. Display addresses 1 per row - have the ability to click X to delete an array and add a new address with a plus
                      2. Create 2 arrays, 1 with addresses that were removed and 1 with addresses that were added
                      3. feed these 2 arrays for the function and for the push /api call
                  */}
                  <input className={styles.interactButton} type="submit" value="Update Buyer Delegates" onClick={() => 
                    UpdateDelegates_Moralis(item.index, true, "__array_DelegatesToAdd__", "__array_DelegatesToRemove__")        // UPDATE with real values                                                          // supply the arrays somehow
                    .then(async (transactionHash) => {

                      // show the feedback text 
                      document.getElementById('submitFeedback').style.display = 'inline';
                      document.getElementById('submitFeedback').innerText = 'Updating Delegates...'

                      var formData = new FormData();

                      const connectedAddress = await GetWallet_NonMoralis();
                      formData.append('BuyerWallet', connectedAddress);
                      formData.append('objectId', item.objectId);
                      formData.append('areForBuyer', "true");
                      formData.append('DelegatesToAdd', "______________________");      // array                                // UPDATE with real values 
                      formData.append('DelegatesToRemove', "______________________");   // array                                // UPDATE with real values 

                      var xhr = new XMLHttpRequest();
                      xhr.open('POST', '/api/api-updateDelegates', false);
                      xhr.onload = function () {

                        // update the feedback text 
                        document.getElementById('submitFeedback').style.display = 'inline';
                        document.getElementById('submitFeedback').innerText = 'Delegates updated'
                        console.log("Delegates updated")
                      };
                      xhr.send(formData);
                    })
                    .catch((error) => {
                      console.error(error);
                      console.log("update Delegates error code: " + error.code);
                      console.log("update Delegates error message: " + error.message);
                      if(error.data && error.data.message){document.getElementById('submitFeedback').innerText = error.data.message;}
                      else {document.getElementById('submitFeedback').innerText = error.message;}    
                      document.getElementById('submitFeedback').style.visibility = "visible";
                      process.exitCode = 1;
                    })
                  }></input>
                
                </StyledInnerTableCell>
              </TableRow>

              <TableRow>
                <StyledInnerTableCell></StyledInnerTableCell>
                <StyledInnerTableCell>SellerDelegates</StyledInnerTableCell>
                <StyledInnerTableCell>{wrapDelegates(item.SellerDelegates)}</StyledInnerTableCell>
                <StyledInnerTableCell>
                

                {/*
                  Needs to be adjusted:  
                    1. Display addresses 1 per row - have the ability to click X to delete an array and add a new address with a plus
                    2. Create 2 arrays, 1 with addresses that were removed and 1 with addresses that were added
                    3. feed these 2 arrays for the function and for the push /api call
                */}               
                <input className={styles.interactButton} type="submit" value="Update Seller Delegates" onClick={() => 
                  UpdateDelegates_Moralis(item.index, false, "__array_DelegatesToAdd__", "__array_DelegatesToRemove__")               // UPDATE with real values                                                     // supply the arrays somehow
                  .then(async (transactionHash) => {

                    // show the feedback text 
                    document.getElementById('submitFeedback').style.display = 'inline';
                    document.getElementById('submitFeedback').innerText = 'Updating Delegates...'

                    var formData = new FormData();

                    const connectedAddress = await GetWallet_NonMoralis();
                    formData.append('BuyerWallet', connectedAddress);
                    formData.append('objectId', item.objectId);
                    formData.append('areForBuyer', "false");
                    formData.append('DelegatesToAdd', "______________________");      // array                                      // UPDATE with real values 
                    formData.append('DelegatesToRemove', "______________________");   // array                                      // UPDATE with real values 

                    var xhr = new XMLHttpRequest();
                    xhr.open('POST', '/api/api-updateDelegates', false);
                    xhr.onload = function () {

                      // update the feedback text 
                      document.getElementById('submitFeedback').style.display = 'inline';
                      document.getElementById('submitFeedback').innerText = 'Delegates updated'
                      console.log("Delegates updated")
                    };
                    xhr.send(formData);
                  })
                  .catch((error) => {
                    console.error(error);
                    console.log("update Delegates error code: " + error.code);
                    console.log("update Delegates error message: " + error.message);
                    if(error.data && error.data.message){document.getElementById('submitFeedback').innerText = error.data.message;}
                    else {document.getElementById('submitFeedback').innerText = error.message;}    
                    document.getElementById('submitFeedback').style.visibility = "visible";
                    process.exitCode = 1;
                  })
                }></input>
              
              </StyledInnerTableCell>
              </TableRow>

            </TableBody>
          </Table>
          </Box>
        </Collapse>
        </StyledTableCell>
      </StyledTableRow>
    </React.Fragment>
  );
}
