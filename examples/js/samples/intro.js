(function (app, fx) {

    var e = {
        start: function (app, fx) {

            var content = this.content = new PIXI.Container();
            var logo = PIXI.Sprite.from('logo');
            var glow = PIXI.Sprite.from('glow');

            example.containers.back.tint = 0;
            example.containers.gradient.alpha = 0.3;

            var emitter = fx.getParticleEmitter('plasma-corona');


            glow.scale.set(8);
            logo.anchor.set(0.5);
            glow.anchor.set(0.5);
            logo.alpha = 0.6;
            content.addChild(glow);
            content.addChild(logo);
            emitter.init(content, true, 1.9);
            glow.alpha = 0.4;

            content.x = example.width * 0.5;
            content.y = example.height * 0.5;

            content.alpha = 0;

            example.containers.content.addChild(content);


            TweenLite.to(content, 2, {pixi: {alpha: 1}});
            setTimeout(function () {
                example.next();
            }, 3000);

        },

        stop: function (app, fx) {
            this.content.parent.removeChild(this.content);
            example.containers.stats.visible = true;
            example.containers.nav.visible = true;
            fx.stopAllEffects();
            example.containers.gradient.alpha = 1;
        },

        resize: function() {

        }
    };

    example.list.push(e);

}());