(function(root){
  var Hanoi = root.Hanoi = (root.Hanoi || {});

  var HanoiUI = Hanoi.HanoiUI = function(game, domEl, index) {
    this.game = game;
    this.$domEl = $(domEl);
    this.index = index;
  };

  HanoiUI.SELECTIONS = [];

  HanoiUI.prototype.installClickListener = function(){
    this.$domEl.on("click", this.handleClick.bind(this));
  };

  HanoiUI.prototype.handleClick = function(){

    var i = this.index;

    if ((i <= 2) || (i === 9)) {
      //select tower one
      HanoiUI.SELECTIONS.push(0);
    } else if ((i <= 5) || (i === 10)) {
      HanoiUI.SELECTIONS.push(1);
    } else if ((i <= 8) || (i === 11)) {
      HanoiUI.SELECTIONS.push(2);
    }


    if (HanoiUI.SELECTIONS.length === 2) {

      if(this.game.takeTurn(HanoiUI.SELECTIONS[0], HanoiUI.SELECTIONS[1])) {
        this.render();

        $(".towers li").each(function(index, block) {
          new Hanoi.HanoiUI(game, block, index).installClickListener();
        });

        if (this.game.isWon()) {
          alert("Congratulations! You have won the game!");
          location.reload();
        };

      }
      HanoiUI.SELECTIONS = [];
    }
  };

  HanoiUI.prototype.render = function() {

    this.game.towers.forEach(function(tower, tIndex) {
      //figure out length of tower
      //3 - tower.length = how many hidden elements to create

      var towerSelected;
      if (tIndex === 0) {
        towerSelected = $(".one");
      } else if (tIndex === 1) {
        towerSelected = $(".two");
      } else if (tIndex ===2) {
        towerSelected = $(".three");
      }

      towerSelected.empty();

      tower.slice().reverse().forEach(function(disc, dIndex) {
        var size;
        if (disc === 1) {
          size = "small";
        } else if (disc === 2) {
          size = "medium";
        } else if (disc ===3) {
          size = "large";
        }

        towerSelected.append("<li class=\"" + size + "\"></li>");
      });

      for (var i = tower.length; i < 3; i++){
        towerSelected.prepend("<li class=\"hidden\"></li>");
      };

    });
  };

})(this);