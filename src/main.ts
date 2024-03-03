async function main() {
  const result = await Promise.resolve("Hello, async/await!");
  console.log(result);
}

main();
