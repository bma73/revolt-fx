(function (app, fx) {


    var e = {
        info: 'Defeat the aliens - Click to shoot',
        start: function (app, fx) {

            example.containers.floor.visible = false;

            this.app = app;

            var container = this.container = example.containers.standard;
            var content = this.content = new PIXI.Container();
            this.container.addChild(content);

            content.interactive = true;

            var back = PIXI.Sprite.from('gradient2');
            back.tint = 0x6CFF00;
            back.anchor.y = 1;
            back.width = example.width;
            back.height = example.height;
            back.y = example.height;
            back.alpha = 0.2;
            content.addChild(back);

            var laser = this.laser = PIXI.Sprite.from('gun');
            laser.anchor.set(0.1, 0.5);
            laser.y = example.height * 0.5;
            content.addChild(laser);

            this.aliens = [];
            this.shots = [];

            var that = this;
            content.on('pointerdown', function (e) {

                var local = e.data.getLocalPosition(content);
                that.laser.y = local.y;

                var shot = new Shot(fx, content, that.aliens, that.shots);
                content.addChild(shot);
                shot.x = 20;
                shot.y = laser.y;
                that.shots.push(shot);
            });

            app.ticker.add(this.update, this);

            this.mod = 60;

            this.fx = fx;
            this.mousePos = app.renderer.plugins.interaction.mouse.global;

        },


        update: function () {

            if (this.mousePos.y > 0) {
                this.laser.y = this.mousePos.y;
            }


            if ((this.mod++) % 40 === 0 && Math.random() > 0.5 && this.aliens.length < 8) {
                var alien = new Alien(this.fx, this.container, this.aliens);
                this.content.addChild(alien);
                this.aliens.push(alien);
            }

            var n = this.shots.length;
            while (n--) {
                this.shots[n].update();
            }

            n = this.aliens.length;
            while (n--) {
                this.aliens[n].update();
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


    var Alien = function (fx, beamContainer, aliens) {
        PIXI.Sprite.call(this, PIXI.Texture.from('alien'));
        this.anchor.set(0.5, 0.5);

        this.life = 5;

        this.fx = fx;
        this.aliens = aliens;

        var e = fx.getParticleEmitter('top-spaceship-engine', true, true);
        e.settings.particleSettings.tintStart = 0xD6FFD0;
        e.settings.particleSettings.tintEnd = 0x6CFF00;
        e.init(this, true, 0.5);
        e.y = 80;
        e.rotation = 94 * Math.PI / 180;

        e = fx.getParticleEmitter('top-spaceship-engine', true, true);
        e.init(this, true, 0.5);
        e.settings.particleSettings.tintStart = 0xD6FFD0;
        e.settings.particleSettings.tintEnd = 0x6CFF00;
        e.x = 35;
        e.y = 80;
        e.rotation = 73 * Math.PI / 180;

        this.beamContainer = beamContainer;

        this.init();

    };
    Alien.prototype = Object.create(PIXI.Sprite.prototype);

    Alien.prototype.init = function () {
        this.speed = example.rnd.float(1, 2);
        this.x = example.rnd.float(example.width - 150, example.width - 50);
        this.baseY = example.rnd.float(50, example.height - 50);
        this.mod = Math.random() * 200;

        var light = this.fx.getEffectSequence('white-light');
        light.init(this, 0, true, 2);

        var beam = this.fx.getParticleEmitter('side-teleporter-field');
        beam.init(this.beamContainer);
        beam.x = this.x;
        beam.y = this.baseY;

        this.alpha = 0;
        this.scale.set(0);
        TweenMax.to(this, 0.8, {pixi: {scale: 1}, ease: Elastic.easeOut});
        TweenMax.to(this, 0.6, {alpha: 1});
    };

    Alien.prototype.hit = function (shot) {
        var emitter = this.fx.getParticleEmitter('side-blood-slash');
        emitter.init(this.beamContainer);
        emitter.x = this.x;
        emitter.y = shot.y;
        emitter.rotation = Math.PI;
        this.x += 8;

        if (--this.life == 0) {
            this.die();
        }
    };

    Alien.prototype.die = function () {
        var emitter = this.fx.getParticleEmitter('side-blood-explosion');
        emitter.init(this.beamContainer, true, 1.1);
        emitter.x = this.x;
        emitter.y = this.y;

        var that = this;

        var index = this.aliens.indexOf(this);
        if (index > -1) this.aliens.splice(index, 1);

        TweenMax.to(this, 0.2, {
            pixi: {y: this.y - 100, alpha: 0, ease: Quart.easeOut}, onComplete: function () {
                that.parent.removeChild(that);
            }
        });
    };

    Alien.prototype.update = function () {
        this.x -= this.speed;
        this.y = this.baseY + Math.sin(this.mod++ * 0.06) * 10;
        if (this.x + this.width < 0) {
            this.init();
        }
    };


    var Shot = function (fx, content, aliens, shots) {
        PIXI.Sprite.call(this, PIXI.Texture.from('fx-light10'));

        this.anchor.set(0.5, 0.5);
        this.aliens = aliens;
        this.shots = shots;

        this.blendMode = PIXI.BLEND_MODES.ADD;

        this.speed = 35;
        this.scale.set(0, 0.8);

        TweenMax.to(this, 0.3, {pixi: {scaleX: -1}});

        this.tint = 0xFF3000;

    };

    Shot.prototype = Object.create(PIXI.Sprite.prototype);

    Shot.prototype.update = function () {
        this.x += this.speed;
        if (this.x - this.width > example.width) {
            this.dispose();
            return;
        }

        var x = this.x;
        var y = this.y;
        var n = this.aliens.length;
        var rect = new PIXI.Rectangle();
        while (n--) {
            var alien = this.aliens[n];
            rect.x = alien.x - 20;
            rect.y = alien.y - alien.height * 0.5;
            rect.height = alien.height * 0.8;
            rect.width = 40;
            if (rect.contains(x, y)) {
                alien.hit(this);
                this.dispose();
                return;
            }
        }
    };

    Shot.prototype.dispose = function () {
        this.parent.removeChild(this);
        var index = this.shots.indexOf(this);
        if (index > -1) this.shots.splice(index, 1);
    };

    example.list.push(e);

}());