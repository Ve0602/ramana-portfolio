const mongoose=require('mongoose');
const s=new mongoose.Schema({section:{type:String,required:true,unique:true},data:{type:mongoose.Schema.Types.Mixed,required:true},updatedAt:{type:Date,default:Date.now}});
module.exports=mongoose.model('Portfolio',s);
