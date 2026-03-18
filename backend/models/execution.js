const { DataTypes } = require("sequelize");
const sequelize = require("../db/db");

const Execution = sequelize.define(
    "Execution",
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },

        workflow_id: {
            type: DataTypes.UUID,
            allowNull: false
        },

        status: {
            type: DataTypes.STRING
        },

        data: {
            type: DataTypes.JSON
        },

        started_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    },
    {
        tableName: "executions",
        timestamps: false
    }
);

module.exports = Execution;