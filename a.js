/*const { get_information_about_sushi }=require('./my_modules/get_information_about_sushi.js');
(async()=>{
    console.log(await get_information_about_sushi())
})()*/

/*((a=true)=>{
    console.log(a);
})()*/

//const { prepareMainPage } = require('./my_modules/prepare_main_page');

const { sequelize } = require('./my_modules/connect_to_database.js');
const { prepareMainPage } = require('./my_modules/prepare_main_page.js');

(async()=>{

    const for_request = '1&2'.split('&');
    for(let i = 0; i<for_request.length; i++) for_request[i]=`filter_ingredients.id = ${for_request[i]}`;
    console.log(await prepareMainPage((await sequelize.query(`select sushi.* from filter_ingredients
join connection_in_midle_of_filter_ingredients_and_sushi on connection_in_midle_of_filter_ingredients_and_sushi.ingredient_id = filter_ingredients.id
join sushi on sushi.id = connection_in_midle_of_filter_ingredients_and_sushi.sushi_id
where ` + for_request.join(' or ')+';'))[0],do_ingredients=false))
})()