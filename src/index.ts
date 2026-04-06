import express from "express";
import subjectsRouter from "./routes/subjects";
import cors from "cors";

const app = express();
const PORT = 8000;

// --- CORS origin validation ---
const NODE_ENV = process.env.NODE_ENV ?? "development";
const DEV_FALLBACK = "http://localhost:3000";

const rawFrontendUrl = process.env.FRONTEND_URL;
let allowedOrigin: string;

if (!rawFrontendUrl) {
  if (NODE_ENV === "development") {
    console.warn(
      `[CORS] FRONTEND_URL is not set. Falling back to dev default: ${DEV_FALLBACK}`,
    );
    allowedOrigin = DEV_FALLBACK;
  } else {
    console.error(
      "[CORS] FRONTEND_URL environment variable is required in non-development environments. " +
        "Set it to the URL of your frontend (e.g. https://yourapp.com). Exiting.",
    );
    process.exit(1);
  }
} else {
  allowedOrigin = rawFrontendUrl;
}

console.log(`[CORS] Allowed origin: ${allowedOrigin}`);

app.use(
  cors({
    origin: allowedOrigin,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.use(express.json());

app.use("/api/subjects", subjectsRouter);

app.get("/", (req, res) => {
  res.send("Hello, welcome to the Classroom API!");
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
