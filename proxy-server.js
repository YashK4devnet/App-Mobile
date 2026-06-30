import express from "express";
import cors from "cors";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.post("/send_request", async (req, res) => {
  const { login, password, db } = req.headers;
  const apiKey = req.headers["api-key"];

  try {
    const response = await fetch(
      "https://erp.eduquity.com/send_request?model=venue.opening.check.list",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          login,
          password,
          db,
          "api-key": apiKey,
        },
        body: JSON.stringify(req.body), // ✅ correct
      }
    );

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Failed to reach ERP API" });
    }

    const data = await response.json();
    console.log("ERP Response:", data);

    res.json(data);
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).json({ error: "Proxy server error" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Proxy server running at http://localhost:${PORT}`);
});
