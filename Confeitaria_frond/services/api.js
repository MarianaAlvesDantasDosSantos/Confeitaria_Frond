// URL base da API ASP.NET Core (configurável por variável de ambiente)
const API_BASE = process.env.API_BASE_URL || 'http://localhost:5000/api';

/**
 * Faz a chamada à API e devolve o corpo já parseado.
 * Lança um Error com a mensagem da API em caso de status >= 400.
 */
async function call(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };

  let response;
  try {
    response = await fetch(url, { ...options, headers });
  } catch (e) {
    throw new Error(`Não foi possível conectar à API em ${url}. Verifique se ela está rodando.`);
  }

  // Sem conteúdo (204, 201 sem body etc.)
  if (response.status === 204) return null;

  const text = await response.text();
  let body = null;
  if (text) {
    try { body = JSON.parse(text); } catch { body = text; }
  }

  if (!response.ok) {
    // Tenta extrair mensagem amigável do problema (ProblemDetails do ASP.NET)
    let msg = `Erro ${response.status}`;
    if (body && typeof body === 'object') {
      if (body.title) msg += `: ${body.title}`;
      if (body.detail) msg += ` - ${body.detail}`;
      if (body.errors) {
        const partes = [];
        for (const campo of Object.keys(body.errors)) {
          partes.push(`${campo}: ${body.errors[campo].join(', ')}`);
        }
        if (partes.length) msg += ` (${partes.join('; ')})`;
      }
    } else if (typeof body === 'string' && body.trim()) {
      msg += `: ${body}`;
    }

    // Tradução amigável para o erro de Foreign Key (bloqueio de exclusão no banco)
    if (response.status === 500) {
      msg = "Não é possível excluir ou salvar este registro pois ele está vinculado a outros dados (Chave Estrangeira). Verifique os itens dependentes primeiro.";
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

// ---------- ItensPedido (N:N) ----------
const itensPedido = {
  listar: () => call('/ItensPedido'),
  obter: (id) => call(`/ItensPedido/${id}`),
  criar: (dto) => call('/ItensPedido', { method: 'POST', body: JSON.stringify(dto) }),
  atualizar: (id, dto) => call(`/ItensPedido/${id}`, { method: 'PUT', body: JSON.stringify(dto) }),
  excluir: (id) => call(`/ItensPedido/${id}`, { method: 'DELETE' }),
  // Rota nova para excluir o item específico (PedidoId e ProdutoId)
  excluirPar: (pedidoId, produtoId) => call(`/ItensPedido/${pedidoId}/${produtoId}`, { method: 'DELETE' })
};

module.exports = { categorias, clientes, produtos, pedidos, itensPedido };