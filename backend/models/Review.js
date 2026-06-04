const mongoose=require('mongoose');
const s=new mongoose.Schema({productId:{type:mongoose.Schema.Types.ObjectId,ref:'Product',default:null},userId:{type:mongoose.Schema.Types.ObjectId,ref:'User',default:null},name:{type:String,required:true},email:{type:String,default:''},rating:{type:Number,required:true,min:1,max:5},comment:{type:String,required:true},isApproved:{type:Boolean,default:false},isGeneral:{type:Boolean,default:false},createdAt:{type:Date,default:Date.now}});
module.exports=mongoose.model('Review',s);
