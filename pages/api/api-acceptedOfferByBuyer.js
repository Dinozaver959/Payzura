import middleware from '../../middleware/middleware'
import nextConnect from 'next-connect'
import { UpdateContracts_ContractAcceptedByBuyer, UpdateUserParticipationData } from '../../JS/DB-pushFunctions';

const DOMPurify = require('isomorphic-dompurify');

const apiRoute = nextConnect()
apiRoute.use(middleware)


apiRoute.post(async (req, res) => {
    console.log(req.body)
    console.log(req.files)

    const BuyerAccount = DOMPurify.sanitize(req.body.BuyerAccount[0].toString());
    const BuyerWallet = DOMPurify.sanitize(req.body.BuyerWallet[0].toString());
    const SellerWallet = DOMPurify.sanitize(req.body.SellerWallet[0].toString());
    const objectId = DOMPurify.sanitize(req.body.objectId[0].toString());
    const transactionHash = DOMPurify.sanitize(req.body.transactionHash[0].toString());
    const PersonalizedOffer = DOMPurify.sanitize(req.body.PersonalizedOffer[0].toString());

    console.log("BuyerAccount: " + BuyerAccount);
    console.log("BuyerWallet: " + BuyerWallet);
    console.log("SellerWallet: " + SellerWallet);
    console.log("objectId: " + objectId);
    console.log("transactionHash: " + transactionHash);
    console.log("PersonalizedOffer: " + PersonalizedOffer);
    
    await UpdateContracts_ContractAcceptedByBuyer(BuyerAccount, BuyerWallet, objectId, transactionHash);
    
    if(PersonalizedOffer == "false") {
        await UpdateUserParticipationData(BuyerWallet, "ContractsAcceptedAsBuyer");
        await UpdateUserParticipationData(BuyerWallet, "ContractsInvolvedAsBuyer");
        await UpdateUserParticipationData(SellerWallet, "ContractsInvolvedAsSeller");        
    } else {
        await UpdateUserParticipationData(BuyerWallet, "PersonalizedContractsAcceptedAsBuyer");
        await UpdateUserParticipationData(BuyerWallet, "PersonalizedContractsInvolvedAsBuyer");
        await UpdateUserParticipationData(SellerWallet, "PersonalizedContractsInvolvedAsSeller"); 
    }

    res.status(201).end("Offer created");
})

export const config = {
    api: {
        bodyParser: false
    }
}

export default apiRoute

