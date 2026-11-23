const express = require('express');
const router = express.Router();
const { pedidos, clientes, produtos, itensPedido } = require('../services/api');

// ---------- Listagem ----------
router.get('/', async (req, res, next) => {
  try {
    const [lista, cls] = await Promise.all([pedidos.listar(), clientes.listar()]);
    const mapaCli = Object.fromEntries(cls.map(c => [c.clienteId, c.clienteNome]));
    res.render('pedidos/index', { lista, mapaCli });
  } catch (e) { next(e); }
});

// ---------- Cadastro ----------
router.get('/novo', async (req, res, next) => {
  try {
    const cls = await clientes.listar();
    res.render('pedidos/form', { item: null, clientes: cls });
  } catch (e) { next(e); }
});

router.post('/novo', async (req, res, next) => {
  try {
    const dto = {
      clienteId: Number(req.body.clienteId),
      pedidoData: req.body.pedidoData,
      pedidoStatus: req.body.pedidoStatus
    };
    await pedidos.criar(dto);
    res.redirect('/pedidos');
  } catch (e) { next(e); }
});

// ---------- Edição ----------
router.get('/editar/:id', async (req, res, next) => {
  try {
    const [item, cls] = await Promise.all([pedidos.obter(req.params.id), clientes.listar()]);
    res.render('pedidos/form', { item, clientes: cls });
  } catch (e) { next(e); }
});

router.post('/editar/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const dto = {
      pedidoId: id,
      clienteId: Number(req.body.clienteId),
      pedidoData: req.body.pedidoData,
      pedidoStatus: req.body.pedidoStatus
    };
    await pedidos.atualizar(id, dto);
    res.redirect('/pedidos');
  } catch (e) { next(e); }
});

// ---------- Exclusão ----------
router.post('/excluir/:id', async (req, res, next) => {
  try {
    await pedidos.excluir(req.params.id);
    res.redirect('/pedidos');
  } catch (e) { next(e); }
});

// ---------- Mestre-Detalhe (ItemPedido) ----------
router.get('/detalhes/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const [pedido, cls, prods, todosItens] = await Promise.all([
      pedidos.obter(id),
      clientes.listar(),
      produtos.listar(),
      itensPedido.listar()
    ]);

    const mapaCli = Object.fromEntries(cls.map(c => [c.clienteId, c.clienteNome]));
    const mapaProd = Object.fromEntries(prods.map(p => [p.produtoId, p.produtoNome]));

    const itensDoPedido = todosItens.filter(i => i.pedidoId === id);
    const idsVinculados = new Set(itensDoPedido.map(i => i.produtoId));
    const produtosDisponiveis = prods.filter(p => !idsVinculados.has(p.produtoId));

    res.render('pedidos/detalhes', {
      pedido,
      nomeCliente: mapaCli[pedido.clienteId] || `#${pedido.clienteId}`,
      itensDoPedido,
      mapaProd,
      produtosDisponiveis
    });
  } catch (e) { next(e); }
});

router.post('/detalhes/:id/itens', async (req, res, next) => {
  try {
    const pedidoId = Number(req.params.id);
    const produtoId = Number(req.body.produtoId);
    const quantidade = Number(req.body.itemPedidoQuantidade);
    const preco = Number(req.body.itemPedidoPrecoUnitario);

    await itensPedido.criar({
      pedidoId,
      produtoId,
      itemPedidoQuantidade: quantidade,
      itemPedidoPrecoUnitario: preco
    });
    res.redirect(`/pedidos/detalhes/${pedidoId}`);
  } catch (e) { next(e); }
});

router.post('/detalhes/:id/itens/:produtoId/excluir', async (req, res, next) => {
  try {
    const pedidoId = Number(req.params.id);
    const produtoId = Number(req.params.produtoId);

    const todos = await itensPedido.listar();
    const itensDoPedido = todos.filter(i => i.pedidoId === pedidoId);
    const restantes = itensDoPedido.filter(i => i.produtoId !== produtoId);

    for (let i = 0; i < itensDoPedido.length; i++) {
      await itensPedido.excluir(pedidoId);
    }
    for (const it of restantes) {
      await itensPedido.criar({
        pedidoId: it.pedidoId,
        produtoId: it.produtoId,
        itemPedidoQuantidade: it.itemPedidoQuantidade,
        itemPedidoPrecoUnitario: it.itemPedidoPrecoUnitario
      });
    }
    res.redirect(`/pedidos/detalhes/${pedidoId}`);
  } catch (e) { next(e); }
});

module.exports = router;