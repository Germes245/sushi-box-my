select sushi.* from filter_up
join connection_in_midle_of_filter_up_and_sushi on connection_in_midle_of_filter_up_and_sushi.filter_up_id = filter_up.id
join sushi on sushi.id = connection_in_midle_of_filter_up_and_sushi.sushi_id
where filter_up.id = 2;