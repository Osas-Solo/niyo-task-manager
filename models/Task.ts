import {DataTypes, Model} from 'sequelize';
import databaseConnection from '../config/database';

class Task extends Model {
    declare id: number;
    declare userID: number;
    declare title: string;
    declare description: string;
    declare startTime: string;
    declare endTime: string;
    declare isCompleted: boolean;
}

Task.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        userID: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        startTime: {
            type: DataTypes.NOW,
            allowNull: false,
        },
        endTime: {
            type: DataTypes.NOW,
            allowNull: false,
        },
        isCompleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
    },
    {
        tableName: 'tasks',
        sequelize: databaseConnection,
    }
);

export default Task;