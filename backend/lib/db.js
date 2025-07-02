import mongoose from "mongoose";
export let isUsingBackup = false;
export const connectDB = async () => {
	try {
		// Try connecting to PRIMARY
		const conn = await mongoose.connect(process.env.MONGO_URI);
		console.log(` MongoDB connected (PRIMARY): ${conn.connection.host}`);
	} catch (error) {
		console.warn("Primary DB failed. Trying BACKUP...");

		try {
			const conn = await mongoose.connect(process.env.BACKUP_MONGO_URI);
			isUsingBackup = true;
			console.log(` MongoDB connected (BACKUP): ${conn.connection.host}`);
		} catch (backupError) {
			console.error(" Failed to connect to both PRIMARY and BACKUP MongoDB.");
			console.error("Error:", backupError.message);
			process.exit(1); // or throw if you want to handle it elsewhere
		}
	}
};
