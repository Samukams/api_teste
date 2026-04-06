const express = require("express");
const cors = require("cors");
const data = require("../data.json");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// GET /api/conceitos
app.get("/api/conceitos", (req, res) => {
  const { categoria, subCategoria } = req.query;

  let resultado = data;

  if (categoria) {
    resultado = resultado.filter(
      (item) => item.categoria?.toLowerCase() === categoria.toLowerCase()
    );
  }

  if (subCategoria) {
    resultado = resultado.filter(
      (item) => item.subCategoria?.toLowerCase() === subCategoria.toLowerCase()
    );
  }

  res.json(resultado);
});

// GET /api/conceitos/categorias
app.get("/api/conceitos/categorias", (req, res) => {
  const categorias = [...new Set(data.map((item) => item.categoria).filter(Boolean))];
  res.json(categorias);
});

// GET /api/conceitos/codigo/:codigo
app.get("/api/conceitos/codigo/:codigo", (req, res) => {
  const codigo = parseFloat(req.params.codigo);
  const conceito = data.find((item) => item.codigo === codigo);

  if (!conceito) {
    return res.status(404).json({ erro: `Conceito com código ${codigo} não encontrado.` });
  }

  res.json(conceito);
});

// GET /api/conceitos/:id/relacionados
app.get("/api/conceitos/:id/relacionados", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const conceito = data.find((item) => item.id === id);

  if (!conceito) {
    return res.status(404).json({ erro: `Conceito com id ${id} não encontrado.` });
  }

  const codigosRelacionados = conceito.relacionados ?? [];
  const relacionados = data.filter((item) =>
    codigosRelacionados.includes(String(item.codigo))
  );

  res.json({
    origem: { id: conceito.id, codigo: conceito.codigo, titulo: conceito.titulo },
    relacionados,
  });
});

// GET /api/conceitos/:id
app.get("/api/conceitos/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const conceito = data.find((item) => item.id === id);

  if (!conceito) {
    return res.status(404).json({ erro: `Conceito com id ${id} não encontrado.` });
  }

  res.json(conceito);
});

app.use((req, res) => {
  res.status(404).json({ erro: "Rota não encontrada." });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
