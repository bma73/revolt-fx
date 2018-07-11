(function (app, fx) {

    var e = {
        info: 'Fairy Dust',
        start: function (app, fx) {


            var container = this.container = example.containers.standard;
            var content = this.content = new PIXI.Container();
            container.addChild(content);

            var back = PIXI.Sprite.from('gradient2');
            back.tint = 0xFF00BB;
            back.anchor.y = 1;
            back.width = example.width;
            back.height = 800;
            back.y = example.height;
            back.alpha = 0.1;
            content.addChild(back);

            var emitter = fx.getParticleEmitter('fairy-dust', true, true);
            emitter.settings.Min = 1;
            emitter.settings.spawnCountMax = 4;
            emitter.init(container, true, 1.1);
            emitter.x = example.width * 0.5;
            emitter.y = example.height * 0.5;
        },

        stop: function (app, fx) {
            this.container.removeChild(this.content);
            example.containers.floor.visible = false;

            fx.stopAllEffects();
        },

        resize: function() {

        }
    };

    example.list.push(e);

}());