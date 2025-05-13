import app from "./app";


const port: number = 8085;
const hostname: string = 'localhost'


app.listen({ port }, async () => {
    console.log(`DecentrAgri HTTP server is running on port http://${hostname}:${port}/`);
    }
);