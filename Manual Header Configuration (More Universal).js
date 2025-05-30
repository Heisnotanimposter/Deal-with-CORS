// server.js (or your main Express app file)
const express = require('express');
const app = express();
const PORT = 5000;

// --- Place CORS configuration BEFORE your routes ---

app.use((req, res, next) => {
    // 1. Configure allowed origins
    const allowedOrigins = ['http://localhost:5173', 'https://www.your-production-frontend.com']; // Your frontend URL(s)
    const origin = req.headers.origin; // Get the origin from the request header

    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    // Alternatively, for development only, or if you explicitly need to allow all (DANGEROUS IN PROD):
    // res.setHeader('Access-Control-Allow-Origin', '*');

    // 2. Allow specific HTTP methods
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

    // 3. Allow specific headers that your client might send
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With'); // Add any custom headers your client uses

    // 4. Allow credentials (e.g., cookies, authorization tokens) to be sent
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    // 5. Handle pre-flight OPTIONS requests explicitly
    // The browser sends an OPTIONS request first to check CORS policy
    if (req.method === 'OPTIONS') {
        res.sendStatus(200); // Respond with 200 OK for pre-flight, then the browser sends the actual request
    } else {
        next(); // Continue to the next middleware or route handler for actual requests
    }
});

// --- After CORS configuration, ensure JSON body parsing if needed ---
app.use(express.json({ limit: '25mb' }));

// --- Your API routes go here (same as above) ---
app.get('/greet', (req, res) => {
    res.status(200).json({ message: 'Hello from the API!' });
});

app.post('/greetme', (req, res) => {
    const { name } = req.body;
    if (name) {
        res.status(200).json({ message: `Hello, ${name}!` });
    } else {
        res.status(400).json({ message: 'Name is required in the request body.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
