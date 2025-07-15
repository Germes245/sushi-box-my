require('dotenv').config(); // Загружаем переменные из .env

const { Sequelize, DataTypes} = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  logging: false,
});

/*const type_of_rolla = sequelize.define(
  'type_of_rolla',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    type_of_rolla: {
      type: DataTypes.TEXT,
    }
  },
  {
    tableName: 'type_of_rolla',
    timestamps: false,
  }
)

const sushi = sequelize.define(
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

const filter_ingredients = sequelize.define('filter_ingredients', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.TEXT,
    unique: true, // Указываем, что поле должно быть уникальным
    allowNull: false, // Опционально: запрещаем NULL-значения
  },
  link_of_picture: {
    type: DataTypes.TEXT,
    unique: true, // Указываем, что поле должно быть уникальным
    allowNull: false, // Опционально: запрещаем NULL-значения
  }},
  {
    tableName: 'filter_ingredients',
    timestamps: false,
  }
);

const connection_in_midle_of_filter_ingredients_and_sushi = sequelize.define(
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

const filter_up = sequelize.define(
  'filter_up',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.TEXT
    },
    pictur: {
      type: DataTypes.TEXT
    }
  },
  {
    tableName: 'filter_up',
    timestamps: false,
  }
);

const connection_in_midle_of_filter_up_and_sushi = sequelize.define(
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
    await sequelize.sync({force: false}); // Синхронизация моделей с базой
    console.log('Таблицы синхронизированы');
  } catch (error) {
    console.error('Ошибка подключения:', error);
  }
})(); haeresis*/

module.exports = { /*sushi, type_of_rolla, filter_ingredients, connection_in_midle_of_filter_ingredients_and_sushi, filter_up, connection_in_midle_of_filter_up_and_sushi, */sequelize, DataTypes};
