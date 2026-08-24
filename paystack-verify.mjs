import admin from "firebase-admin";

function firebaseAdmin(){
  if(admin.apps.length) return admin.app();
  const raw=process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if(!raw) throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON is not configured");
  return admin.initializeApp({credential:admin.credential.cert(JSON.parse(raw))});
}
export default async (req)=>{
  if(req.method!=="POST") return new Response("Method not allowed",{status:405});
  try{
    if(!process.env.PAYSTACK_SECRET_KEY) return Response.json({error:"PAYSTACK_SECRET_KEY is not configured"},{status:503});
    const {reference,userId}=JSON.parse(req.body||"{}");
    if(!reference) return Response.json({error:"Reference is required"},{status:400});
    const r=await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,{headers:{Authorization:`Bearer ${process.env.PAYSTACK_SECRET_KEY}`}});
    const data=await r.json();
    if(!r.ok || data.data?.status!=="success") return Response.json({success:false,status:data.data?.status||"failed"},{status:400});
    if(userId && process.env.FIREBASE_SERVICE_ACCOUNT_JSON){
      const app=firebaseAdmin();
      await admin.firestore().collection("users").doc(userId).collection("orders").doc(reference).set({reference,amount:data.data.amount/100,currency:data.data.currency,status:"success",paidAt:admin.firestore.FieldValue.serverTimestamp(),items:data.data.metadata?.items||null},{merge:true});
    }
    return Response.json({success:true,reference,amount:data.data.amount/100,currency:data.data.currency});
  }catch(e){return Response.json({error:e.message||"Payment verification failed"},{status:500});}
};
