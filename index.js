const express = require("express");
const morgan = require("morgan");
const app = express();
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3001
const cors = require("cors");

app.use(bodyParser.json());

app.use(cors());
app.use(express.static('build'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))

let persons = [];

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/info", (req, res) => {
  let personLength = persons.length;
  const date = new Date();
  res.send(
    `<h4>PhoneBook has info for ${personLength} people</h4><br/>${date}`
  );
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(person => person.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter(person => person.id !== id);
  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  const body = req.body;
  const randomID = Math.ceil(Math.random() * 100);

  if (!body.name) {
    return res.status(400).json({
      error: "content missing"
    });
  } else {
    if (persons.find(item => item.name === body.name)) {
      return res.status(400).json({
        error: "Duplicate"
      });
    }
    const person = {
      name: body.name,
      number: body.number,
      id: randomID
    };

    persons = persons.concat(person);
    res.json(person);
  }
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

app.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`);
});
