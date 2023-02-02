import expresss,  { Express} from "express";
import sslRouter from './router/sslRouter'
const app:Express=expresss()


app.use("/", sslRouter)
app.listen(8080)