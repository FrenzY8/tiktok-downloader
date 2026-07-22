import express from "express";
import downloadRoute from "./routes/download.js";
import watchRoute from "./routes/watch.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api", downloadRoute);
app.use("/api", watchRoute);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});