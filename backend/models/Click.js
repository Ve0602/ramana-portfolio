const mongoose=require('mongoose');
const s=new mongoose.Schema({referralId:{type:mongoose.Schema.Types.ObjectId,ref:'Referral',required:true},platform:{type:String},userId:{type:mongoose.Schema.Types.ObjectId,ref:'User',default:null},userEmail:{type:String,default:'anonymous'},ip:{type:String},clickedAt:{type:Date,default:Date.now}});
module.exports=mongoose.model('Click',s);
