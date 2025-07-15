const { sequelize, DataTypes }=require('./my_modules/connect_to_database.js');

sequelize.define(
  'sushi',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    type_of_rolla: {
      type: DataTypes.INTEGER,
      references: {
        model: 'type_of_rolla', // Имя таблицы, на которую ссылаемся
        key: 'id', // Поле в целевой таблице
      }
    },
    name: {
      type: DataTypes.TEXT,
    },
    cost: {
      type: DataTypes.SMALLINT,
    },
    description: {
      type: DataTypes.TEXT
    },
    link_of_picture: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: 'sushi',
    timestamps: false,
  },
);

sequelize.define(
  'connection_in_midle_of_filter_ingredients_and_sushi',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ingredient_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'filter_ingredients', // Имя таблицы, на которую ссылаемся
        key: 'id', // Поле в целевой таблице
      },
    },
    sushi_id: {
      // Добавляем FK для связи с суши
      type: DataTypes.INTEGER,
      references: {
        model: 'sushi', // Имя таблицы sushi
        key: 'id', // Поле id в таблице sushi
      },
      allowNull: false,
    },
  },
  {
    tableName: 'connection_in_midle_of_filter_ingredients_and_sushi',
    timestamps: false,
  }
);

sequelize.define(
  'connection_in_midle_of_filter_up_and_sushi',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    filter_up_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'filter_up', // Имя таблицы, на которую ссылаемся
        key: 'id', // Поле в целевой таблице
      },
    },
    sushi_id: {
      // Добавляем FK для связи с суши
      type: DataTypes.INTEGER,
      references: {
        model: 'sushi', // Имя таблицы sushi
        key: 'id', // Поле id в таблице sushi
      },
      allowNull: false,
    },
  },
  {
    tableName: 'connection_in_midle_of_filter_up_and_sushi',
    timestamps: false,
  }
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Подключение к PostgreSQL успешно');
    await sequelize.sync({force: true}); // Синхронизация моделей с базой
    console.log('Таблицы синхронизированы');
    return;
  } catch (error) {
    console.error('Ошибка подключения:', error);
    return;
  }
})();