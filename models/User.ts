import {DataTypes, Model, NonAttribute} from 'sequelize';
import databaseConnection from "../config/database";

class User extends Model {
    declare id: number;
    declare firstName: string;
    declare lastName: string;
    declare emailAddress: string;
    declare password: string;

    get fullName(): NonAttribute<string> {
        return (`${this.firstName} ${this.lastName}`).toUpperCase();
    }
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        emailAddress: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        tableName: 'users',
        sequelize: databaseConnection,
    }
);

export default User;