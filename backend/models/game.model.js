import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
    gameName: {
        type: String,
        required: false,
    },
    // Add other fields as necessary
});

const Game = mongoose.model("Game", gameSchema);

export default Game;