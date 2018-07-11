(function (app, fx) {

    var e = {
        info: 'Storm',
        start: function (app, fx) {

            example.containers.floor.visible = true;

            this.fx = fx;

            var container = this.container = example.containers.standard;
            var content = this.content = new PIXI.Container();
            this.container.addChild(content);

            var back = PIXI.Sprite.from('gradient2');
            back.tint = 0x32231E;
            back.anchor.y = 1;
            back.width = example.width;
            back.height = 800;
            back.y = example.floorY;
            back.alpha = 0.9;
            content.addChild(back);

            var clouds = fx.getParticleEmitter('side-clouds');
            clouds.init(container);
            clouds.y = 50;

            var rain = fx.getParticleEmitter('side-rain', true, true);
            rain.settings.core.params.height = example.width * 1.2;
            rain.settings.spawnCountMin = 10;
            rain.settings.spawnCountMax = 20;
            rain.init(container);
            rain.x = example.width * 0.5;
            rain.y = 50;

            this.update();

            this.mod = 0;

            app.ticker.add(this.update, this);
        },

        update: function() {
            this.mod++;
            if (this.mod % 20 == 0 && Math.random() > 0.6) {
                var sequence = this.fx.getEffectSequence('white-light');
                sequence.init(this.container, 0, true, example.rnd.float(2, 3));
                sequence.x = example.rnd.float(10, example.width - 10);
                sequence.y = example.rnd.float(-100, -50);
            }
            if (this.mod % 30 == 0 && Math.random() > 0.6) {
                var sequence = this.fx.getEffectSequence('side-lightning');
                sequence.init(this.container, 0, true, example.rnd.float(1.5, 2.5));
                sequence.x = example.rnd.float(10, example.width - 10);
                sequence.y = example.rnd.float(10, 50);
            }

        },

        stop: function (app, fx) {

            this.container.removeChild(this.content);
            example.containers.floor.visible = false;

            app.ticker.remove(this.update, this);

            fx.stopAllEffects();
        },

        resize: function() {

        }
    };

    example.list.push(e);

}());