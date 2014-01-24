//Game class
function Game(){
    this.current_player = 0;
    this.players = [];
    this.deck = null;
    //num of players and name of players must be same,
    //pass computer 1, computer 2, etc... for computer players
    this.initialize_game = function(num_of_players, name_of_players){
        var deck_instance = new deck;
        var round_instance = new round;
        for(var i = 0; i< num_of_players; i++){
            this.players[i] = new player;
            this.players[i].name = name_of_players[i];
            this.players[i].hand_area = 'player_'+i+'_hand';

        }
        this.deck = deck_instance.build_deck();

        return 	{'deck_instance': deck_instance, 'round_instance': round_instance};
    };

    this.new_round = function(game_constants){
        var _deck_instance = game_constants.deck_instance;
        var _round = game_constants.round || 0;
        var _round_instance = game_constants.round_instance;
        var _discard_pile = [];
        var deal_return = [];

        this.deck = _deck_instance.shuffle(this.deck);
        _round = _round_instance.get_round(_round);

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

        return {'round_instance': _round_instance, 'round': _round, 'deck_instance': _deck_instance, 'discard_pile': _discard_pile};
    };

    this.update_current_player = function(){
        this.current_player++;
    };
    this.return_players = function(){
        return this.players;
    };
}


function round() {
    this.get_round = function(cur_round){
        return ++cur_round;
    };
}

Game.prototype.draw_game = function(round_constants){
    var screen = id("main_screen");
    var deck_area = id("deck_and_discard");
    var player_1_area = id("player_1_hand");
    var player_2_area = id("player_2_hand");
    var player_3_area = id("player_3_hand");
    var player_4_area = id("player_4_hand");

    var _deck = document.createElement('div');
    var discard = document.createElement('div');
    
    discard.setAttribute('id', 'discard_pile');
    discard.setAttribute('class', 'discard_pile');
    discard.setAttribute('data-element', 'discard');
	discard.innerHTML = round_constants.discard_pile[round_constants.discard_pile.length - 1].display;
	
    _deck.setAttribute("id", 'playing_deck');
    _deck.setAttribute('class', "cards back");
    _deck.setAttribute('data-element', 'deck');

    deck_area.appendChild(_deck);
    deck_area.appendChild(discard);

    //TODO This needs to be cleaned up I am sure there is a better way to determine how many hands need to be shown.
    for (var i = 0; i< round_constants.round + 2; i++){
        player_1_area.innerHTML += this.players[0].hand[i].display;
        player_2_area.innerHTML += this.players[1].hand[i].display;
        if(this.players.length > 2){
            player_3_area.innerHTML += this.players[2].hand[i].display;
            if(this.players.length > 3){
                player_4_area.innerHTML += this.players[3].hand[i].display;
            }
        }
    }
};

Game.prototype.draw_current_players_hand = function(_game){
	var player = _game.players[_game.current_player];
	var position = player.hand_area;
			
	switch(position){
		case 'player_0_hand':
		{
			var hand = id('player_1_hand');
			hand.innerHTML = ''; 
			for(var i =0; i <  player.hand.length; i++){
				hand.innerHTML += player.hand[i].display;	
			}
			break;		
		}		
		case 'player_1_hand':
		{
			var hand = id('player_2_hand');
			hand.innerHTML = ''; 
			for(var i =0; i <  player.hand.length; i++){
				hand.innerHTML += player.hand[i].display;	
			}
			break;		
		}		
		case 'player_2_hand':
		{
			var hand = id('player_3_hand');
			hand.innerHTML = ''; 
			for(var i =0; i <  player.hand.length; i++){
				hand.innerHTML += player.hand[i].display;	
			}
			break;		
		}		
		case 'player_3_hand':
		{
			var hand = id('player_4_hand');
			hand.innerHTML = ''; 
			for(var i =0; i <  player.hand.length; i++){
				hand.innerHTML += player.hand[i].display;	
			}
			break;		
		}
	}
};

Game.prototype.draw_discard_pile = function(round_constants){
    var visual_discard_pile = id("discard_pile");
	var discard_pile = round_constants.discard_pile;
	
	if(discard_pile.length > 0){
	    visual_discard_pile.innerHTML = discard_pile[discard_pile.length - 1].display;	
	}else{
		visual_discard_pile.innerHTML = '';
	}
};

Game.prototype.handle_events = function(event, _game, round_constants){
    /* _game.current_player returns a numerical value, 
     * which is why it's being used as a lookup index, 
     * not just being stored into _current_player
    */
	var _current_player = _game.players[_game.current_player];
	console.log(_current_player);
	//Need to get the parent element, because cards don't have id's, so the initial click on the discard pile is on a card and not the 'discard pile',  	
	if(event.target.id == '' && event.target.id != 'playing_deck'){
		var element_data = event.target.parentElement.getAttribute('data-element');	
	}else{
		var element_data = event.target.getAttribute('data-element');
	}

    if(_current_player.can_player_move(element_data)){ 
        switch(element_data){
            case 'deck':{
                _current_player.draw_from_deck_or_discard(_game.deck, 'deck');
                this.draw_current_players_hand(_game);
                break;
            }
            case 'discard':{
            	_current_player.draw_from_deck_or_discard(round_constants.discard_pile, 'discard');
            	this.draw_current_players_hand(_game);
            	this.draw_discard_pile(round_constants);
            	break;
            }
            case _current_player.hand_area:{
				round_constants.discard_pile = _current_player.discard(event.target, round_constants.discard_pile);
				this.draw_current_players_hand(_game);
				this.draw_discard_pile(round_constants);
				break;
            }
            case 'end_turn':{
            	_game.current_player = _current_player.end_turn(_game);
            	break;
            }
            case 'lay_down':{
            	var result = _current_player.lay_down(_current_player.hand);
            	console.log(result);
            	break;	
            }
        }
    }
};