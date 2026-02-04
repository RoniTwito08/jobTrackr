import { Schema, Types ,Document} from "mongoose";
import mongoose  from "mongoose";

export interface IRefreshToken extends Document{
    userId : Types.ObjectId;
    token : string;
    expiresAt : Date;
    createdAt?:Date;
    updatedAt?:Date;
}

const refreshSchema = new Schema<IRefreshToken>(
   {
    userId:{
       type: Schema.Types.ObjectId
,
       ref: "User",
       required: true,

    },
    token:{
        type:String,
        required:true,
    },
    expiresAt:{
        type:Date,
        required:true,
    },
   },
    {
        timestamps:true
       
    }


);
refreshSchema.index({ token: 1 });
refreshSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model<IRefreshToken>("RefreshToken",refreshSchema);