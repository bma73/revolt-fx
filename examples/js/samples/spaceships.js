(function (app, fx) {

    var e = {
        info: 'Spaceships - Click to launch one',
        start: function (app, fx) {

            example.containers.floor.visible = false;
            example.containers.gradient.visible = false;
            example.containers.back.tint = 0x0a0a0a;

            this.app = app;

            var container = this.container = example.containers.standard;
            var content = this.content = new PIXI.Container();
            var shipsContainer = new PIXI.Container();
            var shipsBottomContainer = new PIXI.Container();
            var stars = new PIXI.Container();
            this.container.addChild(content);

            var back = PIXI.Sprite.from('gradient2');
            back.tint = 0x00C9FF;
            back.anchor.y = 1;
            back.width = example.width;
            back.height = example.height;
            back.y = example.height;
            back.alpha = 0.1;
            content.addChild(back);


            content.addChild(stars);
            content.addChild(shipsBottomContainer);
            content.addChild(shipsContainer);

            content.interactive = true;


            var starfield = fx.getParticleEmitter('top-starfield');
            starfield.init(stars, true, 2);
            starfield.x = example.width;
            starfield.y = example.height * 0.5;

            var spaceship = new BigSpaceship(fx);
            shipsContainer.addChild(spaceship);

            this.ships = [spaceship];

            app.ticker.add(this.update, this);


            var that = this;
            content.on('pointerdown', function (e) {
                that.ships.push(new Spaceship(fx, shipsContainer, shipsBottomContainer));
                that.ships.push(new Spaceship(fx, shipsContainer, shipsBottomContainer));
            });
        },

        update: function () {
            var n = this.ships.length;
            while (n--) {
                var ship = this.ships[n];
                ship.update();
                if (ship.x > example.width + 200) {
                    ship.dispose();
                    var index = this.ships.indexOf(ship);
                    if (index > -1) this.ships.splice(index, 1);
                }
            }
        },

        stop: function (app, fx) {

            this.container.removeChild(this.content);
            example.containers.gradient.visible = true;
            this.ships = null;

            app.ticker.remove(this.update, this);

            fx.stopAllEffects();
        },

        resize: function() {
        }
    };

    example.list.push(e);


    var BigSpaceship = function (fx) {
        PIXI.Sprite.call(this, PIXI.Texture.from('big-spaceship'));
        this.anchor.set(0.5, 0.5);

        this.x = this.startX = example.width * 0.6;
        this.y = this.startY = example.height * 0.5;

        var emitter = fx.getParticleEmitter('top-big-spaceship-engine');
        emitter.init(this);
        emitter.x = -30;

        this.mod = 0;
    };

    BigSpaceship.prototype = Object.create(PIXI.Sprite.prototype);

    BigSpaceship.prototype.update = function () {
        var d = Math.sin(this.mod++ * 0.01);
        this.y = this.startY + d * 60;
    };


    var Spaceship = function (fx, topContainer, bottomContainer) {
        PIXI.Sprite.call(this, PIXI.Texture.from('spaceship'));
        this.anchor.set(0.5, 0.5);

        var emitter = this.emitter = fx.getParticleEmitter('top-spaceship-engine');

        if (Math.random() > 0.5) {
            //Add ship on top
            topContainer.addChild(this);
            this.scaleFac = 1.5;
            emitter.init(topContainer, true, this.scaleFac * example.rnd.float(0.8, 1.1));
        } else {
            //Add ship at bottom
            bottomContainer.addChildAt(this, 0);
            this.scaleFac = 0.5;
            emitter.init(bottomContainer, true, this.scaleFac * example.rnd.float(0.8, 1.1));
        }

        this.scale.set(this.scaleFac, this.scaleFac);
        this.speed = example.rnd.float(3, 8) * this.scaleFac;

        emitter.target = this;
        emitter.targetOffset = -50 * this.scaleFac;

        this.x = -50;
        this.y = example.rnd.float(example.height * 0.05, example.height * 0.95);

        this.rotation = example.rnd.float(0.3, -0.3);
        this.dx = Math.cos(this.rotation);
        this.dy = Math.sin(this.rotation);


    };
    Spaceship.prototype = Object.create(PIXI.Sprite.prototype);

    Spaceship.prototype.update = function () {
        this.x += this.dx * this.speed;
        this.y += this.dy * this.speed;
    };
    Spaceship.prototype.dispose = function () {
        this.emitter.stop(false);
    };

}());