
const { Configuration, OpenAIApi } = require("openai");
const express = require("express")
const configuration = new Configuration({
    organization: "org-Knw8izOVnXv3GlButBqJ5VWs",
    apiKey: process.env.apiKey,
});
const openai = new OpenAIApi(configuration);

// create a simple express api that calls the function above
const app = express();
const cors = require("cors")
const bodyParser = require("body-parser")
app.use(bodyParser.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }))
const port = 3001;

app.post("/", async(req, res) => {
    const { message, currentModel } = req.body;
    console.log("received message: ", message)
    console.log("current model: ", currentModel)

    const response = await openai.createCompletion({
        model: currentModel === 'default'? "text-davinci-003" : currentModel,
        prompt:`${message}`,
        max_tokens: 100,
        temperature: 0.5,
    });
    if (response.data.choices[0].text) {
        res.json({
            message: response.data.choices[0].text
        })
    }
    else {
        res.json({
            message: response.data.error.message
        })
    }

})

app.get("/models", async(req, res) => {
    const response = await openai.listEngines();
    // console.log("response", response.data.data)
    res.json({
        models: response.data.data
    })
})

app.listen(port, ()=> {
    console.log(`Example app listening at http://localhost:${port}`)
})
