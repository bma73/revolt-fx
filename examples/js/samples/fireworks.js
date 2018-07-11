(function (app, fx) {


    var e = {
        info: 'Fireworks - Click to launch rocket',
        start: function (app, fx) {

            this.app = app;

            var container = this.container = example.containers.standard;
            var content = this.content = new PIXI.Container();
            this.container.addChild(content);

            content.interactive = true;

            example.containers.floor.visible = true;

            var back = PIXI.Sprite.from('gradient2');
            back.tint = 0xBB0096;
            back.anchor.y = 1;
            back.width = example.width;
            back.height = example.height;
            back.y = example.floorY;
            back.alpha = 0.3;
            content.addChild(back);

            var that = this;

            var createRocket = function (x) {
                var emitter = fx.getParticleEmitter('fireworks', true, true);

                emitter.settings.particleSettings.distanceMin = 700;
                emitter.settings.particleSettings.distanceMax = 800;
                emitter.x = x;
                emitter.y = example.floorY;
                emitter.rotation = -Math.PI * 0.5 + example.rnd.float(-0.5, 0.5);

                emitter.init(container);
            };


            content.on('pointerdown', function (e) {
                var local = e.data.getLocalPosition(content);
                createRocket(local.x);
            });

        },


        stop: function (app, fx) {
            this.container.removeChild(this.content);
            fx.stopAllEffects();
        },

        resize: function() {
        }
    };

    example.list.push(e);

}());