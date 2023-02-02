import expresss,  { Express, Request, Response } from "express";
import sslRouter from './router/sslRouter'
const app:Express=expresss()


app.get("/", sslRouter)
app.listen(8080)