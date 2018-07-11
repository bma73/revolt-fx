(function (app, fx) {

    var e = {
        info: 'Fire Arc',
        start: function (app, fx) {

            example.containers.floor.visible = true;

            var container = this.container = example.containers.standard;
            var content = this.content = new PIXI.Container();
            this.container.addChild(content);

            var back = PIXI.Sprite.from('gradient2');
            back.tint = 0xB03A00;
            back.anchor.y = 1;
            back.width = example.width;
            back.height = 500;
            back.y = example.floorY;
            back.alpha = 0.6;
            content.addChild(back);

            var emitter = this.emitter = fx.getParticleEmitter('fire-arc', true, true);
            this.emitter.settings.autoRotation = false;
            emitter.init(container);
            this.update();

            this.mod = 0;
            this.angle = 0;

            app.ticker.add(this.update, this);
        },

        update: function() {
            this.mod++;
            this.angle += 0.004;
            this.emitter.x = example.width * 0.5 + Math.cos(this.angle) * 300;
            this.emitter.y = example.height * 0.5 + Math.sin(this.angle * 2) * 200;
            this.emitter.rotation = Math.sin(this.angle) * 20;
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