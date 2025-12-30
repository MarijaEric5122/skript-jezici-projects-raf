import { DataSource } from "typeorm";
import path from "path";

const AppDataSource = new DataSource({
  type: "sqlite",
  database: path.join(__dirname, "../../db.sqlite"),
  synchronize: true,
  entities: [path.join(__dirname, "/entities/*.ts")],
});

export default AppDataSource;
