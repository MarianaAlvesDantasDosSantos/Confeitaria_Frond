const express = require('express');
const router = express.Router();
const { clientes } = require('../services/api');

// Listagem
router.get('/', async (req, res, next) => {
  try {
    const lista = await clientes.listar();
    res.render('clientes/index', { lista });
  } catch (e) { next(e); }
});

// Form de cadastro
router.get('/novo', (req, res) => {
  res.render('clientes/form', { item: null });
});

// Criar
router.post('/novo', async (req, res, next) => {
  try {
    const dto = {
      clienteNome: req.body.clienteNome,
      clienteEmail: req.body.clienteEmail,
      clienteCpf: req.body.clienteCpf,
      clienteTelefone: req.body.clienteTelefone?.trim() || null,
      clienteDataCadastro: req.body.clienteDataCadastro
    };
    await clientes.criar(dto);
    res.redirect('/clientes');
  } catch (e) { next(e); }
});

// Form de edição
router.get('/editar/:id', async (req, res, next) => {
  try {
    const item = await clientes.obter(req.params.id);
    res.render('clientes/form', { item });
  } catch (e) { next(e); }
});

// Atualizar
router.post('/editar/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const dto = {
      clienteId: id,
      clienteNome: req.body.clienteNome,
      clienteEmail: req.body.clienteEmail,
      clienteCpf: req.body.clienteCpf,
      clienteTelefone: req.body.clienteTelefone?.trim() || null,
      clienteDataCadastro: req.body.clienteDataCadastro
    };
    await clientes.atualizar(id, dto);
    res.redirect('/clientes');
  } catch (e) { next(e); }
});

// Excluir
router.post('/excluir/:id', async (req, res, next) => {
  try {
    await clientes.excluir(req.params.id);
    res.redirect('/clientes');
  } catch (e) { next(e); }
});

module.exports = router;