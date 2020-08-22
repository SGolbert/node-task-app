require("../src/db/mongoose");
const Task = require("../src/models/task");

// Task.findByIdAndDelete("5f25c50f6da90530fd1f3e99")
//   .then((task) => {
//     console.log(task);
//     return Task.countDocuments({ completed: false });
//   })
//   .then((result) => {
//     console.log(result);
//   })
//   .catch((e) => {
//     console.log(e);
//   });

const deleteTaskAndCount = async (id) => {
  const task = await Task.findByIdAndDelete(id);
  const count = await Task.countDocuments({ completed: false });
  return count;
};

deleteTaskAndCount("5f25cbf6bb44ce337608a13a")
  .then((count) => {
    console.log("Count:", count);
  })
  .catch((e) => {
    console.log(e);
  });
