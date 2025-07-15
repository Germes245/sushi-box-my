document.addEventListener('DOMContentLoaded', () => {
    const rolls=document.querySelector('#rolls');
    const ingredients=document.querySelectorAll('.button_ingredient');
    const filter_up=document.querySelectorAll('.active_buttons_for_filter');
    const reset_all=document.querySelector('.reset_all');
    const array_which_ingredients_pressed={"active_buttons_for_filter": {'1':false,'2':false,'3':false},"button_ingredient": {}};
    const limiter = 2;
    let location = 0;

    function show_or_hide_the_button_reset_all(){
        for(let value of Object.values(array_which_ingredients_pressed)){
            console.log(Object.values(value).includes(true))
            if(Object.values(value).includes(true)){
                reset_all.style='';
                break
            }
            else{
                reset_all.style='display: none;';
            }
        };
    }

    function move(direct) {
        if (direct) {
        location += location < limiter;
        } else {
        location -= location > 0;
        }
        console.log(location);
        document.querySelector('.slides').style.transform =
        `translateX(-${[`${location * 94.5}vw`, `${location * 1208}px`][Number(window.innerWidth > 1265)]})`;
    }

    /*function learn_selected_buttons(){
        return Object.values(array_which_ingredients_pressed).map(value => Object.values(value)).map(value => value.includes(true))
    }*/

    function to_reset_all(){
        /*console.log(array_which_ingredients_pressed);
        const array_before_request=[[],[]]
        for(let i of Object.keys(array_which_ingredients_pressed['button_ingredient'])){
            if(array_which_ingredients_pressed['button_ingredient'][i]) array_before_request[0].push(i);
        };
        for(let i of Object.keys(array_which_ingredients_pressed['active_buttons_for_filter'])){
            if(array_which_ingredients_pressed['active_buttons_for_filter'][i]) array_before_request[1].push(i);
        }
        console.log('array_before_request',array_before_request);

        for(let i of array_before_request){
            console.log(i)
            if(i.length !== 0){
                for(let key of Object.keys(array_which_ingredients_pressed)){
                    for(let key_of_element of Object.keys(array_which_ingredients_pressed[key])){
                        console.log(`${key_of_element}: ${array_which_ingredients_pressed[key][key_of_element]}`)
                        array_which_ingredients_pressed[key][key_of_element]=false;
                        
                    }
                    document.querySelectorAll('.active_buttons_for_filter').forEach(value => {
                        console.log(value)
                    });
                }
                break
            }
        }
        document.querySelectorAll('.active_buttons_for_filter').forEach(value => {
            value.style=''
        });
        console.log('------')*/
        for(let j of Object.keys(array_which_ingredients_pressed['active_buttons_for_filter'])){
            array_which_ingredients_pressed['active_buttons_for_filter'][j]=false
        };
        ingredients.forEach(value => {
            value.style=''
        });
        for(let j of Object.keys(array_which_ingredients_pressed['button_ingredient'])){
            array_which_ingredients_pressed['button_ingredient'][j]=false
        };
        filter_up.forEach(value => {
            value.style=''
        });
        show_or_hide_the_button_reset_all();
        to_filter();
    };

    function when_pressed_ingredients_or_up(shya, sha){
        let array_of_pressed_buttons=[]
        for(let key of Object.keys(array_which_ingredients_pressed[shya])){
            if(array_which_ingredients_pressed[shya][key]){
                array_of_pressed_buttons.push(key)
            }
        }
        fetch(`/${sha}/${array_of_pressed_buttons.join('&')}`)
        .then(data => data.text())
        .then(data => rolls.innerHTML = data)
    }

    function to_filter(){
        let to_learn_selected_buttons = JSON.parse(JSON.stringify(array_which_ingredients_pressed));
        for(let key of Object.keys(array_which_ingredients_pressed)){
            to_learn_selected_buttons[key]=Object.values(to_learn_selected_buttons[key]).includes(true);
        };
        if(JSON.stringify(to_learn_selected_buttons)==='{"active_buttons_for_filter":false,"button_ingredient":false}'){
            console.log(1);
            fetch('/get_all_sushi/')
            .then(data => data.text())
            .then(data => rolls.innerHTML = data)
        }
        else if(JSON.stringify(to_learn_selected_buttons)==='{"active_buttons_for_filter":false,"button_ingredient":true}'){
            console.log(2)
            when_pressed_ingredients_or_up('button_ingredient','filter_igredient')
        }
        else if(JSON.stringify(to_learn_selected_buttons)==='{"active_buttons_for_filter":true,"button_ingredient":false}'){
            console.log(3)
            when_pressed_ingredients_or_up('active_buttons_for_filter', 'filter_up')
        }
        else{
            console.log(4)
            let array_of_ingredients=[]
            for(let key of Object.keys(array_which_ingredients_pressed['button_ingredient'])){
                if(array_which_ingredients_pressed['button_ingredient'][key]){
                    array_of_ingredients.push(key)
                }
            };
            let array_of_up=[]
            for(let key of Object.keys(array_which_ingredients_pressed['active_buttons_for_filter'])){
                if(array_which_ingredients_pressed['active_buttons_for_filter'][key]){
                    array_of_up.push(key)
                }
            };
            fetch(`/filter_all/${array_of_ingredients.join('&')}/${array_of_up.join('&')}`)
            .then(data => data.text())
            .then(data => rolls.innerHTML = data)
        }
    }

    document.querySelector('.left-arrow').addEventListener('click', function () {
        move(0);
    });
    document.querySelector('.right-arrow').addEventListener('click', function () {
        move(1);
    });

    /*ingredients.forEach((element) => {
        array_which_ingredients_pressed[element.id]=false;
        element.addEventListener('click', (evt)=>{
            let this_button=evt.target;

            if(!(this_button.className.includes('ingredients'))){
                this_button=this_button.parentElement;
            }

            console.log(this_button.className)

            if(array_which_ingredients_pressed[this_button.id]){
                this_button.style=''
            }
            else{
                this_button.style='border: 2px solid yellow'
            }
            array_which_ingredients_pressed[this_button.id]=array_which_ingredients_pressed[this_button.id]===false;
            show_or_hide_the_button_reset_all();
            let before_sending='/filter_igredient/';
            for([key,value] of Object.entries(array_which_ingredients_pressed)){
                if(value){
                    before_sending+=`${key}&`;
                }
            };
            before_sending=before_sending.slice(0,before_sending.length-1);
            fetch(before_sending)
            .then(data => data.json())
            .then(data => document.querySelector('#rolls').innerHTML=data.rolls);
        });
    });
    reset_all.addEventListener('click', (evt)=>{
        let i;
        for(i of Object.keys(array_which_ingredients_pressed)){
            array_which_ingredients_pressed[i]=false;
        }
        for(i of ingredients){
            i.style=''
        }
        fetch('/filter_igredient/')
        .then(data => data.json())
        .then(data => document.querySelector('#rolls').innerHTML=data.rolls);
        reset_all.style='display: none;';
    })
    console.log(ingredients)
    ingredients.forEach((element) => {
        array_which_ingredients_pressed["button_ingredient"][element.id]=false;
        element.addEventListener('click', (evt)=>{
            let this_button=evt.target;

            if(!(this_button.className.includes('ingredients'))){
                this_button=this_button.parentElement;
            };

            if(array_which_ingredients_pressed["button_ingredient"][this_button.id]){
                this_button.style=''
            }
            else{
                this_button.style='border: 2px solid yellow'
            }
        });
        console.log(array_which_ingredients_pressed)
    });*/

    reset_all.addEventListener('click', to_reset_all);

    ingredients.forEach(element => {
        console.log(element);
        array_which_ingredients_pressed["button_ingredient"][element.value]=false;
        element.addEventListener('click', (evt)=>{
            let this_button=evt.target;
            if(!(this_button.className.includes('button_ingredient'))){
                this_button=this_button.parentElement;
            };
            console.log(array_which_ingredients_pressed["button_ingredient"][this_button.value]);
            if(array_which_ingredients_pressed["button_ingredient"][this_button.value]){
                this_button.style=''
            }
            else{
                this_button.style='border: 2px solid yellow'
            };
            array_which_ingredients_pressed["button_ingredient"][this_button.value]=array_which_ingredients_pressed["button_ingredient"][this_button.value]==false;
            show_or_hide_the_button_reset_all();
            to_filter();
        })
    });
    filter_up.forEach(element => {
        console.log(element);
        element.addEventListener('click', evt => {
            let this_button=evt.target;
            if(!(this_button.className.includes('active_buttons_for_filter'))){
                this_button=this_button.parentElement;
            };
            if(array_which_ingredients_pressed["active_buttons_for_filter"][this_button.value]){
                this_button.style=''
            }
            else{
                this_button.style='border: 2px solid yellow'
            };
            array_which_ingredients_pressed["active_buttons_for_filter"][this_button.value]=array_which_ingredients_pressed["active_buttons_for_filter"][this_button.value]==false;
            show_or_hide_the_button_reset_all();
            to_filter();
        });
    });
    console.log(array_which_ingredients_pressed)
});