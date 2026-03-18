const { DataTypes } = require("sequelize");
const sequelize = require("../db/db");

const Workflow = sequelize.define(
    "Workflow",
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },

        name: {
            type: DataTypes.STRING,
            allowNull: false
        },

        version: {
            type: DataTypes.INTEGER,
            defaultValue: 1
        },

        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },

        input_schema: {
            type: DataTypes.JSON
        },

        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    },
    {
        tableName: "workflows",
        timestamps: false
    }
);

module.exports = Workflow;