const mongoose=require('mongoose');
const s=new mongoose.Schema({title:{type:String,required:true},company:{type:String,default:''},platform:{type:String,required:true},platformIcon:{type:String,default:'🔗'},description:{type:String,default:''},url:{type:String,required:true},referralUrl:{type:String,default:''},tags:[{type:String}],location:{type:String,default:'Remote'},jobType:{type:String,default:'Freelance'},salary:{type:String,default:''},postedAt:{type:Date,default:Date.now},externalId:{type:String,default:''},isActive:{type:Boolean,default:true},source:{type:String,default:'rss'},createdAt:{type:Date,default:Date.now}});
s.index({url:1},{unique:true});
module.exports=mongoose.model('AutoJob',s);
