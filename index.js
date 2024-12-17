const { obtenerJoyas, obtenerJoyasPorFiltros, prepararHATEOAS } = require('./consultas')
const express = require('express')
const app = express()
const cors = require('cors');

app.use(cors())
app.use(express.json())

app.get('/joyas', async (req, res) => {
    const queryStrings = req.query
    const joyas = await obtenerJoyas(queryStrings)
    const HATEOAS = await prepararHATEOAS(joyas)
    res.json(HATEOAS);
    })

app.get('/joyas/filtros', async (req, res) => {
    const queryStrings = req.query
    const joyas = await obtenerJoyasPorFiltros(queryStrings)
    res.json(joyas)
        })
        
    

app.listen(3000, console.log("¡Servidor encendido!"))