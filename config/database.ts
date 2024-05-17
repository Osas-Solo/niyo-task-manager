import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config();

const DB_NAME: string = process.env.DB_NAME as string;
const DB_HOST: string = process.env.DB_HOST as string;
const DB_USER: string = process.env.DB_USER as string;
const DB_PASSWORD: string = process.env.DB_PASSWORD as string;
const DB_PORT: string = process.env.DB_PORT as string;

const databaseConnection: Sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: Number(DB_PORT),
    dialect: 'mysql',
});

export default databaseConnection;