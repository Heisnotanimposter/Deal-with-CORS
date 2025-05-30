//#npm install cors
//# or
//#yarn add cors

// server.js (or your main Express application file)
const express = require('express');
const cors = require('cors'); // Import the cors package
const app = express();
const PORT = 5000;

// --- Place CORS configuration BEFORE your routes ---

// A. The Dangerous (but quick) Way: Allow ALL origins
// app.use(cors());
// This configuration sets `Access-Control-Allow-Origin: *`, allowing requests from *any* domain.
// While it solves the error immediately, it's highly INSECURE for production environments
// as it makes your API vulnerable to potential cross-site attacks. AVOID in production.

// B. The Secure Way: Allow Specific Origin(s) (Recommended for production)
const allowedOrigins = ['http://localhost:5173', 'https://www.your-production-frontend.com']; // Your frontend URL(s)
// You can dynamically set this based on environment variables for different environments.

app.use(cors({
    origin: function (origin, callback) {
        // Check if the request origin is in our allowed list,
        // or if it's undefined (common for same-origin requests or non-browser clients like Postman/Insomnia).
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true); // Allow the request
        } else {
            callback(new Error('Not allowed by CORS')); // Block the request
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Explicitly allow common HTTP methods
    credentials: true, // Crucial if your frontend sends cookies or authorization headers
    optionsSuccessStatus: 204 // Recommended status for pre-flight (OPTIONS) requests
}));

// If you only have ONE specific origin and don't need complex whitelist logic:
// app.use(cors({ origin: 'http://localhost:5173' }));


// --- After CORS configuration, ensure JSON body parsing if needed ---
app.use(express.json({ limit: '25mb' })); // Middleware to parse JSON request bodies
// The `limit` option sets the maximum request body size (default is 100kb).
// Adjust `25mb` based on your application's requirements (e.g., for file uploads).

// --- Your API routes go here ---
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

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
