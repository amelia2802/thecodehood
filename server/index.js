import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:{
        rejectUnauthorized:false
    }
});

app.get("/",(req,res)=>{
    res.send("theCodehood API is running!");
})

app.post("/api/communities",async(req,res)=>{
    try{
        const{
            name,
            city,
            state,
            zip,
            country,
            type,
            description,
            isGlobal,
            website,
            contact
        } = req.body;

        if(!name || !country || !type || !website || !contact || 
            !["yes","no"].includes(isGlobal)
        ){
            return res.status(400).json({
                message: "Please provide all required fields"
            });
        }

        const query = `
            INSERT INTO communities
            (name,city,state,zip,country,type,description,is_global,website,contact)
            VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
            RETURNING *
        `;

        const values = [
            name,
            city || null,
            state || null,
            zip || null,
            country,
            type,
            description || null,
            isGlobal === "yes",
            website,
            contact
        ];

        const result = await pool.query(query, values);

        res.status(201).json({
            message:"Community saved successfully!",
            community: result.rows[0]
        });
    }
    catch(error){
        console.error("Database error",error);

        res.status(500).json({
            message:"Unable to save community."
        });
    }
});

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
});

app.get("/api/communities", async(req,res) => {
    try{
        const query = `
            SELECT * FROM communities ORDER BY created_at DESC
        `;

        const result = await pool.query(query);

        res.status(200).json(result.rows);
    }
    catch(error){
        console.error("Error fetching communities:",error);

        res.status(500).json({
            message: "Unable to fetch communities."
        })
    }
});