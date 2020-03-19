const GoogleSpreadSheet = require('google-spreadsheet')
const credentials = require('./bugtraker.json')
const {promisify} = require('util')//promissfy pega uma função, e retorna outra funcao
//todo metodo que é assincrono, é preferivel transformar em promisse

const addRowToSheet = async() => {
    const doc = new GoogleSpreadSheet('xxx')
    await promisify(doc.useServiceAccountAuth)(credentials)
    console.log('Planilha aberta')
    const info = await promisify(doc.getInfo)() //colocar await para poder pegar a funcao de retorno
    const worksheet = info.worksheets[0]
    await promisify(worksheet.addRow)({name:'teste', email:'teste@teste.com'})
}

addRowToSheet()



// doc.useServiceAccountAuth(credentials,(err)=>{
//     if(err){
//         console.log('Não foi possivel abrir a planilha')
//     }else{
//         console.log('Planilha aberta')
//         doc.getInfo((erro, info) =>{ //sempre vai vir err primeiro , pois é o callback padrão do node
//             const worksheet = info.worksheets[0]
//             worksheet.addRow({name:'teste', email:'teste@teste.com'}, err =>{
//                 console.log('Linha inserida')
//             })
//         })
//     }
// })
