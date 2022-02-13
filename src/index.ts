import * as express from "express";
import { initDependencies } from "./app/config/deps";

(async () => {
  const { carService } = await initDependencies();

  const app = express();

  app.get("/:id", async (req, res) => {
    const result = await carService.getPrice(req.params.id, false);

    res.json(result);
  });

  app.listen(3000, () => {
    console.log("app started at port 3000");
  });
})();
