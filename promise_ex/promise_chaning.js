const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve({
      p1_text: "p1 텍스트입니당",
    });
  }, 1000);
});

const p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve({
      p2_text: "p2 텍스트입니당",
    });
  }, 2000);
});

const p3 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject("Holy Moly!!");
  }, 3000);
});

Promise.all([p1, p2, p3])
  .then((res) => {
    console.log("p1_text " + res[0].p1_text);
    console.log("p2_text " + res[1].p2_text);
  })
  .catch((e) => console.log(e));
