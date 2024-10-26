import { Seno } from "./seno-ts/Seno";

const seno = new Seno();

seno.route("get", "/", (req, res) => {
  res.status(200).json("ok");
});

seno.listen(4040, () => console.log("listening"));

//npx tsx watch server-type.ts
