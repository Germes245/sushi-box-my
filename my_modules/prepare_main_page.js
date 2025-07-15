const { sequelize } = require('./connect_to_database.js');
const { get_information_about_sushi } = require('./get_information_about_sushi.js')

async function prepareMainPage(allSushi, do_ingredients=true) {
    const information_for_main_page={};
    for(let value of allSushi){
        let string = '';
        const result = await Promise.all(
        (await sequelize.query(`select filter_up_id from connection_in_midle_of_filter_up_and_sushi
            where sushi_id = ${value.id};`))[0].map(async value => {
            const data = (await sequelize.query(`select name, pictur from filter_up where id=${value.filter_up_id};`))[0];
            console.log(data)
            data.forEach(value => {
                string+=`<div class="mark">
                    <div class="pict" style="background-image: url('${value.pictur}');"></div>
                    <span>${value.name}</span>
                    </div>`
            });
            console.log(`filter up: ${string}`)
        }));

        console.log(result);
        if(!(value.type_of_rolla in information_for_main_page)){
            information_for_main_page[value.type_of_rolla]=''
        };
        information_for_main_page[value.type_of_rolla] += `<div class="card_for_rols">
                    <div class="hit_and_new">
                        <div class="for_hit_and_new orange">ХИТ</div>
                        <div class="for_hit_and_new blue">NEW</div>
                    </div>
                    <div class="img" style="background-image: url('${value.link_of_picture}')"></div>
                    <div class="name_of_product">
                        <span>${value.name}</span>
                        <div id="container_for_upper_ungredients">
                            ${string}
                        </div>
                    </div>
                    <div class="text_for_card">${value.description}</div>
                    <div class="price">
                        <span>${value.cost} ₽</span>
                    </div>
                </div>`;
    };
    /*
    for(i=1;i<=(await sequelize.query('select max(id) from filter_ingredients;'))[0][0].max;i++){
        const query = (await sequelize.query(`SELECT name, link_of_picture FROM filter_ingredients WHERE id = ${i}`))[0][0];
        ingredients+=`<button class="button_ingredient" id="${i}">
                    <span>${query.name}</span>
                    <div style="background-image: url('${query.link_of_picture}');"></div>
                </button>`;
    };
    */
    let rolls='';
    if(do_ingredients){
        let ingredients='';
        (await sequelize.query('select * from filter_ingredients;'))[0].forEach(value => {
            ingredients+=`<button class="button_ingredient" value="${value.id}">
                        <span>${value.name}</span>
                        <div style="background-image: url('${value.link_of_picture}');"></div>
                    </button>`;
        });
        for(i of Object.keys(information_for_main_page)){
            rolls+=`<h1>${(await sequelize.query(`select type_of_rolla from type_of_rolla where id=${i};`))[0][0].type_of_rolla}</h1>
            <div class="rols" id="rolla_clasica">
                ${information_for_main_page[i]}
            </div>`;
        };

        return {ingredients, rolls};
    }
    else{
        for(i of Object.keys(information_for_main_page)){
            rolls+=`<h1>${(await sequelize.query(`select type_of_rolla from type_of_rolla where id=${i};`))[0][0].type_of_rolla}</h1>
            <div class="rols" id="rolla_clasica">
                ${information_for_main_page[i]}
            </div>`;
        };

        return rolls;
    }
}
//(async ()=>console.log(await prepareMainPage(await get_information_about_sushi(),do_ingredients=false)))()

module.exports = { prepareMainPage };