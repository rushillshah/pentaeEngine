import Knex from "knex";
import knexConfig from "./knex.config";

const db = Knex(knexConfig);

export default db;
