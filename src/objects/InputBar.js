export default class InputBar {
    constructor(game, y, onPlay, tokens) {
        this.y = y;
        this.game = game;
        const graphics = game.add.graphics(150, this.y);
        graphics.beginFill('#333333', 0.3);
        graphics.drawRoundedRect(0, 0, game.width - 200 * 2, 70, 90);
        graphics.endFill();

        const button = game.add.button(game.width - 225, this.y, 'playButton', onPlay, this, 0, 0, 1, 0);
        button.scale.setTo(0.7, 0.7);

        const bottomGraphics = game.add.graphics(0, this.y + 100);
        bottomGraphics.beginFill('#333333', 0.5);
        bottomGraphics.drawRect(0, 0, game.width, 90);
        bottomGraphics.endFill();
        this.tokens = tokens;
    }

    set tokens(tokens) {
        this._tokens = tokens;
        const offset = 50;
        tokens.forEach((token, i) => {
            const g = this.game.add.graphics(i * 80 + offset, this.y + 115);
            g.lineStyle(0);
            switch (token) {
                case "step":
                    g.beginFill(0xFFFF0B, 0.5);
                    g.drawRoundedRect(0, 0, 60, 40, 90);
                    g.endFill();
                    break;
                case "clockwise-rotation":
                    g.beginFill(0xFF700B);
                    g.drawRoundedRect(0, 0, 60, 40, 90);
                    g.endFill();
                    break;
                case "counter-clockwise-rotation":
                    g.beginFill(0xFF3300);
                    g.drawRoundedRect(0, 0, 60, 40, 90);
                    g.endFill();
                    break;
                default:
                    console.log("Invalid token: " + token)

            }
        });
    }

    get tokens() {
        return this._tokens;
    }

}