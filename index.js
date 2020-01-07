require('dotenv').config();
const express = require("express");
const morgan = require("morgan");
const app = express();
app.use(express.static("build"));
const cors = require("cors");
const mongoose = require("mongoose");
const Person = require("./models/person");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());

app.use(cors());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);
const url = process.env.MONGOBD_URI;
mongoose.connect(url, { useNewUrlParser: true });

let persons = [];

app.get("/api/persons", (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons.map(person => person.toJSON()));
  });
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
    Person.findById(request.params.id).then(note => {
      req.json(note.toJSON());
    });
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res, next) => {
  console.log(Person)
  Person.findByIdAndRemove(req.params.id).then(result => {res.status(204).end()})
  .catch(error => next(error))
});

app.post("/api/persons", (req, res, next) => {
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
    const person = new Person({
      name: body.name,
      number: body.number,
      id: randomID
    });

    person
      .save()
      .then(savedPerson => {
        res.json(savedPerson.toJSON());
      })
      .catch(error => next(error));
  }
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError" && error.kind == "ObjectId") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`);
});
