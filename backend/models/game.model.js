import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
    gameName: {
        type: String,
        required: true,
    },
    // Add other fields as necessary
});

const Game = mongoose.model("Game", gameSchema);

export default Game;