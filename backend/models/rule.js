const { DataTypes } = require("sequelize");
const sequelize = require("../db/db");

const Rule = sequelize.define(
    "Rule",
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },

        step_id: {
            type: DataTypes.UUID,
            allowNull: false
        },

        condition: {
            type: DataTypes.STRING
        },

        next_step_id: {
            type: DataTypes.UUID
        },

        priority: {
            type: DataTypes.INTEGER
        }
    },
    {
        tableName: "rules",
        timestamps: false
    }
);

module.exports = Rule;