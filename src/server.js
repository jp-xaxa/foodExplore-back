require("express-async-errors")
require("dotenv/config")

const express = require("express")
const cors = require("cors")

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 3333
app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}.`)
})
