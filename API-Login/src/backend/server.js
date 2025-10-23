const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const cors = require("cors");
const db = require("./db");

const app = express();
const PORT = 5500;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Servidor CineGuide está rodando!");
});

app.post("/api/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password)
    return res.status(400).json({ message: "Preencha todos os campos." });

  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, row) => {
    if (err) return res.status(500).json({ message: "Erro no servidor." });
    if (row) return res.status(400).json({ message: "Email já cadastrado." });

    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashedPassword],
      function (err) {
        if (err) {
            return res.status(500).json({ message: "Erro ao registrar usuário." });
        }          
        return res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
      }
    );
  });
});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Informe email e senha." });

  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
    if (err) return res.status(500).json({ message: "Erro no servidor." });
    if (!user) return res.status(400).json({ message: "Usuário não encontrado." });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(401).json({ message: "Senha incorreta." });

    res.status(200).json({
      message: "Login realizado com sucesso!",
      user: { id: user.id, username: user.username, email: user.email },
    });
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});

app.get("/testdb", (req, res) => {
   db.get("SELECT * FROM users WHERE email = ?", [req.params.email], async (err, user) => {
    if (err) return res.status(500).json({ message: "Erro no servidor." });
    if (!user) return res.status(400).json({ message: "Usuário não encontrado." });
    return res.status(200).json({ message: user });
  });
});

app.get("/allusers", (req, res) => {
   db.get("SELECT * FROM users WHERE 1", async (err, user) => {
    if (err) return res.status(500).json({ message: "Erro no servidor." });
    if (!user) return res.status(400).json({ message: "Usuário não encontrado." });
    return res.status(200).json({ message: user });
  });
});