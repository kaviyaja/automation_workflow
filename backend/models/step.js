const { DataTypes } = require("sequelize");
const sequelize = require("../db/db");

const Step = sequelize.define(
    "Step",
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

        name: {
            type: DataTypes.STRING,
            allowNull: false
        },

        step_type: {
            type: DataTypes.STRING
        },

        step_order: {
            type: DataTypes.INTEGER
        }
    },
    {
        tableName: "steps",
        timestamps: false
    }
);

module.exports = Step;