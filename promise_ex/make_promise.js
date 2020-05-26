const aa = () =>
  new Promise((resolve, reject) => {
    const random = Math.ceil(Math.random() * 100);
    if (random > 50) {
      resolve(random);
    } else {
      reject(random);
    }
  });
aa()
  .then((res) => console.log(`then ${res}`))
  .catch((e) => console.log(`error ${e}`));
