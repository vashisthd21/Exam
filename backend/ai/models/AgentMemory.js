import mongoose from "mongoose";

const agentMemorySchema = new mongoose.Schema(
{
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        unique:true
    },

    weakTopics:[
        {
            topic:String,
            accuracy:Number,
            lastSuggested:Date
        }
    ],

    revisedTopics:[
        {
            topic:String,
            revisedAt:Date
        }
    ],

    ignoredTopics:[
        {
            topic:String,
            count:{
                type:Number,
                default:0
            }
        }
    ],

    motivationHistory:[
        String
    ],

    currentStreak:{
        type:Number,
        default:0
    },

    lastRecommendation:{
        type:String,
        default:null
    }

},
{
    timestamps:true
});

export default mongoose.model("AgentMemory",agentMemorySchema);