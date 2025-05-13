import { MongoClient, ServerApiVersion } from "mongodb";

// Convert MONGO_TLS to boolean
const tlsEnabled: boolean =false; // Explicit conversion

// Connection URI with environment variables
//const uri: string = `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@localhost:27017`;
const uri: string = `mongodb://${"testkarl"}:${"testkarl123"}@${"localhost:27017"}`;
// const uri = "mongodb://localhost:27017";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
export const mongoDBClient = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
	// ✅ Enable TLS if needed
	tlsAllowInvalidCertificates: tlsEnabled,
	tls: tlsEnabled,

	// ✅ Increase timeouts to handle network fluctuations
	connectTimeoutMS: 30000, // 30 sec to establish a connection
	socketTimeoutMS: 60000, // 60 sec for socket operations
	serverSelectionTimeoutMS: 15000, // 15 sec to find a server
	heartbeatFrequencyMS: 10000, // Send heartbeats every 10s

	// ✅ Connection Pooling (reuse instead of reconnecting)
	minPoolSize: 10, // Keep at least 10 connections
	maxPoolSize: 100, // Limit max connections
	maxIdleTimeMS: 60000, // Close idle connections after 60 sec

	// ✅ Retry Mechanisms for Better Stability
	retryWrites: true, // Auto-retry failed writes
	retryReads: true, // Auto-retry failed reads
	timeoutMS: 20000, // 30 sec for operations
	waitQueueTimeoutMS: 5000, // 5 sec for waiting for a connection
	

	// ✅ Automatic Compression (reduces network usage)
});