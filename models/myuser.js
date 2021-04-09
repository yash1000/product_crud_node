'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MyUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  MyUser.init({
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    mobile: DataTypes.BIGINT,
    image: DataTypes.STRING,
    gender: DataTypes.INTEGER,
    categories: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'MyUser',
  });
  return MyUser;
};
