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
        selectedId: 0,

        cats: [],

        add: function (cat) {
        	this.cats[cat.id] = cat;
        	this.selectedId = cat.id;
        },

        remove: function (catId) {
        	this.cats[catId] = null;

        	if(this.selectedId == catId){
        		// Traverse from start untill an element not null
        		var i = 0;
        		while (!this.cats[i]){
        			i++;
        		}
        		this.selectedId = this.cats[i];
        	}
        },

        get: function(catId) {
        	return this.cats[catId];
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

        removeCat: function(catId) {
			data.remove(catId);
		    view.render();
        },

        getCats: function() {
        	return data.cats;
        },

        getCat: function(catId) {
        	return data.get(catId);
        },

        getSelectedCat: function() {
        	return data.get(data.selectedId);
        },

        selectCat: function(catId) {
        	data.selectedId = catId;
            catListView.render();
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
    		this.$newCat = $('.new-cat');
    		this.newCatTemplate = $('script[data-template="new-cat-form"]').html();

    		this.$newCat.on('click', 'input[type=button]', function(e) {
    			octopus.addCat(new Cat(
    				$(this).siblings('input[name="catname"]').val(),
					$(this).siblings('input[name="imgurl"]').val()
    			));

    			newCatView.reset();
    			e.preventDefault();
    			return false;
    		});

    		this.render();
    	},

    	render: function () {
    		this.$newCat.html(this.newCatTemplate);
    	},

    	reset: function () {
    		this.$newCat.find('input[name="catname"]').val('');
    		this.$newCat.find('input[name="imgurl"]').val('');
    	}
    };

    var catDetailView = {
        init: function() {
        	this.$catDetails = $('.cat-details');
        	this.catDetailTemplate = $('script[data-template="cat-details"]').html();
        	
        	this.$catDetails.on('click', '.cat-img', function(e) {
                var catId = $(this).parents('.cat-preview').data().id;
                var cat = octopus.getCat(catId);
                cat.clicks++;
                catDetailView.render();
                return false;
            });

            this.render();
        },

        render: function() {
            var $catDetails = this.$catDetails,
                catDetailTemplate = this.catDetailTemplate,
                cat = octopus.getSelectedCat();
            
            if(cat){
            	$catDetails.html(
            		catDetailTemplate.replace(/{{id}}/g, cat.id)
            			.replace(/{{name}}/g, cat.name)
            			.replace(/{{image}}/g, cat.image)
            			.replace(/{{clicks}}/g, cat.clicks)
            		);

            }
        }
    };

    var catListView = {
        init: function() {
        	this.catListItemTemplate = $('script[data-template="cat-list-item"]').html();

        	this.$catList = $('.cat-list');
        	this.$catList.on('click', '.cat-list-item', function(e) {
        		octopus.selectCat($(this).data().id);
                return false;
            });

            this.render();
        },

        render: function() {
			// Cache vars for use in forEach() callback (performance)
            var $catList = this.$catList, 
            	catListItemTemplate = this.catListItemTemplate;

			var catListHtml = '';
            octopus.getCats().forEach(function(cat) {
            	catListHtml += catListItemTemplate.replace(/{{id}}/g, cat.id)
                		.replace(/{{name}}/g, cat.name)
                		.replace(/{{selected}}/g, ((cat.id == octopus.getSelectedCat().id)? "selected": ""));
            });
            $catList.html(catListHtml);
        }
    };

    octopus.init();

}());
