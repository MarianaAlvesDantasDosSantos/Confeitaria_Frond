// Como você voltou para a porta 5000, a URL base é esta:
const API_BASE = process.env.API_BASE_URL || 'http://localhost:5000/api';

async function call(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };

  let response;
  try {
    response = await fetch(url, { ...options, headers });
  } catch (e) {
    throw new Error(`Não foi possível conectar à API em ${url}. Verifique se ela está rodando.`);
  }

  if (response.status === 204) return null;
  const text = await response.text();
  let body = null;
  if (text) {
    try { body = JSON.parse(text); } catch { body = text; }
  }

  if (!response.ok) {
    let msg = `Erro ${response.status}`;
    if (body && typeof body === 'object') {
      if (body.title) msg += `: ${body.title}`;
      if (body.errors) {
        const partes = [];
        for (const campo of Object.keys(body.errors)) {
          partes.push(`${campo}: ${body.errors[campo].join(', ')}`);
        }
        if (partes.length) msg += ` (${partes.join('; ')})`;
      }
    }
    throw new Error(msg);
  }
  return body;
}

const categorias = {
  listar: () => call('/Categorias'),
  obter: (id) => call(`/Categorias/${id}`),
  criar: (dto) => call('/Categorias', { method: 'POST', body: JSON.stringify(dto) }),
  atualizar: (id, dto) => call(`/Categorias/${id}`, { method: 'PUT', body: JSON.stringify(dto) }),
  excluir: (id) => call(`/Categorias/${id}`, { method: 'DELETE' })
};

const clientes = {
  listar: () => call('/Clientes'),
  obter: (id) => call(`/Clientes/${id}`),
  criar: (dto) => call('/Clientes', { method: 'POST', body: JSON.stringify(dto) }),
  atualizar: (id, dto) => call(`/Clientes/${id}`, { method: 'PUT', body: JSON.stringify(dto) }),
  excluir: (id) => call(`/Clientes/${id}`, { method: 'DELETE' })
};

const produtos = {
  listar: () => call('/Produtos'),
  obter: (id) => call(`/Produtos/${id}`),
  criar: (dto) => call('/Produtos', { method: 'POST', body: JSON.stringify(dto) }),
  atualizar: (id, dto) => call(`/Produtos/${id}`, { method: 'PUT', body: JSON.stringify(dto) }),
  excluir: (id) => call(`/Produtos/${id}`, { method: 'DELETE' })
};

const pedidos = {
  listar: () => call('/Pedidos'),
  obter: (id) => call(`/Pedidos/${id}`),
  criar: (dto) => call('/Pedidos', { method: 'POST', body: JSON.stringify(dto) }),
  atualizar: (id, dto) => call(`/Pedidos/${id}`, { method: 'PUT', body: JSON.stringify(dto) }),
  excluir: (id) => call(`/Pedidos/${id}`, { method: 'DELETE' })
};

const itensPedido = {
  listar: () => call('/ItensPedido'),
  obter: (id) => call(`/ItensPedido/${id}`),
  criar: (dto) => call('/ItensPedido', { method: 'POST', body: JSON.stringify(dto) }),
  atualizar: (id, dto) => call(`/ItensPedido/${id}`, { method: 'PUT', body: JSON.stringify(dto) }),
 excluirPar: (pedidoId, produtoId) => call(`/ItensPedido/${pedidoId}/${produtoId}`, { method: 'DELETE' })
};

module.exports = { categorias, clientes, produtos, pedidos, itensPedido };