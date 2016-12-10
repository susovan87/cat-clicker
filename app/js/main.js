$(function() {

	var Cat = function (name, image) {
		this.name = name;
		this.image = image;
		this.clicks = 0;
		
		if(!Cat.prototype._id) {
			Cat.prototype._id = 0;
		}

		this.id = Cat.prototype._id++;
	};
	
	var data = {
        currentCat: null,

        cats: [],

        add: function (cat) {
        	this.cats[cat.id] = cat;
        	this.currentCat = cat;
        }
    };

    data.add(new Cat('Cat 1', 'images/cat.jpg'));
    data.add(new Cat('Cat 2', 'images/cat2.jpg'));
    data.add(new Cat('Cat 3', 'images/cat3.jpg'));
    
    var octopus = {
        addCat: function(cat) {
            data.add(cat);
            catListView.render();
            catDetailView.render();
        },

        getCats: function() {
        	return data.cats;
        },

        getCurrentCat: function() {
        	return data.currentCat;
        },

        setCurrentCat: function(cat) {
            data.currentCat = cat;
        },

        incrementClick: function() {
        	data.currentCat.clicks++;
            catDetailView.render();
        },

        init: function() {
        	newCatView.init();
        	catListView.init();
            catDetailView.init();
        }
    };

    var newCatView = {
    	init: function () {
    		this.$catName = $('input[name="catname"]'),
            this.$imgURL = $('input[name="imgurl"]'),
            this.$addButton = $('input[type=button]');
            var that = this;
            
            this.$addButton.on('click', function(e) {
                octopus.addCat(new Cat(that.$catName.val(),that.$imgURL.val()));
                newCatView.reset();
                e.preventDefault();
                return false;
            });
    	},

    	reset: function () {
    		this.$catName.val('');
    		this.$imgURL.val('');
    	}
    };

    var catDetailView = {
        init: function() {
        	this.$catImage = $('.cat-img'),
            this.$catScore = $('.cat-score'),
            this.$catName = $('.cat-name');

            this.$catImage.on('click', function (e) {
                octopus.incrementClick();
            });
        	
        	this.render();
        },

        render: function() {
            var currentCat = octopus.getCurrentCat();
            if(currentCat){
                this.$catName.text(currentCat.name);
                this.$catScore.text(currentCat.clicks);
                this.$catImage.attr('src',currentCat.image);
            }
        }
    };

    var catListView = {
        init: function() {
        	this.$catList = $('.cat-list');
        	this.render();
        },

        render: function() {
            var $catList = this.$catList;
            var cats = octopus.getCats();
            var currentCat = octopus.getCurrentCat();

            this.$catList.html('');
            cats.forEach(function(cat) {
                var $elm = $('<li />', {html: cat.name, class: 'cat-list-item'});
                if(currentCat && cat.id === currentCat.id){
                    $elm.addClass('selected');
                }
                $elm.on('click', (function (catCopy) {
                    return function(){
                        octopus.setCurrentCat(catCopy);
                        catDetailView.render();
                        catListView.render();
                    };
                })(cat));

                $elm.appendTo($catList);
            });
        }
    };

    octopus.init();

}());
