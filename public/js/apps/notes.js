// Load the application once the DOM is ready, using `jQuery.ready`:
$(function(){

  // Note Model
  // ----------

  var Note = Backbone.Model.extend({

    // Default attributes for the item.
    defaults: function() {
      return {
        id   :  Notes.nextId(),
        name :  "New note",
        desc :  "",
        date :  Date.now()
      };
    }

  });

  // Note Collection
  // ---------------

  // The collection of notes is backed by *localStorage* instead of a remote server

  var NoteList = Backbone.Collection.extend({

    // Reference to this collection's model.
    model: Note,

    // Save all of the items under namespace.
    localStorage: new Backbone.LocalStorage("notes-app"),

    // We keep in sequential id, despite being saved by unordered
    // GUID in the database. This generates the next id number for new items.
    nextId: function() {
      if (!this.length) return 1;
      return this.last().get('id') + 1;
    },

    // sorted by their original insertion id.
    comparator: function(note) {
      return note.get("id");
    },

    search : function(str){
      // if(str == "") return this;
      
      var pattern = new RegExp(str, "gi");
      return _(this.filter(function(data) {
          data.trigger('show');
          if (pattern.test(data.get("desc")) == false) {
            data.trigger('hide');
          };
      }));

    }

  });

  // Create our global collection.
  var Notes = new NoteList;

  // Item View
  // --------------

  // The DOM element for a item...
  var NoteItemView = Backbone.View.extend({

    //... is a list tag.
    tagName:  "li",
    className: "list-group-item hover",

    // Cache the template function for a single item.
    template: _.template($('#item-template').html()),

    // The DOM events specific to an item.
    events: {
      "click .destroy": "clear",
      "click"         : "select"
    },

    // The View listens for changes to its model, re-rendering. 
    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.remove);
      this.listenTo(this.model, 'select', this.select);
      this.listenTo(this.model, 'hide', this.hide);
      this.listenTo(this.model, 'show', this.show);
    },

    // Re-render the titles of the item.
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    },

    // Remove the item, destroy the model.
    clear: function(e) {
      this.model.destroy();
      window.history.back();
    },

    // Click to select
    select: function(){
      this.$el.parent().find('.active').removeClass('active');
      this.$el.addClass('active');    
      app.navigate("notes/"+this.model.get('id'), {trigger: true});
    },

    hide: function(){
      this.$el.addClass('hide');
    },

    show: function(){
      this.$el.removeClass('hide');
    }

  });


  // list view

  var NoteListView = Backbone.View.extend({

    // Instead of generating a new element, bind to the existing skeleton of
    el: $("#note-list"),

    // At initialization we bind to the relevant events on the 
    // collection, when items are added or changed. Kick things off by
    // loading any preexistings that might be saved in *localStorage*.
    initialize: function() {

      this.listenTo(Notes, 'add', this.addOne);
      this.listenTo(Notes, 'reset', this.addAll);
      this.listenTo(Notes, 'all', this.render);

      Notes.fetch();
      if(Notes.length == 0){
        this.populateData();
      }
    },

    // Re-rendering the App just means refreshing the statistics -- the rest
    // of the app doesn't change.
    render: function() {

    },

    // Add a single item to the list by creating a view for it, and
    // appending its element to the `<ul>`.
    addOne: function(note) {
      var view = new NoteItemView({model: note});
      this.$el.prepend(view.render().el);
    },

    // Add all items in the collection at once.
    addAll: function() {
      Notes.each(this.addOne, this);
    },

    populateData: function () {
      Notes.create();
    }

  });

  // note detail
  var NoteView = Backbone.View.extend({
    el: $("#note-detail"),

    // Cache the template function
    template: _.template($('#note-template').html()),

    // The DOM events specific to the textarea.
    events: {
      "keyup textarea"  : "updateOnKeyup",
    },

    initialize:function () {
      this.$el.html(this.template(this.model.toJSON()));
    },

    // update the model when update
    updateOnKeyup: function(e){
      var name = '',
          desc = $(e.target).val(),
          arr  = desc.split(/\r\n|\r|\n/g);
      arr.length && ( name = _.first( _.filter(arr, function(item){ return !!$.trim(item); }) ) );
      this.model.save({name: name, desc: desc});
    },

    close:function () {
      this.$el.unbind();
      this.$el.empty();
    }

  });

  // note app view to contorl other things
  var NoteAppView = Backbone.View.extend({    
    el: $('#noteapp'),

    // Delegated events for creating new items, and clearing completed ones.
    events: {
      "click #new-note"   : "create",
      "keyup #search-note": "search"
    },

    create: function(e) {
      var note = Notes.create();
      note.trigger('select');
    },

    search: function(){
      Notes.search($('#search-note').val());
    }

  });
  
  var AppRouter = Backbone.Router.extend({
    routes: {
      "" : "list",
      "notes/:id" : "details"
    },

    initialize: function () {
      new NoteAppView;      
    },

    list: function() {
      if(this.noteListView) return;
      this.noteListView = new NoteListView;
      var self = this;
      if(!this.requiredId){
        _.delay(function(){self.noteListView.$el.children().first().trigger('click')},500);
      }
    },
    
    details: function(id) {
      this.requiredId = id;
      this.list();
      // close the note detail view
      if (this.noteView) this.noteView.close();
      // get the note
      this.note = Notes.get(id);
      if(this.note){
        this.note.trigger('select');
        this.noteView = new NoteView({model: this.note});
      }      
    }
  });

  // Finally, we kick things off by creating the **App**.
  
  var app = new AppRouter();
  Backbone.history.start();
  
});
