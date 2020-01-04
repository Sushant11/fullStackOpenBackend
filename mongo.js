const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://chtre:${password}@phonebook-tlhsa.mongodb.net/test?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  id: Number
});

const Person = mongoose.model("Person", personSchema);

const person = new Person({
  name: "HTML is Easy",
  number: "12sasd",
  id: 1
});

Person.find({}).then(result => {
  result.forEach(person => {
    console.log(person);
  });
  mongoose.connection.close();
});
