import app from "./app";
import { hostname, port } from "./app";

app.listen(port, hostname, () => {
  console.log(`[ ready ] http://${hostname}:${port}`);
});
