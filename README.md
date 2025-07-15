# Simulador LPI Linux Essentials (010-160) 🇧🇷

[![Docker](https://img.shields.io/badge/docker-ready-blue?logo=docker)](https://hub.docker.com/)
[![License](https://img.shields.io/github/license/edvanflorio/lpi_010_160_exam)](LICENSE)

Este projeto é um **simulador de exame LPI Linux Essentials (010-160)** totalmente em **português**, com ênfase em usabilidade, acessibilidade e aprendizado com **feedback explicativo**.  
Foi baseado no repositório original [Noam-Alum/lpi_010_160_exam](https://github.com/Noam-Alum/lpi_010_160_exam), mas passou por melhorias significativas descritas abaixo.

---

## ✅ Principais melhorias

- 🌐 Questões traduzidas completamente para **português**.
- 🧠 Adição de **148 questões oficiais** baseadas no livro *LPI Essentials*.
- 📘 Cada questão agora conta com **campo de feedback**, explicando o porquê da resposta correta.
- 🐳 Adição de **stack Docker completa**:
  - `Dockerfile` multi-stage
  - `docker-compose.yml`
  - `.dockerignore`
- 🛠️ Correções de bugs e ajustes na lógica de resposta.
- 💡 Preparado para uso **offline** com arquivos `.json` locais.

---

## 🚀 Como executar com Docker

```bash
git clone https://github.com/edvanflorio/lpi_010_160_exam.git
cd lpi_010_160_exam
docker compose build 
docker compose up -d
````

Acesse o simulador em: [http://localhost:3000](http://localhost:3000)

---

## 📁 Estrutura de diretórios

```bash
.
├── docs/                  # Aplicação React + Vite
│   ├── public/
│   │   └── lpi/           # JSON com questões locais
│   │       ├── lpi_questions.json
│   │       └── lpi_exercise_questions.json
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
```

---

## 🤝 Apoie o projeto

Este simulador é mantido de forma independente.
Se ele te ajudou nos estudos, considere **apoiar o projeto** com qualquer quantia ou estrela no GitHub ⭐

> 💬 Para apoio ou contato direto: [edvanflorio@gmail.com](mailto:edvansilva0511@gmail.com)
> 💰 Chave PIX: `edvansilva0511@gmail.com` (opcional)

---

## ⚠️ Aviso legal

Este projeto é baseado no conteúdo do exame **LPI Linux Essentials 010-160** com questões elaboradas a partir de fontes públicas e do livro oficial.
Não possui vínculo com o Linux Professional Institute (LPI).
Não comercializamos conteúdo fechado, seguindo as diretrizes de uso da LPI. Para mais informações, veja: [lpi.org](https://www.lpi.org)

---

## 📄 Licença

Distribuído sob a licença MIT. Veja [LICENSE](LICENSE) para mais detalhes.

---

## 🌟 Créditos

* Projeto original: [Noam-Alum/lpi\_010\_160\_exam](https://github.com/Noam-Alum/lpi_010_160_exam)
* Tradução, melhorias e dockerização: [Edvan Florio](https://github.com/edvanflorio)


