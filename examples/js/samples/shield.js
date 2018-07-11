(function (app, fx) {

    var e = {
        info: 'Energy Shield - Click to fire',
        start: function (app, fx) {

            this.app = app;

            var container = this.container = example.containers.standard;
            var content = this.content = new PIXI.Container();
            container.addChild(content);

            content.interactive = true;

            var centerX = example.width * 0.5;
            var centerY = example.height * 0.5;

            var back = PIXI.Sprite.from('fx-light01');
            back.tint = 0x015562;
            back.anchor.set(0.5);
            back.x = centerX;
            back.y = centerY;
            back.alpha = 0.4;
            back.scale.set(4);
            content.addChild(back);

            this.shots = [];
            this.guns = [];

            this.shield = new Shield(fx, this);
            content.addChild(this.shield);

            var count = 8;
            var step = 2 * Math.PI / count;
            var angle = 0;
            while(count--) {
                var gun = new Gun(fx, this, this.shield);
                content.addChild(gun);
                this.guns.push(gun);
                gun.x = centerX + Math.cos(angle) * 500;
                gun.y = centerY + Math.sin(angle) * 290;
                angle += step;
            }

            app.ticker.add(this.update, this);

            var that = this;
            content.on('pointerdown', function (e) {

                var gun = that.guns[example.rnd.integer(0, that.guns.length-1)];
                gun.fire();

            });


        },

        update: function () {
           this.shield.update();

           var n = this.guns.length;
           while (n--) {
               this.guns[n].update();
           }

            n = this.shots.length;
            while (n--) {
                this.shots[n].update();
            }

        },

        stop: function (app, fx) {
            this.container.removeChild(this.content);
            app.ticker.remove(this.update, this);
            fx.stopAllEffects();
        }
    };


    var Shield = function (fx, main) {
        PIXI.Container.call(this);

        this.main = main;
        this.fx = fx;

        var logo = PIXI.Sprite.from('logo');
        logo.anchor.set(0.5);
        logo.scale.set(0.3);
        logo.alpha = 0.6;
        this.addChild(logo);

        var emitter = fx.getParticleEmitter('plasma-shield');
        emitter.init(this);

        this.baseX = example.width * 0.5;
        this.baseY = example.height * 0.5;
        this.mod = 0;
        this.radius = 150;
    };

    Shield.prototype = Object.create(PIXI.Container.prototype);

    Shield.prototype.update = function () {
        this.x = this.baseX + Math.sin(this.mod++ * 0.005) * 60;
        this.y = this.baseY + Math.sin(this.mod++ * 0.009) * 60;
    };

    Shield.prototype.hit = function(shot) {
        var effect = this.fx.getEffectSequence('plasma-shield-hit');
        effect.init(this.main.container);
        effect.x = this.x;
        effect.y = this.y;
        effect.rotation = shot.rotation - Math.PI;
    };



    var Gun = function (fx, main, target) {
        PIXI.Sprite.call(this, PIXI.Texture.from('gun'));
        this.anchor.set(0.5);
        this.main = main;
        this.target = target;
        this.fx = fx;
        this.fx = fx;
    };

    Gun.prototype = Object.create(PIXI.Sprite.prototype);

    Gun.prototype.fire = function() {
        this.update();
        var shot = new Shot(fx, this.main, this.rotation);
        this.main.content.addChild(shot);
        shot.x = this.x + Math.cos(this.rotation) * 20;
        shot.y = this.y + Math.sin(this.rotation) * 20;

        var light = this.fx.getEffectSequence('white-light');
        light.init(this.main.content, 0, true, 0.2);
        light.x = shot.x;
        light.y = shot.y;


    };

    Gun.prototype.update = function () {
        var dx = this.target.x - this.x;
        var dy = this.target.y - this.y;
        this.rotation = Math.atan2(dy, dx);
    };



    var Shot = function (fx, main, rotation) {
        PIXI.Sprite.call(this, PIXI.Texture.from('fx-light10'));

        this.shield = main.shield;
        this.shots = main.shots;

        this.shots.push(this);

        this.anchor.set(0.5, 0.5);
        this.rotation = rotation;

        this.dx = Math.cos(rotation);
        this.dy = Math.sin(rotation);

        this.blendMode = PIXI.BLEND_MODES.ADD;

        this.speed = 35;
        this.scale.set(0, 0.8);

        TweenMax.to(this, 0.1, {pixi: {scaleX: -1}});

        this.tint = 0xD702D8;

    };

    Shot.prototype = Object.create(PIXI.Sprite.prototype);

    Shot.prototype.update = function () {
        this.x += this.dx * this.speed;
        this.y += this.dy * this.speed;

        var dx = this.x - this.shield.x;
        var dy = this.y - this.shield.y;
        var r = this.shield.radius * this.shield.radius;

        if (dx * dx + dy * dy <= r) {
            this.shield.hit(this);
            this.dispose();
        }
    };

    Shot.prototype.dispose = function () {
        this.parent.removeChild(this);
        var index = this.shots.indexOf(this);
        if (index > -1) this.shots.splice(index, 1);
    };


    example.list.push(e);

}());