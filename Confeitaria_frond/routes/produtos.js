const express = require('express');
const router = express.Router();
const { produtos, categorias } = require('../services/api');

// Listagem
router.get('/', async (req, res, next) => {
  try {
    // Busca produtos e categorias ao mesmo tempo para mostrar o nome da categoria
    const [lista, cats] = await Promise.all([produtos.listar(), categorias.listar()]);
    
    // Cria um "dicionário" para facilitar a busca: { 1: "Bolos", 2: "Tortas" }
    const mapaCat = Object.fromEntries(cats.map(c => [c.categoriaId, c.categoriaNome]));
    
    res.render('produtos/index', { lista, mapaCat });
  } catch (e) { next(e); }
});

// Form de cadastro
router.get('/novo', async (req, res, next) => {
  try {
    const cats = await categorias.listar(); // Puxa as categorias para o <select>
    res.render('produtos/form', { item: null, categorias: cats });
  } catch (e) { next(e); }
});

// Criar
router.post('/novo', async (req, res, next) => {
  try {
    const dto = {
      categoriaId: Number(req.body.categoriaId), // Converte para número
      produtoNome: req.body.produtoNome,
      produtoDescricao: req.body.produtoDescricao?.trim() || null,
      produtoPreco: Number(req.body.produtoPreco),
      produtoEstoque: Number(req.body.produtoEstoque)
    };
    await produtos.criar(dto);
    res.redirect('/produtos');
  } catch (e) { next(e); }
});

// Form de edição
router.get('/editar/:id', async (req, res, next) => {
  try {
    const [item, cats] = await Promise.all([produtos.obter(req.params.id), categorias.listar()]);
    res.render('produtos/form', { item, categorias: cats });
  } catch (e) { next(e); }
});

// Atualizar
router.post('/editar/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const dto = {
      produtoId: id, // Obrigatório no corpo do PUT
      categoriaId: Number(req.body.categoriaId),
      produtoNome: req.body.produtoNome,
      produtoDescricao: req.body.produtoDescricao?.trim() || null,
      produtoPreco: Number(req.body.produtoPreco),
      produtoEstoque: Number(req.body.produtoEstoque)
    };
    await produtos.atualizar(id, dto);
    res.redirect('/produtos');
  } catch (e) { next(e); }
});

// Excluir
router.post('/excluir/:id', async (req, res, next) => {
  try {
    await produtos.excluir(req.params.id);
    res.redirect('/produtos');
  } catch (e) { next(e); }
});

module.exports = router;