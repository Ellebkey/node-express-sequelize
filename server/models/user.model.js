/**
 * User Schema
 */
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isUnique: (value, next) => {
          const self = this;
          User.find({
            where: {
              username: value
            }
          })
            .then((user) => {
              if (user && self.id !== user.id) {
                return next('Username already exists, please choose another');
              }
              return next();
            })
            .catch(err => next(err));
        }
      }
    },
    hashedPassword: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    mobileNumber: {
      type: DataTypes.STRING
    },
    roles: {
      type: DataTypes.STRING,
      defaultValue: 'user',
      isArray: false,
      get() {
        if (!this.isNewRecord && this.getDataValue('roles')) {
          return this.getDataValue('roles').split(',');
        }
        return null;
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    hooks: {
      beforeValidate(user) {
        if (user.isNewRecord) {
          user.roles = user.dataValues.roles.toString();
        } else {
          user.roles = user.roles.toString();
        }
      }
    }
  });

  return User;
};
