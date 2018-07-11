(function (app, fx) {


    var e = {
        info: 'Plasma Grenades - Click to fire',
        start: function (app, fx) {

            this.app = app;

            example.containers.floor.visible = true;

            var container = this.container = example.containers.standard;
            var content = this.content = new PIXI.Container();
            this.container.addChild(content);

            content.interactive = true;

            var back = PIXI.Sprite.from('gradient2');
            back.tint = 0x00C9FF;
            back.anchor.y = 1;
            back.width = example.width;
            back.height = example.height;
            back.y = example.floorY;
            back.alpha = 0.4;
            content.addChild(back);

            var that = this;
            var rect = new PIXI.Rectangle();

            var fire = function() {
                var emitter = fx.getParticleEmitter('side-plasma-grenade');
                emitter.init(container);
                emitter.x = -10;
                emitter.y = example.height * 0.5;


                //Add  callback for particle update signal with a rate of 20 (always skip 20 frames/calls)
                emitter.on.particleUpdated.add(function (particle) {

                    //check if saucer has been hit
                    var list = that.saucerList;
                    for (var n = 0; n < list.length; n++) {
                        var saucer = list[n];

                        rect.x = saucer.x - 70;
                        rect.y = saucer.y - 50;
                        rect.width = 140;
                        rect.height = 50;

                        if (rect.contains(particle.x, particle.y)) {

                            //Saucer has been hit!
                            particle.stop();
                            saucer.explode();

                            //Play explosion effect
                            var explosion = fx.getEffectSequence('side-plasma-grenade-explosion');
                            explosion.init(that.content, 0, true, example.rnd.float(0.9, 1.2));
                            explosion.x = particle.x;
                            explosion.y = particle.y;

                            var index = list.indexOf(saucer);
                            if (index > -1) {
                                that.saucerList.splice(index, 1);
                            }
                        }
                    }
                }, null, 20);
            };

            content.on('pointerdown', function (e) {
                fire();
            });

            app.ticker.add(this.update, this);

            this.mod = 60;

            this.saucerList = [];
        },


        update: function () {
            if ((this.mod++) % 40 === 0 && Math.random() > 0.5 && this.saucerList.length < 8) {
                var saucer = new Saucer();
                this.content.addChild(saucer);
                this.saucerList.push(saucer);
            }

            var n = this.saucerList.length;
            while (n--) {
                this.saucerList[n].update();
            }
        },

        stop: function (app, fx) {
            this.saucerList = null;
            this.container.removeChild(this.content);
            example.containers.floor.visible = false;
            app.ticker.remove(this.update, this);
            fx.stopAllEffects();
        },

        resize: function() {
        }
    };



    var Saucer = function () {
        PIXI.Sprite.call(this, PIXI.Texture.from('saucer1'));
        this.anchor.set(0.5, 1);
        this.baseY = example.floorY - example.rnd.float(10, 400);
        this.init();

    };
    Saucer.prototype = Object.create(PIXI.Sprite.prototype);

    Saucer.prototype.init = function () {
        this.speed = example.rnd.float(2, 3);
        this.x = example.width + this.width;
        this.mod = Math.random() * 200;
    };

    Saucer.prototype.explode = function () {
        TweenMax.to(this, 0.2, {pixi: {y: this.y - 100, alpha: 0, ease: Quart.easeOut}});
    };

    Saucer.prototype.update = function () {
        this.x -= this.speed;
        this.y = this.baseY + Math.sin(this.mod++ * 0.06) * 10;
        if (this.x + this.width < 0) {
            this.init();
        }
    };


    example.list.push(e);

}());