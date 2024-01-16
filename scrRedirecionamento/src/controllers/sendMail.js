const path = require("path")
const { createTransport } = require("nodemailer")
const hbs = require("nodemailer-express-handlebars")
require("dotenv").config()

module.exports = (email, subject, template, filename, buffer) => {
    const host = process.env.HOST_MAIL
    const port = Number(process.env.PORT_MAIL)
    const user = process.env.USER_MAIL
    const from = process.env.USERNAME_MAIL
    const pass = process.env.PASSWORD_MAIL

    return new Promise((resolve, reject) => {
        try{
            const transport = createTransport({
                host: host,
                port: port,
                secure: false,
                auth: {
                    user: user,
                    pass: pass
                }
            })
        
            const options = {
                from: from,
                to: email,
                subject: subject,
                template: template,
                attachments: [
                    {
                        filename: filename,
                        content: buffer
                    }
                ]
            }
            
            transport.use('compile', hbs({
                viewEngine: {
                    extname: ".handlebars",
                    partialsDir: String(path.resolve(__dirname,`../template/`)),
                    defaultLayout: false
                },
                viewPath: String(path.resolve(__dirname,`../template/`)),
                extName: ".handlebars"
            }))
        
            transport.sendMail(options,function(err,info){
                if(err) reject(err.message)  
                else resolve(`Foi enviado um email para ${email}, com sucesso!`)
                
            })

        }catch(e){
            console.log(`Error: ${e.message}`)
            return reject(e.message)
        }
    })
}
