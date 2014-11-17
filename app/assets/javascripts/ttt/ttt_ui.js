(function(root) {
  var TTT = root.TTT = (root.TTT || {});

  TTTUI = TTT.TTTUI = function(game, domEl, index) {
    this.game = game;
    this.$domEl = $(domEl);
    this.coords = [ Math.floor(index/3), index%3 ];

  };

  TTTUI.prototype.installClickListener = function() {
    this.$domEl.on("click", this.handleClick.bind(this));
  };

  TTTUI.prototype.handleClick = function(){
    if (game.handleInput(this.coords)){

      this.$domEl.html(this.game.player);
      this.$domEl.addClass(this.game.player);

      if (game.winner()) {
        var mark = ((game.winner() == "x") ? "O" : "X");
        alert("Congratulations! " + mark + "'s have won the game!");
        location.reload();
      }
      else if (game.draw()) {
        alert("We have a draw! Try Again.")
        location.reload();
      }
    }
  };
})(this);