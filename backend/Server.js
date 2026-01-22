import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";
import { ConfidentialClientApplication } from "@azure/msal-node";


// Middleware

dotenv.config();

const app = express();
app.use(express.json());


const allowedOrigins = [
    'http://localhost:3000',      
    'http://localhost:5173',      
    'http://localhost:4028',
    'https://veeba-customer-portal-frontend.onrender.com'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));

const msalConfig = {
    auth: {
        clientId: process.env.BC_CLIENT_ID?.trim(),
        authority: `https://login.microsoftonline.com/${process.env.BC_TENANT_ID?.trim()}`,
        clientSecret: process.env.BC_CLIENT_SECRET?.trim(),
    },
};
const cca = new ConfidentialClientApplication(msalConfig);

async function getToken() {
    const tokenResponse = await cca.acquireTokenByClientCredential({
        scopes: ["https://api.businesscentral.dynamics.com/.default"],
    });
    // console.log("TOKENN RESPONSE:  ", tokenResponse.accessToken)
    return tokenResponse.accessToken;
}

app.all("/api/*path", async (req, res) => {
    try {
        const token = await getToken();

        const fullPath = req.originalUrl.replace('/api/', '');
        console.log(fullPath);

        const bcUrl = `${process.env.BC_BASE_URL}/v2.0/${process.env.BC_TENANT_ID}/${process.env.BC_ENVIRONMENT}/api/${fullPath}`;

        console.log("Backend URL: ", bcUrl);

        // Forward request to Business Central
        const response = await axios({
            method: req.method,
            url: bcUrl,
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
            data: req.body,
        });

        console.log("Backend response: ", response.data);

        res.json(response.data);
    } catch (err) {
        res.status(err.response?.status || 500).json({
            error: "Failed to fetch from Business Central",
            details: err.response?.data || err.message,
        });
    }
});

// Test route
app.get("/", (req, res) => {
    res.send("Backend is running 🚀");
});

// Start server

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
