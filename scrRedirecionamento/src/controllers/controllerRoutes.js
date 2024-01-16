const axios = require('axios');

const index = async(req,res) => {
    try {
      const { url, headers = {}, body = {}, method, contentType } = req.body;

      if (!url || !method) {
        return res.status(400).json({ error: 'Requisição inválida.' });
      }

      let response;
      switch (method.toUpperCase()) {
        case 'GET':
          response = await axios.get(url, {
            headers,
            maxRedirects: 0,
            responseType: 'arraybuffer', // Set responseType to 'arraybuffer' for GET requests
            validateStatus: (status) => status >= 200 && status < 400
          });
          break;
        case 'POST':
          headers['Content-Type'] = contentType || 'application/json';
          response = await axios.post(url, body, {
            headers,
            responseType: 'arraybuffer', // Set responseType to 'arraybuffer' for POST requests
            validateStatus: (status) => status >= 200 && status < 400
          });
          break;
        default:
          throw new Error('Método inválido');
      }

      if (response.status >= 300 && response.status < 400 && response.headers.location) {
        const redirectUrl = response.headers.location;
        const redirectResponse = await axios.get(redirectUrl, {
          headers,
          maxRedirects: 0,
          responseType: 'arraybuffer', // Set responseType to 'arraybuffer' for redirect GET requests
          validateStatus: (status) => status >= 200 && status < 400
        });
        return res.status(redirectResponse.status).send(redirectResponse.data);
      }

      res.set(response.headers); // Use res.set instead of res.setHeader
      if (contentType == 'application/pdf') {
      const blob = Buffer.from(response.data, 'binary'); // Convert the response data to a Buffer
      return res.status(response.status).send(blob);
      }else{
        return res.status(response.status).send(response.data)
      }
      
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const response = error.response || {};
        const errorData = response.data || response.statusText || response.request || error.message || 'Erro interno no servidor';
        return res.status(response.status || 500).json({ error: errorData });
      }

      return res.status(400).json({ error: error.message });
    }
}


module.exports = {
    index: index
}