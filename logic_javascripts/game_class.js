/* global _game */
/* global game_constants */

//Game class
function Game(){
    this.current_player = 0;
    this.players = [];
    this.deck = null;
    this.round_constants = {};
}

//num of players and name of players must be same,
//pass computer 1, computer 2, etc... for computer players
Game.prototype.initialize_game = function(num_of_players, name_of_players){
    var deck_instance = new Deck();
    var round_instance = new Round();
    for(var i = 0; i< num_of_players; i++){
        this.players[i] = new Player();
        this.players[i].name = name_of_players[i];
        var hand_num = i + 1;
        this.players[i].hand_area = 'player_'+hand_num+'_hand';

    }

    return 	{'deck_instance': deck_instance, 'round_instance': round_instance};
};

Game.prototype.new_round = function(game_constants){
    var _deck_instance = game_constants.deck_instance;
    var _round_instance = game_constants.round_instance;

    var _discard_pile = [];
    var deal_return = [];
    
    this.deck = _deck_instance.build_deck();
    this.deck = _deck_instance.shuffle(this.deck);
    var _round = _round_instance.get_round();
    
    //reset the discard pile and round ending vars before re-assigning them.
    if(_round > 1){
        this.reset_constants();
    }
    
    for(var i = 0; i < this.players.length; i++){
        if(i == 0){
            deal_return	= this.players[i].deal(this.deck, _round);
        }else{
            deal_return = this.players[i].deal(deal_return.deck_ref, _round);
        }
        this.players[i].hand = deal_return.hand;
    }

    //turn over the first card of the game
    //this will always be the zero index of the discard pile
    _discard_pile[0] = deal_return.deck_ref.pop();

    this.round_constants = {
        'round_instance': _round_instance,
        'round': _round,
        'deck_instance': _deck_instance,
        'discard_pile': _discard_pile
    };
    return this.round_constants;
};

Game.prototype.reset_constants = function(){
    this.round_constants.discard_pile = [];

    for(var i = 0; i < this.players.length; i++){
        this.players[i].has_been_scored = false;
    }

    this.round_constants.round_instance.round_ending = {
        is_ending: false,
        player_out: null
    };
};

Game.prototype.draw_game = function(){
    var deck_area = id("deck_and_discard");
    var player_1_area = id("player_1_hand");
    var player_2_area = id("player_2_hand");
    var player_3_area = id("player_3_hand");
    var player_4_area = id("player_4_hand");

    var _deck = document.createElement('div');
    var discard = document.createElement('div');
    var settings = window.localStorage.getItem('settings');
    
    discard.setAttribute('id', 'discard_pile');
    discard.setAttribute('class', 'discard_pile');
    discard.setAttribute('data-element', 'discard');
	discard.innerHTML = this.round_constants.discard_pile[this.round_constants.discard_pile.length - 1].display;
	
    _deck.setAttribute("id", 'playing_deck');
    _deck.setAttribute('class', "cards back");
    _deck.setAttribute('data-element', 'deck');

	deck_area.innerHTML = '';

    deck_area.appendChild(_deck);
    deck_area.appendChild(discard);
    
    player_1_area.innerHTML = '';
	player_2_area.innerHTML = '';
	player_3_area.innerHTML = '';
	player_4_area.innerHTML = '';
	
	
    //TODO This needs to be cleaned up I am sure there is a better way to determine how many hands need to be shown.
    for (var i = 0; i< this.round_constants.round + 2; i++){
        for(var j = 0; j < this.players.length; j++){
            if(JSON.parse(settings).sort_cards){
                this.players[j].sort_player_cards();
            }    
        }
        player_1_area.innerHTML += this.players[0].hand[i].display;
        player_2_area.innerHTML += this.players[1].hand[i].display;
        if(this.players.length > 2){
            player_3_area.innerHTML += this.players[2].hand[i].display;
            if(this.players.length > 3){
                player_4_area.innerHTML += this.players[3].hand[i].display;
            }
        }

    }
    this.draw_player_scores();
    
    this.rotate_players_cards_beginning_game(this.players[this.current_player]);
};


Game.prototype.undraw_game = function(){
    var deck_area = id("deck_and_discard");
    var player_1_area = id("player_1_hand");
    var player_2_area = id("player_2_hand");
    var player_3_area = id("player_3_hand");
    var player_4_area = id("player_4_hand");
    
    deck_area.innerHTML = '';
    
    player_1_area.innerHTML = '';
    player_2_area.innerHTML = '';
    player_3_area.innerHTML = '';
    player_4_area.innerHTML = '';   
};

Game.prototype.draw_player_scores = function(){
	var player_1_score = id('player_1_score');
	var player_2_score = id('player_2_score');
	var player_3_score = id('player_3_score');
	var player_4_score = id('player_4_score');
	
	player_1_score.innerHTML = this.players[0].name + ' ' +this.players[0].score;
	player_2_score.innerHTML = this.players[1].name + ' ' +this.players[1].score;
	if(this.players.length > 2){
		player_3_score.innerHTML = this.players[2].name + ' ' +this.players[2].score;
		if(this.players.length > 3){
			player_4_score.innerHTML = this.players[3].name + ' ' +this.players[3].score;
		}
	}
};

Game.prototype.rotate_players_cards_beginning_game = function(_current_player){
    var hand_areas = [].slice.call(document.querySelectorAll('.hand_area'));

    hand_areas.forEach(function(area){
       if(area.getAttribute('id') !== _current_player.hand_area){
           var cards = [].slice.call(area.querySelectorAll('div'));
           cards.forEach(function(card){
               card.classList.add('no_transition');
               if(card.getAttribute('data-element') == 'joker1'){
                   card.classList.remove('joker');
               }else{
                  card.classList.add('cards');
                  card.classList.remove('card'); 
               }
               card.classList.add('back');
               card.classList.add('no_transition');
           });
       }
    });
};


Game.prototype.rotate_players_cards = function(_current_player){
    var hand_area = id(_current_player.hand_area);
    var next_player = this.current_player + 1;
    var next_hand_area = id('player_'+next_player+'_hand');
    var cards = [].slice.call(hand_area.querySelectorAll('div'));
    var next_players_cards = [].slice.call(next_hand_area.querySelectorAll('div'));
    
    cards.forEach(function(card){
        card.classList.add('rotated_90');
    });
    window.setTimeout(function(){
        cards.forEach(function(card){
            if(card.getAttribute('data-element') == 'joker1'){
                card.classList.remove('joker');
            }else{
               card.classList.add('cards');
               card.classList.remove('card'); 
            }
            card.classList.add('back');
            card.classList.add('no_transition');

        });
        window.setTimeout(function(){
            cards.forEach(function(card){
                card.classList.remove('no_transition');
                card.classList.remove('rotated_90');
            });            
        },20);
    }, 1001);
    window.setTimeout(function(){
        next_players_cards.forEach(function(card){
            card.classList.remove('no_transition');
            card.classList.add('rotated_90');
        });
        window.setTimeout(function(){
            next_players_cards.forEach(function(card){
                if(card.getAttribute('data-element') == 'joker1'){
                    card.classList.add('joker');
                }else{
                    card.classList.remove('cards');
                    card.classList.add('card');
                }
                card.classList.remove('back');
                card.classList.add('no_transition');  
            });
            window.setTimeout(function(){
                next_players_cards.forEach(function(card){
                    card.classList.remove('no_transition');
                    card.classList.remove('rotated_90');
                });                
            },20);  
        },1001);
    },1050);
};

Game.prototype.draw_current_players_hand = function(){
	var player = this.players[this.current_player];
	var position = player.hand_area;
    var hand = null;
    var settings = window.localStorage.getItem('settings');
    
    if(JSON.parse(settings).sort_cards){
        player.sort_player_cards();
    }
        
	switch(position){
		case 'player_1_hand':
		{
			hand = id('player_1_hand');
			hand.innerHTML = '';
			for(var i =0; i <  player.hand.length; i++){
				hand.innerHTML += player.hand[i].display;
			}
			break;
		}
		case 'player_2_hand':
		{
			hand = id('player_2_hand');
			hand.innerHTML = '';
			for(var i =0; i <  player.hand.length; i++){
				hand.innerHTML += player.hand[i].display;
			}
			break;
		}
		case 'player_3_hand':
		{
			hand = id('player_3_hand');
			hand.innerHTML = '';
			for(var i =0; i <  player.hand.length; i++){
				hand.innerHTML += player.hand[i].display;
			}
			break;
		}
		case 'player_4_hand':
		{
			hand = id('player_4_hand');
			hand.innerHTML = '';
			for(var i =0; i <  player.hand.length; i++){
				hand.innerHTML += player.hand[i].display;
			}
			break;
		}
	}
};

Game.prototype.draw_discard_pile = function(){
    var visual_discard_pile = id("discard_pile");
    var discard_pile = this.round_constants.discard_pile;

	if(this.round_constants.discard_pile.length > 0){
	    visual_discard_pile.innerHTML = discard_pile[discard_pile.length - 1].display;
	}else{
		visual_discard_pile.innerHTML = '';
	}
};

Game.prototype.end_game = function(){
    var winning_player = [];
    var top_score = 950; //worst possible score in game without making a mistake 
    var statement = null;
        
    for(var i = 0; i < this.players.length; i++){
        if(this.players[i].score < top_score){
            top_score = this.players[i].score;
            winning_player = []; //set to empty incase there were already 2 players in here with the same score
            winning_player[0] = i;
        }else if(this.players[i].score === top_score){
            //for ties
            if(winning_player === []){
                winning_player[0] = i;
            }else{
                winning_player.push(i);
            }
        }            
    }

    if(winning_player.length > 1){
        statement = 'Players: '
        for(var i = 0; i < winning_player.length; i++){
            statement + this.players[winning_player[i]].name + ',';
        }
        statement + 'have won the game!';
    }else{
        statement = 'Player:' + this.players[winning_player[0]].name + ' has won the game!';
    }
    alert(statement);
    end_game();        
};

Game.prototype.handle_events = function(event){
    /* _game.current_player returns a numerical value, 
     * which is why it's being used as a lookup index, 
     * not just being stored into _current_player
    */

   	var round_instance = this.round_constants.round_instance;
	var _current_player = this.players[this.current_player];
	var element_data = null;

	//Need to get the parent element, because cards don't have id's, so the initial click on the discard pile is on a card and not the 'discard pile',  	
	if(typeof event == 'string'){
		element_data = event;	
	}else if(event.target.id == ''){
		element_data = event.target.parentElement.getAttribute('data-element');	
	}else{
		element_data = event.target.getAttribute('data-element');
	}

    if(_current_player.can_player_move(element_data) || element_data == 'end_round'){ 
        switch(element_data){
            case 'deck':{
                _current_player.draw_from_deck_or_discard(this.deck, 'deck');
                this.draw_current_players_hand();
                break;
            }
            case 'discard':{
            	_current_player.draw_from_deck_or_discard(this.round_constants, 'discard');
            	this.draw_current_players_hand();
            	this.draw_discard_pile();
            	break;
            }
            case _current_player.hand_area:{
                _current_player.discard(event.target, this.round_constants);
				this.draw_current_players_hand();
				this.draw_discard_pile();
				break;
            }
            case 'end_turn':{
            	this.current_player = _current_player.end_turn(this);
            	if(round_instance.round_ending.is_ending == true && this.current_player == round_instance.round_ending.player_out){
            		if(_current_player.has_been_scored != true){
                        var result = _current_player.lay_down(_current_player.hand)
            			_current_player.running_score_total(result);	
            		}
                    this.handle_events('end_round');
                    break;
            	}else if(round_instance.round_ending.is_ending == true && this.current_player != round_instance.round_ending.player_out){
            		if(_current_player.has_been_scored != true){
                        var result = _current_player.lay_down(_current_player.hand)
            			_current_player.running_score_total(result);
            		}
            		this.rotate_players_cards(_current_player);
            		break;            	
            	}
            	if(round_instance.round_ending.is_ending == false){
            	    this.rotate_players_cards(_current_player);
            	}         	
            	break;
            }
            case 'lay_down':{
            	var result = _current_player.lay_down(_current_player.hand);

            	if(round_instance.round_ending.is_ending == false){
                	if(result == 0){
                	    alert(_current_player.name + " is laying down their hand!");
                	    round_instance.round_ending.is_ending = true;
                        round_instance.round_ending.player_out = this.current_player;
                        _current_player.running_score_total(result);  
                	}else if(result != 0){
                	    alert("You don't have the cards to do that right now!");
                	}  
            	}else{
                    //tally the score now if not let end turn handle it, it will pass a 0 which means no laydown.
                    _current_player.running_score_total(result); 
            	}
            	this.handle_events('end_turn');
                break;
            		
            }
            case 'end_round':{
                if(round_instance.round === 11){
                    this.end_game();
                }else{
                    Main();
                }
                break;
            }
        }
    }else{
        alert('You can not do that action yet!');
    }
};

//Round Class
function Round() {
    this.round = 0;
    this.get_round = function(){
        return ++this.round;
    };
    this.round_ending = {
        is_ending: false,
        player_out: null
    };
}