const personsRouter = require("express").Router();
const Person = require("../models/person");

personsRouter.get("/", (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons.map(person => person.toJSON()));
  });
});

personsRouter.get("/info", (req, res) => {
  let personLength = Person.length;
  const date = new Date();
  res.send(
    `<h4>PhoneBook has info for ${personLength} people</h4><br/>${date}`
  );
});

personsRouter.get("/:id", (req, res) => {
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

personsRouter.post("/", (req, res, next) => {
  const body = req.body;

  if (!body.name) {
    return res.status(400).json({
      error: "content missing"
    });
  } else {
    const person = new Person({
      name: body.name,
      number: body.number,
      id: body.id
    });

    person
      .save()
      .then(savedPerson => {
        res.json(savedPerson.toJSON());
      })
      .catch(error => next(error));
  }
});

personsRouter.delete("/:id", (req, res, next) => {
  console.log(Person);
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end();
    })
    .catch(error => next(error));
});

module.exports = personsRouter