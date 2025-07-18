const express = require('express');
const app = express();
const multer = require('multer');

// подключение к базе данных
const { sequelize } = require('./my_modules/connect_to_database.js');

// подготовка к отправке главной страницы
const { prepareMainPage } = require('./my_modules/prepare_main_page.js');
const { get_information_about_sushi } = require('./my_modules/get_information_about_sushi.js');

// сохранение файла
let name_of_file;
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    name_of_file = `${Date.now()}.jpeg`;
    cb(null, name_of_file);
  },
});

// настройка загрузки
const upload = multer({
  storage, // файловый фильтр
  fileFilter: (req, file, cb) => {
    console.log('Проверка файла:', file.originalname);
    if (['image/jpeg', 'image/png'].includes(file.mimetype)) {
      cb(null, true); // Файл подходит
    } else {
      cb(new Error('Только JPEG или PNG!'), false); // Блокируем
    }
  },
});

// настройка ejs
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Middleware для парсинга текстовых полей формы
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));
app.use('/picture', express.static('uploads'));

app.get('/', async (req, res) => {
  console.log(req.query)
  let rolls = await prepareMainPage(await get_information_about_sushi());
  res.render('index.ejs', {
    filter_ingredients: rolls.ingredients,
    rolls:rolls.rolls
  });
});

app.get('/busket_window/:ids', async(req, res)=>{
  let html_code='';
  for(let i of req.params.ids.split('&')){
    html_code+=`<div class="card_for_busket">
                        <div class="left_of_card_for_busket">
                            <div class="picture_for_busket" style="background-image: url('${(await sequelize.query(`select link_of_picture from sushi where id = ${i};`))[0][0].link_of_picture}');"></div>
                            <div id="name_of_susha_and_buttons_plus_and_minus">
                                <span class="ProductcardXS_name_of_susha">${(await sequelize.query(`select name from sushi where id = ${i};`))[0][0].name}</span>
                                <div class="buttons_plus_and_minus">
                                    <button class="button_plus_and_minus">-</button>
                                    <span class="number_for_busket"></span>
                                    <button class="button_plus_and_minus">+</button>
                                </div>
                            </div>
                        </div>
                        <div class="right_of_card_for_busket">
                            <button class="button_delete"></button>
                            <span class="price_for_busket">200 ₽</span>
                        </div>
                    </div>`
  };
  console.log(html_code)
  res.send(html_code)
})

app.get('/admin_panel_sushi', async(req,res)=>{
  const ingredients = (await sequelize.query('SELECT * FROM filter_ingredients;'))[0]; // это истина, а "await filter_ingredients.findAll({raw: true});" есть ересь
  console.log(ingredients);
  let ingredients_html='';
  ingredients.forEach(el=>{
    ingredients_html+=`<option value="${el.id}">${el.name}</option>`;
  });
  let type_of_rolla='';
  for(let i of (await sequelize.query('select * from type_of_rolla;'))[0]){
    type_of_rolla+=`<option value="${i.id}">${i.type_of_rolla}</option>`;
  };
  console.log(type_of_rolla);
  res.render('admin_panel_sushi_2.ejs', {
    ingredients: ingredients_html,
    type_of_rolla
  });

  //res.send('prepared');
});

app.post('/upload_sushi', upload.single('photo'), async (req, res) => {
  console.log(req.body);
  /*await sushi.create({
    type_of_rolla: req.body.type_of_rolla,
    name: req.body.name_of_susha,
    cost: req.body.price,
    description: req.body.deskription,
    link_of_picture: `/picture/${name_of_file}`
  }); haeresis*/
  await sequelize.query(`INSERT INTO sushi (type_of_rolla, name, cost, description, link_of_picture)
    VALUES (${req.body.type_of_rolla},
      '${req.body.name_of_susha}',
      ${req.body.price},
      '${req.body.deskription}',
      '/picture/${name_of_file}'
     );`)// veritas
  const sushi_id = (await sequelize.query('SELECT max(id) FROM sushi;'))[0][0].max;
  for(const el of req.body.ingredients){
    console.log(el);
    /*await connection_in_midle_of_filter_ingredients_and_sushi.create({
      ingredient_id: el,
      sushi_id: sushi_id
    }); haeresis*/
    await sequelize.query(`INSERT INTO connection_in_midle_of_filter_ingredients_and_sushi (ingredient_id, sushi_id) VALUES (${el}, ${sushi_id});`);// veritas
  };
  for(const el of req.body.filter_up){
    console.log(el)
    await sequelize.query(`INSERT INTO connection_in_midle_of_filter_up_and_sushi (filter_up_id, sushi_id) VALUES (${el}, ${sushi_id});`);
  };
  res.send('Файл и данные приняты!');
});

app.post('/upload_ingredient', async (req,res)=>{
  try{
    await sequelize.query(`INSERT INTO filter_ingredients (name, link_of_picture)
VALUES ('${req.body.name_of_susha}', '/assets/${req.body.asset}');`);
    res.send('принято');
  }
  catch(e){
    res.send(e)
  }
});

app.get('/get_all_sushi/', async(req,res) => {
  res.send(await prepareMainPage(await get_information_about_sushi(),do_ingredients=false))
});

app.get('/filter_igredient/:id',async(req,res)=> {
  const for_request = req.params.id.split('&');
  for(let i = 0; i<for_request.length; i++) for_request[i]=`filter_ingredients.id = ${for_request[i]}`;
  res.send(await prepareMainPage((await sequelize.query(`select distinct sushi.* from filter_ingredients
join connection_in_midle_of_filter_ingredients_and_sushi on connection_in_midle_of_filter_ingredients_and_sushi.ingredient_id = filter_ingredients.id
join sushi on sushi.id = connection_in_midle_of_filter_ingredients_and_sushi.sushi_id
where ` + for_request.join(' or ')+';'))[0],do_ingredients=false));
});

app.get('/filter_up/:id', async(req, res)=> {
  /*let query=`select sushi.* from filter_up
join connection_in_midle_of_filter_up_and_sushi on connection_in_midle_of_filter_up_and_sushi.filter_up_id = filter_up.id
join sushi on sushi.id = connection_in_midle_of_filter_up_and_sushi.sushi_id
where `;

  req.params.id.split('&').forEach(value => query+=`filter_up.id = ${value} or`);
  res.json(await prepareMainPage((await sequelize.query(query.slice(0, query.length-3)+';'))[0]));*/
  const for_request = req.params.id.split('&');
  for(let i = 0; i<for_request.length; i++) for_request[i]=`filter_up.id = ${for_request[i]}`;
  res.send(await prepareMainPage((await sequelize.query(`select distinct sushi.* from filter_up
join connection_in_midle_of_filter_up_and_sushi on connection_in_midle_of_filter_up_and_sushi.filter_up_id = filter_up.id
join sushi on sushi.id = connection_in_midle_of_filter_up_and_sushi.sushi_id
where ` + for_request.join(' or ')+';'))[0],do_ingredients=false));
});

app.get('/filter_all/:ingredient/:filter_up', async (req, res)=>{
  let query=`select distinct sushi.* from connection_in_midle_of_filter_ingredients_and_sushi
join connection_in_midle_of_filter_up_and_sushi on connection_in_midle_of_filter_ingredients_and_sushi.sushi_id = connection_in_midle_of_filter_up_and_sushi.sushi_id
join sushi on sushi.id=connection_in_midle_of_filter_up_and_sushi.sushi_id
where `;

  const for_request = [req.params.ingredient.split('&'), req.params.ingredient.split('&')];
  for(let i = 0; i<for_request[0].length; i++) for_request[0][i]=`connection_in_midle_of_filter_ingredients_and_sushi.ingredient_id = ${for_request[0][i]}`;
  for(let i = 0; i<for_request[0].length; i++) for_request[1][i]=`connection_in_midle_of_filter_up_and_sushi.filter_up_id = ${for_request[1][i]}`;
  for(let i = 0; i<2; i++) for_request[i] = for_request[i].join(' or ');
  console.log(1)
  
  //console.log(query+for_request.join(' and ')+';')
  res.send(await prepareMainPage((await sequelize.query(query+for_request.join(' and ')+';'))[0],do_ingredients=false));
});

app.use((req,res,next)=>{
  res.status(404).send('404 not found')
});

app.listen(3000, () => console.log('Сервер запущен на порту 3000 http://localhost:3000'));
