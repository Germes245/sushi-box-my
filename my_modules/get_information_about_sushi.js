const { sequelize } = require('./connect_to_database.js');
async function get_information_about_sushi (){/*
    let sushi=[];
    for(let i=1;i<=(await sequelize.query('select max(id) from sushi'))[0][0].max;i++){
        sushi.push((await sequelize.query(`SELECT * FROM sushi WHERE sushi.id = ${i};`))[0][0]);
    };*/
    return (await sequelize.query(`SELECT * FROM sushi;`))[0];
};
module.exports = { get_information_about_sushi };
//(async()=>console.log(await get_information_about_sushi()))()