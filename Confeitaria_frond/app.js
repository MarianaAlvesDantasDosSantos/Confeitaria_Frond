const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const categoriasRouter = require('./routes/categorias');
const clientesRouter = require('./routes/clientes');
const produtosRouter = require('./routes/produtos');
const pedidosRouter = require('./routes/pedidos');

app.get('/', (req, res) => res.redirect('/categorias'));

app.use('/categorias', categoriasRouter);
app.use('/clientes', clientesRouter);
app.use('/produtos', produtosRouter);
app.use('/pedidos', pedidosRouter);

app.use((req, res) => {
  res.status(404).render('erro', { mensagem: 'Página não encontrada.' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render('erro', { mensagem: err.message || 'Erro interno.' });
});

app.listen(PORT, () => {
  console.log(`Frontend rodando em http://localhost:${PORT}`);
});