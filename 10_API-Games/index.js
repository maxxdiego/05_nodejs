import express from 'express'
import GameService from './services/GameService.js'
import mongoose from 'mongoose'
import {ObjectId} from 'mongodb'
import cors from 'cors'
const app = express()

app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cors())

// Iniciando conexão com o banco de dados do MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/games")

//Listando todos os Games
app.get("/games", (req,res) => {
    res.statusCode = 200 //Requisição feita com sucesso
    GameService.GetAll().then(games => {
        res.json(games)
    })
})

//Listando um único Game
app.get("/game/:id", (req,res) => {
    if(ObjectId.isValid(req.params.id)){
        const id = req.params.id
        GameService.GetOne(id).then(game => {
            if(game != undefined){
                res.statusCode = 200
                res.json(game)
            }else{
                res.sendStatus(404)
            }
        }) 
    }else{
        res.sendStatus(400) //Requisição inválida - Bad request
    }
})

//Cadastrando um Game
app.post("/game", (req,res) => {
    const {title, year, price} = req.body
    GameService.Create(title, year, price)
    res.sendStatus(200)
})

//Deletando um Game
app.delete("/game/:id", (req,res) => {
    if(ObjectId.isValid(req.params.id)){
        const id = req.params.id
        GameService.Delete(id)
        res.sendStatus(200)
    }else{
        res.sendStatus(400) //Bad request
    }
})

//Alterando um Game
app.put("/game/:id", (req,res) => {
    if(ObjectId.isValid(req.params.id)){
        const id = req.params.id
        let {title, price, year} = req.body
        GameService.Update(id, title, year, price)
        res.sendStatus(200)
    }else{
        res.sendStatus(400) //Requisição inválida - Bad request
    }
})

const port = 4000
app.listen(port,() => {
    console.log(`API rodando na porta ${port}.`)
})