module.exports = (sequelize, Sequelize) => {
  const users = sequelize.define("users", {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
       validate: {
        isEmail: true,
      },
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    status: {
      type: Sequelize.STRING,
      defaultValue: "Pending",
    },
    token: {
      type: Sequelize.STRING,
    },
  });
  return users;
};
