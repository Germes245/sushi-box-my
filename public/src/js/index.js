document.addEventListener('DOMContentLoaded', () => {
    const rolls=document.querySelector('#rolls');
    const ingredients=document.querySelectorAll('.button_ingredient');
    const filter_up=document.querySelectorAll('.active_buttons_for_filter');
    const reset_all=document.querySelector('.reset_all');
    const busket_window = document.querySelector('#busket_window');
    const array_which_ingredients_pressed={"active_buttons_for_filter": {'1':false,'2':false,'3':false},"button_ingredient": {}};
    for(let i of Object.keys(localStorage)){
        console.log(i);
        const block=document.getElementById(`susha_${i}`);
        block.addEventListener('click', event_for_plus_and_minus);
        const container=block.querySelector('.button_container');
        container.style='display: flex;';
        container.innerHTML=`<button class="minus_and_plus" data-value="-1">-</button>
                <span id="span_${i}">${localStorage[i]}</span>
                <button class="minus_and_plus" data-value="1">+</button>`
    }
    const limiter = 2;
    let location = 0;

    document.querySelector('.busket_button').addEventListener('click', evt => {
        const element=evt.target;
        if(!(busket_window.classList.contains('flex'))){
            console.log(1)
        }
        busket_window.classList.toggle('flex');

    });

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

    function to_reset_all(){
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
    function event_for_plus_and_minus(evt){
        console.log('a')
        const id=evt.target.parentElement.dataset.value
        value_for_score=Number(localStorage.getItem(id)) + Number(evt.target.dataset.value);
        if(value_for_score>0){
            document.querySelector(`#span_${id}`).innerHTML=value_for_score;
            localStorage.setItem(id, value_for_score);
        }
        else{
            localStorage.removeItem(id);
            evt.target.parentElement.style='';
            evt.target.parentElement.innerHTML='<button class="add_susha">Беру</button>';
        }
    }
    document.querySelectorAll('.add_susha').forEach(value => {
        value.addEventListener('click', evt => {
            const block=evt.target.parentElement
            console.log(evt.target.parentElement)
            localStorage.setItem(block.dataset.value, '1')
            block.style='display: flex;'
            console.log(block)
            block.innerHTML=`<button class="minus_and_plus" data-value="-1">-</button>
                <span id="span_${block.dataset.value}">1</span>
                <button class="minus_and_plus" data-value="1">+</button>
            `;
            document.querySelectorAll('.minus_and_plus').forEach(value => {
                value.addEventListener('click', event_for_plus_and_minus)
            })
        });
    });
    console.log(array_which_ingredients_pressed)
});