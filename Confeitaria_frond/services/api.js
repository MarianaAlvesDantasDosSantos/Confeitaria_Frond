// URL base da API
const API_BASE = process.env.API_BASE_URL || 'http://localhost:5000/api';

async function call(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };

  let response;
  try {
    response = await fetch(url, { ...options, headers });
  } catch (e) {
    throw new Error(`Não foi possível conectar à API em ${url}.`);
  }

  // ESTA LINHA É A CORREÇÃO DO BUG DE EXCLUSÃO!
  // Se a API retornar 204 (No Content, exclusão bem-sucedida), encerra a função e retorna null.
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
    }
    
    // Traduz erro de chave estrangeira
    if (response.status === 500) {
      msg = "Não é possível excluir este registro pois ele possui dados vinculados (ex: produtos ou pedidos). Exclua os itens dependentes primeiro.";
    }
    throw new Error(msg);
  }

  return body;
}

// ---------- Categorias ----------
const categorias = {
  listar: () => call('/Categorias'),
  obter: (id) => call(`/Categorias/${id}`),
  criar: (dto) => call('/Categorias', { method: 'POST', body: JSON.stringify(dto) }),
  atualizar: (id, dto) => call(`/Categorias/${id}`, { method: 'PUT', body: JSON.stringify(dto) }),
  excluir: (id) => call(`/Categorias/${id}`, { method: 'DELETE' })
};

// ---------- Clientes ----------
const clientes = {
  listar: () => call('/Clientes'),
  obter: (id) => call(`/Clientes/${id}`),
  criar: (dto) => call('/Clientes', { method: 'POST', body: JSON.stringify(dto) }),
  atualizar: (id, dto) => call(`/Clientes/${id}`, { method: 'PUT', body: JSON.stringify(dto) }),
  excluir: (id) => call(`/Clientes/${id}`, { method: 'DELETE' })
};

// ---------- Produtos ----------
const produtos = {
  listar: () => call('/Produtos'),
  obter: (id) => call(`/Produtos/${id}`),
  criar: (dto) => call('/Produtos', { method: 'POST', body: JSON.stringify(dto) }),
  atualizar: (id, dto) => call(`/Produtos/${id}`, { method: 'PUT', body: JSON.stringify(dto) }),
  excluir: (id) => call(`/Produtos/${id}`, { method: 'DELETE' })
};

// ---------- Pedidos ----------
const pedidos = {
  listar: () => call('/Pedidos'),
  obter: (id) => call(`/Pedidos/${id}`),
  criar: (dto) => call('/Pedidos', { method: 'POST', body: JSON.stringify(dto) }),
  atualizar: (id, dto) => call(`/Pedidos/${id}`, { method: 'PUT', body: JSON.stringify(dto) }),
  excluir: (id) => call(`/Pedidos/${id}`, { method: 'DELETE' })
};

// ---------- ItensPedido ----------
const itensPedido = {
  listar: () => call('/ItensPedido'),
  obter: (id) => call(`/ItensPedido/${id}`),
  criar: (dto) => call('/ItensPedido', { method: 'POST', body: JSON.stringify(dto) }),
  atualizar: (id, dto) => call(`/ItensPedido/${id}`, { method: 'PUT', body: JSON.stringify(dto) }),
  excluir: (id) => call(`/ItensPedido/${id}`, { method: 'DELETE' }),
  excluirPar: (pedidoId, produtoId) => call(`/ItensPedido/${pedidoId}/${produtoId}`, { method: 'DELETE' })
};

module.exports = { categorias, clientes, produtos, pedidos, itensPedido };