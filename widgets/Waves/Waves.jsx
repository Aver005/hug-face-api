'use client'

import React, { useEffect, useRef } from 'react';

const Waves = ({ options }) => 
{
    const canvasRef = useRef(null);

    useEffect(() => 
    {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const pi = Math.PI;
        const pi2 = 2 * Math.PI;

        const defaultOptions = 
        {
            resize: false,
            rotation: 45,
            waves: 5,
            width: 100,
            hue: [11, 14],
            amplitude: 0.5,
            background: true,
            preload: true,
            speed: [0.004, 0.008],
            debug: false,
            fps: false,
        };

        const mergedOptions = { ...defaultOptions, ...options };

        const state = 
        {
            waves: [],
            hue: mergedOptions.hue[0],
            hueFw: true,
            stats: new Stats(),
            width: 0,
            height: 0,
            scale: 1,
            radius: 0,
            centerX: 0,
            centerY: 0,
            color: '',
        };

        const resize = () => 
        {
            state.width = canvas.parentElement.offsetWidth;
            state.height = canvas.parentElement.offsetHeight;
            canvas.width = state.width * state.scale;
            canvas.height = state.height * state.scale;
            canvas.style.width = state.width + 'px';
            canvas.style.height = state.height + 'px';
            state.radius = Math.sqrt(
                Math.pow(state.width, 2) + Math.pow(state.height, 2)
            ) / 2;
            state.centerX = state.width / 2;
            state.centerY = state.height / 2;
        };

        const updateColor = () => 
        {
            state.hue += state.hueFw ? 0.01 : -0.01;

            if (state.hue > mergedOptions.hue[1] && state.hueFw) 
            {
                state.hue = mergedOptions.hue[1];
                state.hueFw = false;
            } 
            else if (state.hue < mergedOptions.hue[0] && !state.hueFw) 
            {
                state.hue = mergedOptions.hue[0];
                state.hueFw = true;
            }

            const a = Math.floor(127 * Math.sin(0.3 * state.hue + 0) + 128);
            const b = Math.floor(127 * Math.sin(0.3 * state.hue + 2) + 128);
            const c = Math.floor(127 * Math.sin(0.3 * state.hue + 4) + 128);

            state.color = `rgba(${a},${b},${c}, 0.1)`;
        };

        const preload = () =>
        {
            for (let i = 0; i < mergedOptions.waves; i++) 
            {
                updateColor();
                for (let j = 0; j < mergedOptions.width; j++) 
                    state.waves[i].update();
            }
        };

        const init = () => 
        {
            for (let i = 0; i < mergedOptions.waves; i++) 
                state.waves[i] = new Wave();

            if (mergedOptions.preload) preload();
        };

        const render = () => 
        {
            updateColor();
            clear();

            if (mergedOptions.debug) 
            {
                ctx.beginPath();
                ctx.strokeStyle = '#f00';
                ctx.arc(state.centerX, state.centerY, state.radius, 0, pi2);
                ctx.stroke();
            }

            if (mergedOptions.background) 
                background();

            state.waves.forEach((wave) => 
            {
                wave.update();
                wave.draw();
            });
        };

        const animate = () => 
        {
            render();

            if (mergedOptions.fps) 
            {
                state.stats.log();
                ctx.font = '12px Arial';
                ctx.fillStyle = '#fff';
                ctx.fillText(state.stats.fps() + ' FPS', 10, 22);
            }

            requestAnimationFrame(animate);
        };

        const clear = () => 
        {
            ctx.clearRect(0, 0, state.width, state.height);
        };

        const background = () => 
        {
            const gradient = ctx.createLinearGradient(0, 0, 0, state.height);
            gradient.addColorStop(0, '#000');
            gradient.addColorStop(1, state.color);

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, state.width, state.height);
        };

        function Wave() 
        {
            this.Lines = [];

            this.angle = [
                rnd(pi2),
                rnd(pi2),
                rnd(pi2),
                rnd(pi2),
            ];

            this.speed = [
                rnd(mergedOptions.speed[0], mergedOptions.speed[1]) * rnd_sign(),
                rnd(mergedOptions.speed[0], mergedOptions.speed[1]) * rnd_sign(),
                rnd(mergedOptions.speed[0], mergedOptions.speed[1]) * rnd_sign(),
                rnd(mergedOptions.speed[0], mergedOptions.speed[1]) * rnd_sign(),
            ];
        }

        Wave.prototype.update = function () 
        {
            const Lines = this.Lines;
            Lines.push(new Line(this, state.color));

            if (Lines.length > mergedOptions.width) 
                Lines.shift();
        };

        Wave.prototype.draw = function () 
        {
            const ctx = canvas.getContext('2d');
            const radius = state.radius;
            const radius3 = radius / 3;
            const x = state.centerX;
            const y = state.centerY;
            const rotation = dtr(mergedOptions.rotation);
            const amplitude = mergedOptions.amplitude;
            const debug = mergedOptions.debug;

            const Lines = this.Lines;

            Lines.forEach((line, i) => 
            {
                if (debug && i > 0) return;

                const angle = line.angle;
                const x1 = x - radius * Math.cos(angle[0] * amplitude + rotation);
                const y1 = y - radius * Math.sin(angle[0] * amplitude + rotation);
                const x2 = x + radius * Math.cos(angle[3] * amplitude + rotation);
                const y2 = y + radius * Math.sin(angle[3] * amplitude + rotation);
                const cpx1 = x - radius3 * Math.cos(angle[1] * amplitude * 2);
                const cpy1 = y - radius3 * Math.sin(angle[1] * amplitude * 2);
                const cpx2 = x + radius3 * Math.cos(angle[2] * amplitude * 2);
                const cpy2 = y + radius3 * Math.sin(angle[2] * amplitude * 2);

                ctx.strokeStyle = debug ? '#fff' : line.color;

                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, x2, y2);
                ctx.stroke();

                if (debug) 
                {
                    ctx.strokeStyle = '#fff';
                    ctx.globalAlpha = 0.3;

                    ctx.beginPath();
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(cpx1, cpy1);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(x2, y2);
                    ctx.lineTo(cpx2, cpy2);
                    ctx.stroke();

                    ctx.globalAlpha = 1;
                }
            });
        };

        function Line(wave, color) 
        {
            const angle = wave.angle;
            const speed = wave.speed;

            this.angle = [
                Math.sin(angle[0] += speed[0]),
                Math.sin(angle[1] += speed[1]),
                Math.sin(angle[2] += speed[2]),
                Math.sin(angle[3] += speed[3]),
            ];

            this.color = color;
        }

        function Stats() {this.data = [];}

        Stats.prototype.time = function () 
        {
            return (performance || Date).now();
        };

        Stats.prototype.log = function () 
        {
            if (!this.last) 
            {
                this.last = this.time();
                return 0;
            }

            this.new = this.time();
            this.delta = this.new - this.last;
            this.last = this.new;

            this.data.push(this.delta);
            if (this.data.length > 10) 
                this.data.shift();
        };

        Stats.prototype.fps = function () 
        {
            let fps = 0;
            this.data.forEach((data) => fps += data);
            return Math.round(1000 / (fps / this.data.length));
        };

        function dtr(deg) 
        {
            return deg * pi / 180;
        }

        function rnd(a, b) 
        {
            if (arguments.length === 1) 
                return Math.random() * a;
            
            return a + Math.random() * (b - a);
        }

        function rnd_sign() 
        {
            return Math.random() > 0.5 ? 1 : -1;
        }

        resize();
        init();
        animate();

        if (mergedOptions.resize) 
            window.addEventListener('resize', resize, false);

        return () => 
        {
            window.removeEventListener('resize', resize, false);
        };
    }, 
    [options]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
            }}
        />
    );
};

export default Waves;