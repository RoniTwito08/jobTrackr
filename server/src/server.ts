import app, { connectDB } from "./app";
import http from "http";

const PORT = process.env.PORT;
const server = http.createServer(app);
connectDB()
  .then(async () => {
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Server faild to start", error);
    process.exit(1);
  });
