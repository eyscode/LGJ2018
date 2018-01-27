/* globals __DEV__ */
import Phaser from 'phaser'

export default class Stage extends Phaser.State {
    init(game) {
        this.levelData =
            [
                [1, 1, 0, 0, 1, 1, 0],
                [1, 2, 2, 0, 0, 0, 0],
                [1, 2, 2, 'x', 0, 0, 0],
                [1, 2, 2, 0, 0, 0, 0],
                [1, 2, 2, 0, 0, 0, 0],
                [1, 2, 2, 0, 0, 0, 0],
                [1, 2, 2, 0, 0, 0, 0],
                [1, 1, 0, 0, 1, 1, 1],
            ];
        this.dX = 0;
        this.dY = 0;
        this.tileWidth = 34;// the width of a tile
        this.borderOffset = new Phaser.Point(250, 50);//to centralise the isometric level display
        this.floorGraphicWidth = 64;
        this.floorGraphicHeight = 38;
        this.heroGraphicWidth = 41;
        this.heroGraphicHeight = 62;
        this.heroHeight = (this.floorGraphicHeight / 2) + (this.heroGraphicHeight - this.floorGraphicHeight);//adjustments to make the legs hit the middle of the tile for initial load
        this.heroWidth = (this.floorGraphicWidth / 2) - (this.heroGraphicWidth / 2);//for placing hero at the middle of the tile
        this.facing = 'south';//direction the character faces
        this.shadowOffset = new Phaser.Point(this.heroWidth + 7, 11);
        this.heroSpeed = 1.2;

    }

    preload(game) {
        game.load.crossOrigin = 'Anonymous';
        game.load.atlasJSONHash('tileset', 'assets/images/tileset.png', 'assets/tileset.json');
        game.load.bitmapFont('font', 'https://dl.dropboxusercontent.com/s/z4riz6hymsiimam/font.png?dl=0', 'https://dl.dropboxusercontent.com/s/7caqsovjw5xelp0/font.xml?dl=0');
        game.load.image('greenTile', 'https://dl.dropboxusercontent.com/s/nxs4ptbuhrgzptx/green_tile.png?dl=0');
        game.load.image('redTile', 'https://dl.dropboxusercontent.com/s/zhk68fq5z0c70db/red_tile.png?dl=0');
        game.load.image('heroTile', 'https://dl.dropboxusercontent.com/s/8b5zkz9nhhx3a2i/hero_tile.png?dl=0');
        game.load.image('heroShadow', 'https://dl.dropboxusercontent.com/s/sq6deec9ddm2635/ball_shadow.png?dl=0');
        game.load.atlasJSONArray('hero', 'https://dl.dropboxusercontent.com/s/hradzhl7mok1q25/hero_8_4_41_62.png?dl=0', 'https://dl.dropboxusercontent.com/s/95vb0e8zscc4k54/hero_8_4_41_62.json?dl=0');
    }

    create(game) {
        this.normText = game.add.text(10, 360, "hi");
        this.upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        this.downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        this.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        this.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        game.stage.backgroundColor = '#cccccc';
        this.gameScene = game.add.renderTexture(game.width, game.height);
        game.add.sprite(0, 0, this.gameScene);
        this.floorSprite = game.make.sprite(0, 0, 'tileset', 'sand');
        this.wallSprite = game.make.sprite(0, 0, 'tileset', 'bush1');
        this.waterSprite = game.make.sprite(0, 0, 'tileset', 'water');
        this.waterSprite.alpha = 0.5;
        game.add.tween(this.waterSprite).to({alpha: 1}, 1500, Phaser.Easing.Linear.None, true, 0, 1000, true);
        this.sorcererShadow = game.make.sprite(0, 0, 'heroShadow');
        this.sorcererShadow.scale = new Phaser.Point(0.5, 0.6);
        this.sorcererShadow.alpha = 0.4;
        this.createLevel(game);
    }

    placeTile(tileType, i, j) {
        let tile = 'greenTile';
        if (tileType === 1) {
            tile = 'redTile';
        }
        this.minimap.create(j * this.tileWidth, i * this.tileWidth, tile);
    }

    createLevel(game) {//create minimap
        this.minimap = game.add.group();
        let tileType = 0;
        for (let i = 0; i < this.levelData.length; i++) {
            for (let j = 0; j < this.levelData[0].length; j++) {
                tileType = this.levelData[i][j];
                this.placeTile(tileType, i, j);
                if (tileType === 'x') {//save hero map tile
                    this.heroMapTile = new Phaser.Point(i, j);
                }
            }
        }
        this.addHero(game);
        this.heroMapSprite = this.minimap.create(this.heroMapTile.y * this.tileWidth, this.heroMapTile.x * this.tileWidth, 'heroTile');
        this.heroMapSprite.x += (this.tileWidth / 2) - (this.heroMapSprite.width / 2);
        this.heroMapSprite.y += (this.tileWidth / 2) - (this.heroMapSprite.height / 2);
        this.heroMapPos = new Phaser.Point(this.heroMapSprite.x + this.heroMapSprite.width / 2, this.heroMapSprite.y + this.heroMapSprite.height / 2);
        this.heroMapTile = this.getTileCoordinates(this.heroMapPos, this.tileWidth);
        this.minimap.scale = new Phaser.Point(0.3, 0.3);
        this.minimap.x = 500;
        this.minimap.y = 10;
        this.renderScene(game);//draw once the initial state
    }

    getTileCoordinates(cartPt, tileHeight) {
        let tempPt = new Phaser.Point();
        tempPt.x = Math.floor(cartPt.x / tileHeight);
        tempPt.y = Math.floor(cartPt.y / tileHeight);
        return (tempPt);
    }

    addHero(game) {
        // sprite
        this.sorcerer = game.add.sprite(-50, 0, 'hero', '1.png');// keep him out side screen area

        // animation
        this.sorcerer.animations.add('southeast', ['1.png', '2.png', '3.png', '4.png'], 6, true);
        this.sorcerer.animations.add('south', ['5.png', '6.png', '7.png', '8.png'], 6, true);
        this.sorcerer.animations.add('southwest', ['9.png', '10.png', '11.png', '12.png'], 6, true);
        this.sorcerer.animations.add('west', ['13.png', '14.png', '15.png', '16.png'], 6, true);
        this.sorcerer.animations.add('northwest', ['17.png', '18.png', '19.png', '20.png'], 6, true);
        this.sorcerer.animations.add('north', ['21.png', '22.png', '23.png', '24.png'], 6, true);
        this.sorcerer.animations.add('northeast', ['25.png', '26.png', '27.png', '28.png'], 6, true);
        this.sorcerer.animations.add('east', ['29.png', '30.png', '31.png', '32.png'], 6, true);
    }

    renderScene(game) {
        this.gameScene.clear();//clear the previous frame then draw again
        let tileType = 0;
        for (let i = 0; i < this.levelData.length; i++) {
            for (let j = 0; j < this.levelData[0].length; j++) {
                tileType = this.levelData[i][j];
                this.drawTileIso(game, tileType, i, j);
                if (i === this.heroMapTile.y && j === this.heroMapTile.x) {
                    this.drawHeroIso();
                }
            }
        }
        this.normText.text = 'Player is on x,y: ' + this.heroMapTile.x + ',' + this.heroMapTile.y;
    }

    drawTileIso(game, tileType, i, j) {//place isometric level tiles
        let cartPt = new Phaser.Point();//This is here for better code readability.
        cartPt.x = j * this.tileWidth;
        cartPt.y = i * this.tileWidth;
        let isoPt = this.cartesianToIsometric(cartPt);
        if (tileType === 1) {
            this.gameScene.renderXY(this.wallSprite, isoPt.x + this.borderOffset.x, isoPt.y + this.borderOffset.y - 14, false);
        } else if (tileType === 0) {
            this.gameScene.renderXY(this.floorSprite, isoPt.x + this.borderOffset.x, isoPt.y + this.borderOffset.y, false);
        } else if (tileType === 2) {
            let offset = (-2 * Math.sin((game.time.now + (i * 125)) * 0.004)) + (-1 * Math.sin((game.time.now + (j * 200)) * 0.005));
            this.gameScene.renderXY(this.waterSprite, isoPt.x + this.borderOffset.x, isoPt.y + this.borderOffset.y + offset, false);
        } else {
            this.gameScene.renderXY(this.floorSprite, isoPt.x + this.borderOffset.x, isoPt.y + this.borderOffset.y, false);
        }
    }

    cartesianToIsometric(cartPt) {
        let tempPt = new Phaser.Point();
        tempPt.x = cartPt.x - cartPt.y;
        tempPt.y = (cartPt.x + cartPt.y) / 2;
        return (tempPt);
    }

    update(game) {
        this.detectKeyInput();
        //if no key is pressed then stop else play walking animation
        if (this.dY === 0 && this.dX === 0) {
            this.sorcerer.animations.stop();
            this.sorcerer.animations.currentAnim.frame = 0;
        } else {
            if (this.sorcerer.animations.currentAnim !== this.facing) {
                this.sorcerer.animations.play(this.facing);
            }
        }
        //check if we are walking into a wall else move hero in 2D
        if (this.isWalkable()) {
            this.heroMapPos.x += this.heroSpeed * this.dX;
            this.heroMapPos.y += this.heroSpeed * this.dY;
            this.heroMapSprite.x = this.heroMapPos.x - this.heroMapSprite.width / 2;
            this.heroMapSprite.y = this.heroMapPos.y - this.heroMapSprite.height / 2;
            //get the new hero map tile
            this.heroMapTile = this.getTileCoordinates(this.heroMapPos, this.tileWidth);
            //depthsort & draw new scene
            this.renderScene(game);
        }
    }

    detectKeyInput() {//assign direction for character & set x,y speed components
        if (this.upKey.isDown) {
            this.dY = -1;
        } else if (this.downKey.isDown) {
            this.dY = 1;
        } else {
            this.dY = 0;
        }
        if (this.rightKey.isDown) {
            this.dX = 1;
            if (this.dY === 0) {
                this.facing = "east";
            }
            else if (this.dY === 1) {
                this.facing = "southeast";
                this.dX = this.dY = 0.5;
            }
            else {
                this.facing = "northeast";
                this.dX = 0.5;
                this.dY = -0.5;
            }
        } else if (this.leftKey.isDown) {
            this.dX = -1;
            if (this.dY === 0) {
                this.facing = "west";
            }
            else if (this.dY === 1) {
                this.facing = "southwest";
                this.dY = 0.5;
                this.dX = -0.5;
            }
            else {
                this.facing = "northwest";
                this.dX = this.dY = -0.5;
            }
        } else {
            this.dX = 0;
            if (this.dY === 0) {
                //facing="west";
            } else if (this.dY == 1) {
                this.facing = "south";
            } else {
                this.facing = "north";
            }
        }
    }

    isWalkable() {//It is not advisable to create points in update loop, but for code readability.
        let able = true;
        let heroCornerPt = new Phaser.Point(this.heroMapPos.x - this.heroMapSprite.width / 2, this.heroMapPos.y - this.heroMapSprite.height / 2);
        let cornerTL = new Phaser.Point();
        cornerTL.x = heroCornerPt.x + (this.heroSpeed * this.dX);
        cornerTL.y = heroCornerPt.y + (this.heroSpeed * this.dY);
        // now we have the top left corner point. we need to find all 4 corners based on the map marker graphics width & height
        //ideally we should just provide the hero a volume instead of using the graphics' width & height
        let cornerTR = new Phaser.Point();
        cornerTR.x = cornerTL.x + this.heroMapSprite.width;
        cornerTR.y = cornerTL.y;
        let cornerBR = new Phaser.Point();
        cornerBR.x = cornerTR.x;
        cornerBR.y = cornerTL.y + this.heroMapSprite.height;
        let cornerBL = new Phaser.Point();
        cornerBL.x = cornerTL.x;
        cornerBL.y = cornerBR.y;
        let newTileCorner1;
        let newTileCorner2;
        let newTileCorner3 = this.heroMapPos;
        //let us get which 2 corners to check based on current facing, may be 3
        switch (this.facing) {
            case "north":
                newTileCorner1 = cornerTL;
                newTileCorner2 = cornerTR;
                break;
            case "south":
                newTileCorner1 = cornerBL;
                newTileCorner2 = cornerBR;
                break;
            case "east":
                newTileCorner1 = cornerBR;
                newTileCorner2 = cornerTR;
                break;
            case "west":
                newTileCorner1 = cornerTL;
                newTileCorner2 = cornerBL;
                break;
            case "northeast":
                newTileCorner1 = cornerTR;
                newTileCorner2 = cornerBR;
                newTileCorner3 = cornerTL;
                break;
            case "southeast":
                newTileCorner1 = cornerTR;
                newTileCorner2 = cornerBR;
                newTileCorner3 = cornerBL;
                break;
            case "northwest":
                newTileCorner1 = cornerTR;
                newTileCorner2 = cornerBL;
                newTileCorner3 = cornerTL;
                break;
            case "southwest":
                newTileCorner1 = cornerTL;
                newTileCorner2 = cornerBR;
                newTileCorner3 = cornerBL;
                break;
        }
        //check if those corners fall inside a wall after moving
        newTileCorner1 = this.getTileCoordinates(newTileCorner1, this.tileWidth);
        if (this.levelData[newTileCorner1.y][newTileCorner1.x] === 1) {
            able = false;
        }
        newTileCorner2 = this.getTileCoordinates(newTileCorner2, this.tileWidth);
        if (this.levelData[newTileCorner2.y][newTileCorner2.x] === 1) {
            able = false;
        }
        newTileCorner3 = this.getTileCoordinates(newTileCorner3, this.tileWidth);
        if (this.levelData[newTileCorner3.y][newTileCorner3.x] === 1) {
            able = false;
        }
        return able;
    }

    drawHeroIso() {
        let heroCornerPt = new Phaser.Point(this.heroMapPos.x - this.heroMapSprite.width / 2, this.heroMapPos.y - this.heroMapSprite.height / 2);
        let isoPt = this.cartesianToIsometric(heroCornerPt);//find new isometric position for hero from 2D map position
        this.gameScene.renderXY(this.sorcererShadow, isoPt.x + this.borderOffset.x + this.shadowOffset.x, isoPt.y + this.borderOffset.y + this.shadowOffset.y - 10, false);//draw shadow to render texture
        this.gameScene.renderXY(this.sorcerer, isoPt.x + this.borderOffset.x + this.heroWidth, isoPt.y + this.borderOffset.y - this.heroHeight, false);//draw hero to render texture
    }
}
