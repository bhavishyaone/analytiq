import mongoose from "mongoose";

const eventSchema =  new mongoose.Schema({
    projectId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Project',
        required:true
    },
    name:{
        type:String,
        required:true,
        trim:true
    },
    userId:{
        type:String,
        default:null
    },

    properties:{
        type:Object,
        default:{}
    },
    timestamp: {
    type: Date,
    default: Date.now
    }
},
    {timestamps:true}
);

eventSchema.index({ projectId: 1, timestamp: -1 });
eventSchema.index({ projectId: 1, name: 1 });
eventSchema.index({ projectId: 1, userId: 1 });

export default mongoose.model('Event', eventSchema);
