const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const GoogleSpreadSheet = require('google-spreadsheet')
const credentials = require('./bugtraker.json')
const docId = 'xxx'
const sendGridKey = 'xxx'
const worksheetIndex = 0
const {promisify} = require('util')
const sgMail = require('@sendgrid/mail');
app.use( express.static( "public" ) );


app.use(bodyParser.urlencoded({extended:true}))
app.set('view engine', 'ejs')
app.set('views', path.resolve(__dirname, 'views'))

app.get('/', (request, response)=>{
    response.render('home')
})
app.post('/', async (request, response)=>{
    try{
        const doc = new GoogleSpreadSheet(docId)
        await promisify(doc.useServiceAccountAuth)(credentials)
        //uma coisa legal do async/await, é que se der erro internamente, já passa para o catc
        const info = await promisify(doc.getInfo)()
        const worksheet = info.worksheets[worksheetIndex]
        await promisify(worksheet.addRow)({name: request.body.name,
            email:request.body.email,
            issueType: request.body.issueType ,
            howToReproduce: request.body.howToReproduce,
            expectedOutput: request.body.expectedOutput,
            receivedOutput: request.body.receivedOutput,
            userAgent: request.body.userAgent,
            userDate: request.body.userDate,
            source: request.query.source || 'direct'
        })

        if(request.body.issueType === 'CRITICAL'){
            sgMail.setApiKey(sendGridKey)
            const msg = {
            to: 'lucasgkk372@gmail.com',
            from: 'lucasgkk372@gmail.com',
            subject: 'Bug reportado',
            text: `O usuário ${request.body.name} reportou um erro no sistema `,
            html: '<strong>Erro sistema</strong>',
            };
            await sgMail.send(msg);
        }

        response.render('sucess')
    }catch(err){
        response.send('Erro ao enviar formulário.')
        console.log(err)
    }
})
app.listen(3000, (err)=>{
    if(err){
        console.log('Aconteceu um erro', err)
    }else{
        console.log('BugTracker rodando na porta http://localhost:3000')
    }
})
