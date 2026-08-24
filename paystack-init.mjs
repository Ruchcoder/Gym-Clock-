export default async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed",{status:405});
  try {
    if(!process.env.PAYSTACK_SECRET_KEY) return Response.json({error:"PAYSTACK_SECRET_KEY is not configured"},{status:503});
    const {email,amount,items,userId}=JSON.parse(req.body||"{}");
    if(!email || !amount) return Response.json({error:"Email and amount are required"},{status:400});
    const origin=new URL(req.url).origin;
    const r=await fetch("https://api.paystack.co/transaction/initialize",{
      method:"POST",headers:{Authorization:`Bearer ${process.env.PAYSTACK_SECRET_KEY}`,"Content-Type":"application/json"},
      body:JSON.stringify({email,amount:Math.round(Number(amount)*100),callback_url:`${origin}/?payment=complete`,metadata:{userId,items}})
    });
    const data=await r.json();
    if(!r.ok || !data.status) return Response.json({error:data.message||"Paystack initialization failed"},{status:400});
    return Response.json({authorization_url:data.data.authorization_url,reference:data.data.reference});
  }catch(e){return Response.json({error:e.message||"Payment initialization failed"},{status:500});}
};
