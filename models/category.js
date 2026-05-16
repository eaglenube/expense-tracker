'use strict';

module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    'Category',
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      user_id: { type: DataTypes.UUID, allowNull: false },
      name: { type: DataTypes.STRING, allowNull: false },
      color: { type: DataTypes.STRING, defaultValue: '#6366f1' },
      icon: { type: DataTypes.STRING, defaultValue: 'bi-tag' },
    },
    { tableName: 'categories' }
  );

  Category.associate = (models) => {
    Category.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    Category.hasMany(models.Expense, { foreignKey: 'category_id', as: 'expenses' });
  };

  return Category;
};
