var FloodIt = new Class({
    Implements: [Events, Options],
    options: {
        id : 'flood_it',
        colors : ["#e75e5a", "#ffee60", "#a6bc40", "#a4daef", "#a783b5", "#ffe1ea"]
    },

    initialize: function(){
        //copy out options to object
        var params = Array.link(arguments, {
            'options': Type.isObject
        });
        this.setOptions(params.options || {});

        // some object variables
        this._sq_size = 20;
        this._w = 14;
        this._h = 14;
        this._number_of_colors = 6;
        this._max_steps = 25;
        this._counter = 0;
        this._left_padding = 20;
        this._field = [];
        this._done_sqs = [];
        this._container = document.id(this.options.id);
        this._win_flag = 0;
        //inicialization
        this._field_container = new Element('div', {
            'id': this.options.id + "_field_container",
            'styles': {
                'position' : 'absolute',
                "top" : 0,
                "left" : this._number_of_colors * this._sq_size + this._left_padding,
                "width" : this._sq_size * this._w,
                "height" : this._sq_size * this._h
            }
        });
        this._field_container.inject(this._container, 'top');
        this._color_container = new Element('div', {
            'id': this.options.id + "_field_container",
            'styles': {
                'position' : 'absolute',
                "top" : 0,
                "left" : 0
            }
        });
        this._counter_container = new Element('div', {
            'id': this.options.id + "_counter_container",
            'styles': {
                'position' : 'absolute',
                "top" : 4 * this._sq_size + this._left_padding,
                "left" : 0
            }
        });

        this._field_container.inject(this._container, 'top');
        this._color_container.inject(this._container, 'top');
        this._counter_container.inject(this._container, 'top');
        for (i = 0; i < this._number_of_colors; i++){
            if (i > 2){
                sq_top = this._sq_size * 2;
                sq_left = (i - 3) * this._sq_size * 2;
            } else {
                sq_top = 0;
                sq_left = i * this._sq_size * 2;
            }
            sq = new Element('div', {
                'id': this.options.id + "_color_sq",
                'styles': {
                    'position' : 'absolute',
                    "top" : sq_top,
                    "left" : sq_left,
                    "width" : this._sq_size * 2,
                    "height" : this._sq_size * 2,
                    "background-color" : this.options.colors[i],
                    "cursor" : "pointer"
                }
            });
            sq.inject(this._color_container, 'top');
            sq.addEvent("click", this._color_sq_click());
        }

        this._container.set("styles", {
            "position" : "relative",
            "width" : this._w * this._sq_size,
            "height" : this._w * this._sq_size
        });
        this.options.colors = this.options.colors.slice(0, this._number_of_colors);

        for(i = 0; i < this._h; i++){
            this._field[i] = [];
            for(j = 0; j < this._w; j++){
                this._field[i][j] = this.options.colors[this._random_number(this._number_of_colors)];
            }
        }
        this._currient_color = this._field[0][0];
        //console.log(this._field);
        this._create_field();
        this._draw_field();
        this._set_counter();
    },
    _set_counter : function(){
        this._counter_container.set("text", "Step: " + this._counter + "/" + this._max_steps);
    },
    _color_sq_click : function(){
        obj = this;
        return function(){
            console.log(obj._counter);
            click_color = this.getStyle("background-color");
            if(obj._currient_color != click_color){
                obj._currient_color = click_color;
                obj._counter++;
                if(obj._counter > obj._max_steps || obj._win_flag == 1){
                    return false;
                }
                color = document.id(obj._sq_id(0, 0)).getStyle("background-color");
                w = function(m){
                    for(i = 0; i < m.length; i++){
                        a = "";
                        for(j = 0; j < m[i].length; j++){
                            a += String(m[i][j]);
                        }
                        console.log(a);

                    }
                    console.log("");
                };
                tmp_matrix = [];

                for(i = 0; i < obj._h; i++){
                    tmp_matrix[i] = [];
                    for(j = 0; j < obj._w; j++){
                        if(i == 0 && j == 0){
                            tmp_matrix[i][j] = 1;
                        }
                        else{
                            tmp_matrix[i][j] = 0;
                        }
                    }
                }
                //inizialization tmp_matrix
                for(i = 0; i < obj._h; i++){
                    for(j = 0; j < obj._w; j++){
                        sq = document.id(obj._sq_id(i,j));
                        sq_color = obj._field[i][j];
                        obj._do_matrix(tmp_matrix, sq_color, color);
                    }
                    for(j = obj._w -1; j >= 0; j--){
                        sq = document.id(obj._sq_id(i,j));
                        sq_color = obj._field[i][j];
                        obj._do_matrix(tmp_matrix, sq_color, color);
                    }
                }
                for(i = obj._h - 1; i >= 0; i--){
                    for(j = 0; j < obj._w; j++){
                        sq = document.id(obj._sq_id(i,j));
                        sq_color = obj._field[i][j];
                        obj._do_matrix(tmp_matrix, sq_color, color);
                    }
                    for(j = obj._w -1; j >= 0; j--){
                        sq = document.id(obj._sq_id(i,j));
                        sq_color = obj._field[i][j];
                        obj._do_matrix(tmp_matrix, sq_color, color);
                    }
                }
                for(i = 0; i < obj._h; i++){
                    for(j = 0; j < obj._w; j++){
                        sq = document.id(obj._sq_id(i,j));
                        sq_color = obj._field[i][j];
                        obj._do_matrix(tmp_matrix, sq_color, click_color);
                    }
                }
                for (i = 0; obj._h > i; i++) {
                    for (j = 0; j < obj._w; j++) {
                        if (tmp_matrix[i][j] == 1) {
                            obj._field[i][j] = click_color;
                        }
                    }
                }
                obj._draw_field();
                obj._set_counter();
                win_flag = 1;
                for (i = 0; obj._h > i; i++) {
                    for (j = 0; j < obj._w; j++) {
                        if (obj._field[i][j] != obj._field[0][0]){
                            win_flag = 0;
                        }
                    }
                }
                if(win_flag == 1){
                    obj._you_win();
                    obj._win_flag = 1;
                    return false;
                }
                if(obj._counter == obj._max_steps){
                    obj._game_over();
                }
            }

        }
    },
    _you_win : function(){
        this._counter_container.set("text", "You win.");
    },
    _game_over : function(){
        this._counter_container.set("text", "You lose.");
    },
    _do_matrix : function(tmp_matrix, color_1, color_2){
        if(color_1 == color_2){
            if((i - 1) >= 0){
                if(tmp_matrix[i - 1][j] == 1){
                    tmp_matrix[i][j] = 1;
                }
            }
            if((j - 1) >= 0){
                if(tmp_matrix[i][j - 1] == 1){
                    tmp_matrix[i][j] = 1;
                }
            }
            if((j + 1) < obj._w){
                if(tmp_matrix[i][j + 1] == 1){
                    tmp_matrix[i][j] = 1;
                }
            }
            if((i + 1) < obj._h){
                if(tmp_matrix[i + 1][j] == 1){
                    tmp_matrix[i][j] = 1;
                }
            }
        }
        return tmp_matrix;
    },
    _draw_field : function(){
        for(i = 0; i < this._h; i++){
            for(j = 0; j < this._w; j++){
                document.id(this._sq_id(i, j)).setStyle("background-color" , this._field[i][j]);
            }
        }
    },
    _create_field : function(){
        for(i = 0; i < this._h; i++){
            for(j = 0; j < this._w; j++){
                sq = new Element('div', {
                    'id': this._sq_id(i, j),
                    'styles': {
                        'position' : 'absolute',
                        "top" : i * this._sq_size,
                        "left" : j * this._sq_size,
                        "width" : this._sq_size,
                        "height" : this._sq_size
                    }
                });
                sq.inject(this._field_container, 'top');
            }
        }
    },
    _sq_id : function(i, j){
        return this.options.id + '_sq_' + i + "_" + j;
    },
    _random_number : function(n){
        n = parseInt(n);
        return Math.floor( Math.random() * n );
    }
});
