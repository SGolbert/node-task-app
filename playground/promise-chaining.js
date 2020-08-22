require("../src/db/mongoose");
const User = require("../src/models/user");

// User.findByIdAndUpdate("5f25c35e5b3b172fe11e9614", { age: 1 })
//   .then((user) => {
//     console.log(user);
//     return User.countDocuments({ age: 1 });
//   })
//   .then((result) => {
//     console.log(result);
//   })
//   .catch((e) => {
//     console.log(e);
//   });

const updateAgeAndCount = async (id, age) => {
  const user = await User.findByIdAndUpdate(id, { age });
  const count = await User.countDocuments({ age });
  return count;
};

updateAgeAndCount("5f25c35e5b3b172fe11e9614", 20)
  .then((count) => {
    console.log("Count:", count);
  })
  .catch((e) => {
    console.log(e);
  });
