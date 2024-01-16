const path = require('path');
const puppeteer = require('puppeteer');
const handlebars = require('handlebars');
const moment = require('moment');
const fs = require('fs');
const cnpjFormat = require('cpf-cnpj-validator')
const sendMailAttachments = require('./sendMail');

const relatorioMovimentoCompletoPdf = async (req, res) => {
  try {
    const body = req.body

    if (Object.keys(body).length !== 0) {
      if (body.id != null && body.cliente != null && body.endereco != null && body.dataInicio != null && body.dataFim != null && body.municipio != null && body.uf != null && body.tel != null && body.email != null && body.compartilha != null && body.itens != null && body.itens.length != 0) {

        const source = fs.readFileSync(String(path.resolve(__dirname, `../template/completeReport.handlebars`)), 'utf-8');
        const scrImg = fs.readFileSync(path.join(__dirname, '../../assets/scr_Prancheta.png'), { encoding: 'base64' })

        handlebars.registerHelper('decimalNumber', function (arg1, options) {
          return options.fn(Number(arg1).toLocaleString('pt-BR', {minimumFractionDigits: 3}))
        })
        handlebars.registerHelper('formatDate', function (arg1, options) {
          return options.fn(moment(new Date(arg1)).format('DD/MM/YYYY'))
        })
        handlebars.registerHelper('formatCnpj', function (arg1, options) {
          return options.fn(cnpjFormat.cnpj.format(arg1))
        })

        const template = handlebars.compile(source);

        let id = String(body.id), cliente = String(body.cliente)

        title = 'Relatório movimentação de resíduos'
        filenaName = `${id} - ${cliente}.pdf`

        let data = {
          content: body,
          scrImg: scrImg
        }

        const html = template(data)


        const browser = await puppeteer.launch({
 	 executablePath: process.env.CHROME_EXECUTABLE_PATH, // Use an environment variable
 	 ignoreDefaultArgs: ['--disable-extensions'],
 	 headless: true, // Use headless mode
 	 args: ['--no-sandbox', '--disable-setuid-sandbox']
	});
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });
        await page.emulateMediaType('screen')
        const pdfBuffer = await page.pdf({
          printBackground: true,
          preferCSSPageSize: true,
          margin: {
            top: '30px',
            bottom: '10px'
          }
        });

        const bufferBinary = Buffer.from(pdfBuffer, 'binary')
        const bufferBase64 = `data:application/pdf;base64,${bufferBinary.toString('base64')}`

        await browser.close();

        if (body.compartilha) {
          await sendMailAttachments(String(body.email), title, 'index', filenaName, bufferBinary).then(item => res.send({ mail: item, pdfBuffer: bufferBase64 }))
        } else {
          res.send({ pdfBuffer: bufferBase64 })
        }

      } else {
        res.send({ message: "Parâmetros indefinidos. Tente novamente." })
      }
    } else {
      res.send({ message: "Sem parâmetros definidos." })
    }


  } catch (err) {
    console.error('Erro ao gerar o PDF:', err)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
}
const relatorioMovimentoResumidoPdf = async (req, res) => {
  try {
    const body = req.body

    if (Object.keys(body).length !== 0) {
      if (body.id != null && body.cliente != null && body.dataInicio != null && body.dataFim != null && body.municipio != null && body.uf != null && body.tel != null && body.email != null && body.compartilha != null && body.itens != null && body.itens.length != 0) {

        const source = fs.readFileSync(String(path.resolve(__dirname, `../template/resumeReport.handlebars`)), 'utf-8');
        const scrImg = fs.readFileSync(path.join(__dirname, '../../assets/scr_Prancheta.png'), { encoding: 'base64' })

        handlebars.registerHelper('decimalNumber', function (arg1, options) {
          return options.fn(Number(arg1).toLocaleString('pt-BR', {minimumFractionDigits: 3}))
        })
        handlebars.registerHelper('formatDate', function (arg1, options) {
          return options.fn(moment(new Date(arg1)).format('DD/MM/YYYY'))
        })
        handlebars.registerHelper('formatCnpj', function (arg1, options) {
          return options.fn(cnpjFormat.cnpj.format(arg1))
        })


        const template = handlebars.compile(source);

        let id = String(body.id), cliente = String(body.cliente)

        title = 'Relatório movimentação de resíduos'
        filenaName = `${id} - ${cliente}.pdf`

        let data = {
          content: body,
          scrImg: scrImg
        }

        const html = template(data)


        const browser = await puppeteer.launch({
 	 executablePath: process.env.CHROME_EXECUTABLE_PATH, // Use an environment variable
 	 ignoreDefaultArgs: ['--disable-extensions'],
 	 headless: true, // Use headless mode
 	 args: ['--no-sandbox', '--disable-setuid-sandbox']
	});
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });
        await page.emulateMediaType('screen')
        const pdfBuffer = await page.pdf({
          printBackground: true,
          preferCSSPageSize: true,
          margin: {
            top: '30px',
            bottom: '10px'
          }
        });

        const bufferBinary = Buffer.from(pdfBuffer, 'binary')
        const bufferBase64 = `data:application/pdf;base64,${bufferBinary.toString('base64')}`

        await browser.close();

        if (body.compartilha) {
          await sendMailAttachments(String(body.email), title, 'index', filenaName, bufferBinary).then(item => res.send({ mail: item, pdfBuffer: bufferBase64 }))
        } else {
          res.send({ pdfBuffer: bufferBase64 })
        }

      } else {
        res.send({ message: "Parâmetros indefinidos. Tente novamente." })
      }
    } else {
      res.send({ message: "Sem parâmetros definidos." })
    }


  } catch (err) {
    console.error('Erro ao gerar o PDF:', err)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

module.exports = {
  relatorioMovimentoCompletoPdf: relatorioMovimentoCompletoPdf,
  relatorioMovimentoResumidoPdf: relatorioMovimentoResumidoPdf
}