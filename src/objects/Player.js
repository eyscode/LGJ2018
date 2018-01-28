import {cartesianToIsometric} from '../utils';

export default class Player {
    constructor(game, heroWidth, heroHeight, heroMapPos, heroMapSprite) {
        this.game = game;
        this.heroWidth = heroWidth;
        this.heroHeight = heroHeight;
        this.heroMapPos = heroMapPos;
        this.heroMapSprite = heroMapSprite;
        // character
        this.sorcerer = this.game.add.sprite(-50, 0, 'hero', '1.png');// keep him out side screen area
        this.sorcerer.animations.add('south', ['5.png', '6.png', '7.png', '8.png'], 6, true);
        this.sorcerer.animations.add('west', ['13.png', '14.png', '15.png', '16.png'], 6, true);
        this.sorcerer.animations.add('north', ['21.png', '22.png', '23.png', '24.png'], 6, true);
        this.sorcerer.animations.add('east', ['29.png', '30.png', '31.png', '32.png'], 6, true);
        //shadow
        this.sorcererShadow = this.game.make.sprite(0, 0, 'heroShadow');
        this.sorcererShadow.scale = new Phaser.Point(0.5, 0.6);
        this.sorcererShadow.alpha = 0.4;
        this.shadowOffset = new Phaser.Point(this.heroWidth + 7, 11);
    }

    stopAnimation() {
        this.sorcerer.animations.stop();
    }

    playAnimation(animation) {
        this.sorcerer.animations.play(animation);
    }

    set currentFrame(frame) {
        this.sorcerer.animations.currentFrame = frame;
    }

    get currentAnim() {
        return this.sorcerer.animations.currentAnim
    }

    draw(gameScene, borderOffset) {
        let heroCornerPt = new Phaser.Point(this.heroMapPos.x - this.heroMapSprite.width / 2, this.heroMapPos.y - this.heroMapSprite.height / 2);
        let isoPt = cartesianToIsometric(heroCornerPt);//find new isometric position for hero from 2D map position
        gameScene.renderXY(this.sorcererShadow, isoPt.x + borderOffset.x + this.shadowOffset.x, isoPt.y + borderOffset.y + this.shadowOffset.y - 10, false);//draw shadow to render texture
        gameScene.renderXY(this.sorcerer, isoPt.x + borderOffset.x + this.heroWidth, isoPt.y + borderOffset.y - this.heroHeight, false);//draw hero to render texture
    }
}