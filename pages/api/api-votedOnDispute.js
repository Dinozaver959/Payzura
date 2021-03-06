import middleware from '../../middleware/middleware'
import nextConnect from 'next-connect'
import { UpdateContracts_EndDispute, UpdateUserParticipationData } from '../../JS/DB-pushFunctions';


const DOMPurify = require('isomorphic-dompurify');

const apiRoute = nextConnect()
apiRoute.use(middleware)

apiRoute.post(async (req, res) => {
    console.log(req.body)
    console.log(req.files)

    const ArbiterAccount = DOMPurify.sanitize(req.body.ArbiterAccount[0].toString());
    const ArbiterWallet = DOMPurify.sanitize(req.body.ArbiterWallet[0].toString());
    const BuyerWallet = DOMPurify.sanitize(req.body.BuyerWallet[0].toString());
    const SellerWallet = DOMPurify.sanitize(req.body.SellerWallet[0].toString());
    const objectId = DOMPurify.sanitize(req.body.objectId[0].toString());
    const votedForBuyer = DOMPurify.sanitize(req.body.votedForBuyer[0].toString());
    const ArbitersVoteConcluded = DOMPurify.sanitize(req.body.ArbitersVoteConcluded[0].toString());

    console.log("ArbiterAccount: " + ArbiterAccount);
    console.log("ArbiterWallet: " + ArbiterWallet);
    console.log("BuyerWallet: " + BuyerWallet);
    console.log("SellerWallet: " + SellerWallet);
    console.log("objectId: " + objectId);
    console.log("votedForBuyer: " + votedForBuyer);
    console.log("ArbitersVoteConcluded: " + ArbitersVoteConcluded);


    if(votedForBuyer == "true"){
        await UpdateUserParticipationData(ArbiterWallet, "DisputesVotedForBuyer");
    } else {
        await UpdateUserParticipationData(ArbiterWallet, "DisputesVotedForSeller");
    }

    // change state the 'complete'
    if(ArbitersVoteConcluded == "true"){   
        await UpdateContracts_EndDispute(objectId);

        if(votedForBuyer == "true"){
            await UpdateUserParticipationData(BuyerWallet, "DisputesWon");
        } else {
            await UpdateUserParticipationData(SellerWallet, "DisputesWon");
        }

    }

    res.status(201).end("Offer created");
})

export const config = {
    api: {
        bodyParser: false
    }
}

export default apiRoute

