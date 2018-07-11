(function (app, fx) {


    var e = {
        info: 'Mines - Click them...',
        start: function (app, fx) {

            this.fx = fx;
            this.app = app;

            example.containers.floor.visible = false;

            var container = this.container = example.containers.standard;

            this.renderTexture = PIXI.RenderTexture.create(example.width, example.height);
            this.decals = new PIXI.Sprite(this.renderTexture);
            this.decals.blendMode = PIXI.BLEND_MODES.MULTIPLY;

            var content = this.content = new PIXI.Container();
            this.container.addChild(content);
            content.interactive = true;
            content.interactiveChildren = true;

            content.addChild(this.decals);

            content.interactive = true;


            var back = PIXI.Sprite.from('fx-light01');
            back.tint = 0x31BE2F;
            back.anchor.set(0.5);
            back.x = example.width * 0.5;
            back.y = example.height * 0.5;
            back.alpha = 0.1;
            back.scale.set(4);
            content.addChild(back);


            this.decal = PIXI.Sprite.from('explosion-decal');
            this.decal.anchor.set(0.5);


            this.shakeStrength = 0;

            Mine.count = 0;

            this.mines = [];

            var n = 20;
            while (n--) {
                var mine = new Mine(this, fx);
                this.mines.push(mine);
                content.addChild(mine);
            }

            app.ticker.add(this.update, this);

            this.mod = 60;

        },

        addDecal(x, y, scale) {
            if (this.renderTexture) {
                this.decal.x = x;
                this.decal.y = y;
                this.decal.scale.set(scale * 0.8);
                this.decal.rotation = example.rnd.float(0, 6.18);
                this.decal.alpha = example.rnd.float(0.6, 0.8);
                this.app.renderer.render(this.decal, this.renderTexture, false);
            }
        },

        shake: function () {

            this.shakeStrength += example.rnd.float(5, 10) * example.rnd.sign();
            var that = this;
            TweenMax.killTweensOf(this);
            TweenMax.to(this, example.rnd.float(0.4, 0.7), {
                shakeStrength: 0, onComplete: function () {
                    that.container.x = that.container.y = 0;
                }
            });
        },

        update: function () {
            if (Mine.count < 30 && ++this.mod % 40 == 0 && Math.random() > 0.2) {
                var mine = new Mine(this, this.fx);
                this.mines.push(mine);
                this.content.addChild(mine);
            }

            if (this.shakeStrength != 0) {
                this.container.x = example.rnd.float(5, 10) * example.rnd.sign();
                this.container.y = example.rnd.float(5, 10) * example.rnd.sign();
            }

        },

        stop: function (app, fx) {
            this.obstacles = null;
            this.container.removeChild(this.content);
            app.ticker.remove(this.update, this);
            this.container.x = this.container.y = 0;
            this.renderTexture.destroy(true);
            this.renderTexture = null;
            fx.stopAllEffects();
        },

        resize: function() {
            this.content.hitArea = new PIXI.Rectangle(0, 0, this.app.renderer.width, this.app.renderer.height);
        }

    };


    var Mine = function (main, fx) {
        PIXI.Sprite.call(this, PIXI.Texture.from('mine'));
        this.scaleFac = example.rnd.float(0.8, 1.2);

        this.anchor.set(0.5);
        this.radius = 30 * this.scaleFac;
        this.x = example.rnd.float(100, example.width - 100);
        this.y = example.rnd.float(100, example.height - 100);
        this.scale.set(0);
        TweenMax.to(this, 0.5, {pixi: {scale: this.scaleFac}, ease: Bounce.easeOut, delay: example.rnd.float(0, 0.3)});

        Mine.count++;

        this.main = main;
        this.fx = fx;

        this.interactive = true;

        var that = this;

        this.on('pointerdown', function () {
            that.explode();
        });

    };

    Mine.prototype = Object.create(PIXI.Sprite.prototype);


    Mine.prototype.checkMines = function (x, y, radius) {
        var mines = this.main.mines;
        var n = mines.length;
        while (n--) {
            var mine = mines[n];
            if (!mine || mine === this) continue;
            var dx = mine.x - x;
            var dy = mine.y - y;
            var r = mine.radius + radius;
            if (dx * dx + dy * dy <= r * r) {
                mine.explode();
            }
        }
    };

    Mine.prototype.explode = function () {

        var sequence = this.fx.getEffectSequence('top-big-explosion');
        sequence.init(this.main.container, 0, true, this.scaleFac);
        sequence.x = this.x;
        sequence.y = this.y;

        if (this.parent) this.parent.removeChild(this);
        this.main.shake();
        Mine.count--;

        this.main.addDecal(this.x, this.y, this.scaleFac);

        var i = this.main.mines.indexOf(this);
        if (i > -1) this.main.mines.splice(i, 1);

        this.checkMines(this.x, this.y, 60);

        //Chain reaction!
        //listen to spawned effects
        var that = this;
        sequence.on.effectSpawned.add(function (type, effect) {

            if (type == revolt.FX.EffectSequenceComponentType.Emitter && effect.name == 'top-big-explosion-sub3') {
                effect.on.particleDied.add(function (particle) {
                    that.main.addDecal(particle.x, particle.y, example.rnd.float(0.3, 0.5));
                    that.checkMines(particle.x, particle.y, 30);
                });
            }
        });

        return sequence;
    };

    example.list.push(e);

}());