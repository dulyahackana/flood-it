var Moo_dps = new Class({
    Implements: [Events, Options],
    options: {
        name: 'Цена',
        values: [],
        id : '',
        select_id : '',
        active_color: '#ef3c3c',
        interval_height : 5,
        interval_color : '#a1a1a1',
        width : 300,
        labels : 5
    },

    initialize: function(){
        var params = Array.link(arguments, {
            'options': Type.isObject
        });
        this.setOptions(params.options || {});

        this.options.values = [];
        this.options.values[0] = [];
        this.options.values[1] = [];

        this.left_select = $(this.options.left_id);
        this.right_select = $(this.options.right_id);
        select_options = $$('#' + this.options.left_id + ' option');
        for(var i = 0; i < select_options.length; i++){
            this.options.values[0][i] = select_options[i].getProperty('value');
            this.options.values[1][i] = select_options[i].getProperty('text');
        }

        this.intervals = this.options.values[0].length - 1;
        this.step_size = parseInt(this.options.width / this.intervals);
        this.options.width = this.step_size * this.intervals;

        this.slider_div = $(this.options.id);
        this.slider_div.addClass('mdps_main');
        this.wrapper_div = new Element('div', {
            'id': this.options.id + '_slider_wrapper',
            'styles': {
                'position' : 'relative'
            }
        });
        this.wrapper_div.inject(this.slider_div, 'top');
        this.numbers_div = new Element('div', {
            'id': this.options.id + '_numbers',
            'styles': {
                'position' : 'relative',
                'height' : "20px"
            }
        });
        this.numbers_div.inject(this.slider_div, 'top')
        this.pin1 = new Element('div',{
            'id' : this.options.id + '_pin1',
            'class' : 'mdps_pin',
            'styles' : {
                'left' : this.step_size * 0 + 'px'
            }
        });
        this.pin2 = new Element('div',{
            'id' : this.options.id + '_pin2',
            'class' : 'mdps_pin',
            'styles' : {
                'left' : this.step_size * 1 + 'px'
            }
        });

        this.pin1.inject(this.wrapper_div, 'bottom');
        this.pin2.inject(this.wrapper_div, 'bottom');

        this.pin_height_half = this.pin1.getCoordinates().height / 2;
        this.pin_width_half = this.pin1.getCoordinates().width / 2;
        this.interval_active_left = this.pin1.getCoordinates(this.wrapper_div).left +   this.pin_width_half;
        this.top_interval = (this.pin1.getCoordinates().height - this.options.interval_height) / 2;
        this.interval_active_width = this.pin2.getCoordinates(this.wrapper_div).left - this.pin1.getCoordinates(this.wrapper_div).left;

        this.interval_active = new Element('div', {
            'id' : this.options.id + '_interval_active',
            'styles' : {
                'background-color' : this.options.active_color,
                'height' : this.options.interval_height,
                'top' :   this.top_interval,
                'width':   this.interval_active_width + 'px',
                'left' :   this.interval_active_left + 'px',
                'position': 'absolute'
            },
            'class' : 'mdps_active_interval'
        });
        this.interval_active.inject(this.wrapper_div, 'top');
        this.interval = new Element('div', {
            'id' : this.options.id + '_interval',
            'styles' : {
                'background-color' : this.options.interval_color,
                'height' : this.options.interval_height,
                'top' :   this.top_interval,
                'width': this.options.width + 'px',
                'left' :    this.pin_height_half + 'px',
                'position': 'absolute'
            },
            'class' : 'mdps_interval'
        });
        this.pre_slider = new Element('div',{
            'id' : this.options.id + '_pre_slider',
            'class' : 'mdps_pre_slider',
            'styles' : {
                'top' : this.top_interval,
                'left' : this.pin_height_half  - 2 + "px"
            }
        });
        this.pre_slider.inject(  this.wrapper_div , 'top');
        this.post_slider = new Element('div',{
            'id' : this.options.id + '_post_slider',
            'class' : 'mdps_post_slider',
            'styles' : {
                'top' : this.top_interval,
                'left' : this.options.width + this.pin_height_half + "px"
            }
        });
        this.post_slider.inject(this.wrapper_div, 'top');
        this.interval.inject(this.wrapper_div, 'top');

        this.message = new Element('div', {
            'id' : this.options.id + '_message',
            'class' : 'mdps_message',
            'styles' : {
                //'display' : 'none',
                'top' : this.pin_height_half * 2
            }
        });
        this.message.inject(this.wrapper_div, 'bottom');
        this.message_half_width = (parseInt((this.message.getCoordinates().width)) / 2);
        this.message.setStyle('display', 'none');
        for(var i = 0; i <= this.intervals; i++){
            if(i == 0 || i == this.intervals){
                temp_top = "14px";
                temp_height = "10px";
            }else{
                temp_top = "18px";
                temp_height = "6px";
            }
            pin = new Element('div', {
                'styles' : {
                    'position' : 'absolute',
                    'left' : this.pin_height_half - 1 + this.step_size * i + 'px',
                    'top' : temp_top,
                    'height' : temp_height,
                    'width' : "1px"
                },
                'class' : 'mdps_interavl_border'
            });
            pin.inject(this.numbers_div, 'top');
        }
        var increm = Math.max(1, Math.round(this.options.values[0].length / this.options.labels));

        left_right_padding = 0;

        for(var j=0;j < this.options.values[0].length ; j++){
            if((j % increm == 0) || (j == this.options.values[0].length - 1)){
                pin_string = new Element('div',{
                    'styles' : {
                        'position' : 'absolute',

                        'top' : 0 + 'px'
                    },
                    'text' : this.options.values[1][j],
                    'class' : 'mdps_interval_string'
                });
                pin_string.inject(this.numbers_div, 'top');
                left_padding = Math.round(pin_string.getCoordinates().width / 2);
                if(j == 0){
                    left_padding = 5;
                    left_right_padding += left_padding;
                }
                if(j == this.options.values[0].length - 1){
                    left_padding = pin_string.getCoordinates().width - 5;
                    left_right_padding += left_padding / 2;
                }
                pin_string.setStyle('left', this.pin_height_half  + this.step_size * j - left_padding + 'px');
            }
        }
        this.slider_div.setStyle('width', this.options.width + 18 + 'px');
        this.make_moo_objects_and_events(this);
        this.move_left_element();
        this.move_right_element();
        this.set_select_value();
    },
    set_select_value : function(){
        set_value = true;
        points_left = Math.round(parseFloat(this.pin1.getPosition(this.wrapper_div).x /this.step_size));
        points_right = Math.round(parseFloat(this.pin2.getPosition(this.wrapper_div).x /this.step_size));
        left_value = this.options.values[0][points_left];
        right_value = this.options.values[0][points_right];
        selects = ['left', 'right'];
        for(k =0; k<selects.length;k++){
            select = selects[k];
            if (select == 'left'){
                select_options = $$('#' + this.options.left_id + ' option');
                if(set_value){
                    this.left_select.set('value', left_value);
                }
                border_value = this.options.values[0][points_right - 1];
                dissabled = false;
            }else{
                select_options = $$('#' + this.options.right_id + ' option');
                if(set_value){
                    this.right_select.set('value', right_value);
                }
                dissabled = true;
                border_value = this.options.values[0][points_left + 1];
            }
            for(var i = 0; i < select_options.length; i++){
                select_options[i].disabled = false;
                if(dissabled){
                    select_options[i].disabled = true;
                }
                if(select_options[i].get('value') == border_value){
                    select_options[i].disabled = false;
                    if(dissabled == false){
                        dissabled = true;
                    }else{
                        dissabled = false;
                    }
                }
            }
        }
    }
    ,
    make_moo_objects_and_events : function(obj){
        this.pin2.addEvents({
            mouseover: function() {
                obj.pin2.addClass("mdps_pin_active");
                pos = obj.pin2.getPosition(obj.wrapper_div);
                points = Math.round(parseFloat(pos.x /obj.step_size));
                obj.show_message(pos.x, obj.options.values[1][points]);
            },
            mouseout: function() {
                obj.pin2.removeClass("mdps_pin_active");
                obj.hide_message();
            }
        });
        this.pin1.addEvents({
            mouseover: function(el) {
                obj.pin1.addClass("mdps_pin_active");
                pos = obj.pin1.getPosition(obj.wrapper_div);
                points = Math.round(parseFloat(pos.x /obj.step_size));
                obj.show_message(pos.x, obj.options.values[1][points]);
            },
            mouseout: function() {
                obj.pin1.removeClass("mdps_pin_active");
                obj.hide_message();
            }
        });

        function remove_selection(){
            document.onselectstart = function() {return false};
            document.onmousedown = function() {return false};
        }
        function add_selection(){
            document.onselectstart = function() {return true};
            document.onmousedown = function() {return true};
        }

        this.pin1.addEvent('mousedown',function(e){
            remove_selection();
            obj.pin1.addClass('mdps_pin_click');
            document.id(document.body).addEvent('mousemove', function(e){
                client_x = e.client.x - obj.pin_width_half;
                wrapper_abs_x = obj.wrapper_div.getPosition().x;
                pin1_wrapper_x = obj.pin1.getPosition(obj.wrapper_div).x;
                pin2_x = obj.pin2.getPosition().x;
                half_step_size = obj.step_size /2;
                delta = client_x - wrapper_abs_x - pin1_wrapper_x;
                if(client_x - wrapper_abs_x > (-1) * half_step_size && pin2_x > client_x + half_step_size){
                    if (Math.abs(delta) > half_step_size){
                        if(delta > 0){
                            obj.pin1.setStyle('left',pin1_wrapper_x + obj.step_size);
                        }else{
                            obj.pin1.setStyle('left',pin1_wrapper_x - obj.step_size);
                        }
                    }
                }
                pin1_wrapper_x = obj.pin1.getPosition(obj.wrapper_div).x;
                obj.show_message(pin1_wrapper_x, obj.options.values[1][Math.round(parseFloat(pin1_wrapper_x / obj.step_size))]);
                obj.set_active_interval();
                obj.set_select_value();

            });
        });

        this.pin2.addEvent('mousedown',function(e){
            remove_selection();
            obj.pin2.addClass('mdps_pin_click');
            document.id(document.body).addEvent('mousemove', function(e){
                client_x = e.client.x - obj.pin_width_half;
                wrapper_abs_x = obj.wrapper_div.getPosition().x;
                pin2_wrapper_x = obj.pin2.getPosition(obj.wrapper_div).x;
                pin1_x = obj.pin1.getPosition().x;
                delta = client_x - wrapper_abs_x - pin2_wrapper_x;
                half_step_size = obj.step_size /2;
                if(client_x - wrapper_abs_x < half_step_size + obj.options.width && pin1_x < client_x - half_step_size){
                    if (Math.abs(delta) > half_step_size){
                        if(delta > 0){
                            obj.pin2.setStyle('left',pin2_wrapper_x + obj.step_size);
                        }else{
                            obj.pin2.setStyle('left',pin2_wrapper_x - obj.step_size);
                        }
                    }
                }
                pin2_wrapper_x = obj.pin2.getPosition(obj.wrapper_div).x;
                obj.show_message(pin2_wrapper_x, obj.options.values[1][Math.round(parseFloat(pin2_wrapper_x / obj.step_size))]);
                obj.set_active_interval();
                obj.set_select_value();

            });
        });

        $$(this.interval, this.interval_active)
        .addEvent('click', function(e){
            wrapper_x = obj.wrapper_div.getPosition().x;
            mouse_x = e.client.x - wrapper_x;
            pin1_x = obj.pin1.getPosition(obj.wrapper_div).x;
            pin2_x = obj.pin2.getPosition(obj.wrapper_div).x;
            points = Math.round(parseFloat(mouse_x / obj.step_size));
            if(Math.abs(mouse_x - pin1_x) > Math.abs(mouse_x - pin2_x)){
                if(Math.abs(mouse_x - pin1_x) > obj.step_size){
                    obj.pin2.setStyle("left", points * obj.step_size + 'px');
                }
            }else{
                if(Math.abs(mouse_x - pin2_x) > obj.step_size){
                    obj.pin1.setStyle("left", points * obj.step_size + 'px');
                }
            }
            obj.set_active_interval();
            obj.set_select_value()
        });

        document.id(document.body).addEvent('mouseup', function(){
            document.id(document.body).removeEvents('mousemove');
            add_selection();
            obj.pin2.removeClass('mdps_pin_click');
            obj.pin1.removeClass('mdps_pin_click');
            obj.hide_message();
        });
        this.left_select.addEvents({
            change: function() {
                obj.move_left_element();
                obj.set_select_value();
            }
        });
        this.right_select.addEvents({
            change: function() {
                obj.move_right_element();
                obj.set_select_value();
            }
        });
    },
    move_left_element : function(){
        value = this.left_select.get('value');
        for(i = 0;i < this.options.values[0].length; i++){
            if(value == this.options.values[0][i]){
                break;
            }
        }
        points = i;
        this.pin1.setStyle('left', points * this.step_size);
        this.set_active_interval();
        pos = this.pin1.getPosition(this.wrapper_div);
        //this.drag2.options.limit = {x:[pos.x + this.step_size, this.options.width],y:[0, 0]};
        //this.set_select_value();
    },
    move_right_element : function(){

        value = this.right_select.get('value');
        for(i = 0;i < this.options.values[0].length; i++){
            if(value == this.options.values[0][i]){
                break;
            }
        }
        points = i;
        this.pin2.setStyle('left', points * this.step_size);
        this.set_active_interval();
            pos = this.pin2.getPosition(this.wrapper_div);
        //this.drag1.options.limit = {x:[0,  pos.x - this.step_size],y:[0, 0]};
        //
    },
    set_active_interval : function(){
        pos_1 =   this.pin1.getPosition(this.wrapper_div);
        pos_2 =   this.pin2.getPosition(this.wrapper_div);
        this.interval_active.setStyle('left', pos_1.x +   this.pin_width_half + 'px');
        this.interval_active.setStyle('width', ( pos_2.x - pos_1.x) + 'px');
    },
    show_message : function(points, string){
        this.message.set('text', string);
        this.message.set('styles', {
            'left' : points -   this.message_half_width + this.pin_width_half + 'px',
            'display' : 'block'
        });
    },
    hide_message : function(){
        this.message.setStyle('display', 'none');
    }
});