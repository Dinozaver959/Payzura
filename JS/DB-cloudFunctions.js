var Moralis = require("moralis/node");

const serverUrl = "https://fordrbswdskl.usemoralis.com:2053/server";
const appId = "8AGWP86FEWcfCRwNLa0LGffGPs5kpcHxqRpEp4PF";
Moralis.start({ serverUrl, appId });



//-----------------------------------------------------------------------------------------------
//                                  Contract created by Seller
//-----------------------------------------------------------------------------------------------


export async function GetPublicOffers(){
    return Moralis.Cloud.run("GetPublicOffers");
}

export async function GetPersonalizedOffers(UserWallet){
    const params =  { UserWallet : UserWallet };
    return Moralis.Cloud.run("GetPersonalizedOffers", params);
}



//-----------------------------------------------------------------------------------------------
//                                  Contract created by Buyer
//-----------------------------------------------------------------------------------------------


export async function GetPublicOffers_CreatedByBuyer_await_seller_accepts_ALL(){
    return Moralis.Cloud.run("GetPublicOffers_CreatedByBuyer_await_seller_accepts_ALL");
}

export async function GetPublicOffers_CreatedByBuyer_await_seller_accepts(UserWallet){
    const params =  { UserWallet : UserWallet };
    return Moralis.Cloud.run("GetPublicOffers_CreatedByBuyer_await_seller_accepts", params);
}

export async function GetPublicOffers_CreatedByBuyer_buyer_initialized(UserWallet){
    const params =  { UserWallet : UserWallet };
    return Moralis.Cloud.run("GetPublicOffers_CreatedByBuyer_buyer_initialized", params);
}


export async function GetPublicOffers_CreatedByBuyer_buyer_initialized_and_paid(UserWallet){
    const params =  { UserWallet : UserWallet };
    return Moralis.Cloud.run("GetPublicOffers_CreatedByBuyer_buyer_initialized_and_paid", params);
}



//------------------------------------------------------------------------------------------------
//                    Later Stage of Contracts - Common for both initiators
//------------------------------------------------------------------------------------------------


export async function GetDisputesToManage(UserWallet){
    const params =  { UserWallet : UserWallet };
    return Moralis.Cloud.run("GetDisputesToManage", params);
}

export async function GetUsersAgreements(UserWallet){
    const params =  { UserWallet : UserWallet };
    return Moralis.Cloud.run("GetUsersAgreements", params);
}

export async function GetUsersAgreementsOnlyBuyer(UserWallet){
    const params =  { UserWallet : UserWallet };
    return Moralis.Cloud.run("GetUsersAgreementsOnlyBuyer", params);
}

export async function GetUsersAgreementsOnlySeller(UserWallet){
    const params =  { UserWallet : UserWallet };
    return Moralis.Cloud.run("GetUsersAgreementsOnlySeller", params);
}

export async function GetUsersDetails(UserWallet){
    const params =  { UserWallet : UserWallet };
    return Moralis.Cloud.run("GetUsersDetails", params);
}
