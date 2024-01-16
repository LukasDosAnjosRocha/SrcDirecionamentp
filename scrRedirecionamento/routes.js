const express = require("express");
const router = express.Router();
const pdfPage = require('./src/controllers/pdf');
const defaultRoutes = require("./src/controllers/controllerRoutes");

router.all("/" , defaultRoutes.index)

router.post("/relatorioMovimentos", pdfPage.relatorioMovimentoCompletoPdf)
router.post("/relatorioResumido", pdfPage.relatorioMovimentoResumidoPdf)


module.exports = router