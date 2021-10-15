const roteador = require('./roteador');
const app = require('./servidor');
app.use(roteador);
app.listen(3000);
