// Hatsan2D.js - Open Source 2D Game Engine Extension for TurboWarp
(function (Scratch) {
    'use strict';

    class Hatsan2D {
        constructor() {
            // Stores our compiled WebAssembly instance globally within the extension instance
            this.wasmInstance = null;
        }

        getInfo() {
            return {
                id: 'hatsan2d',
                name: 'Hatsan2D Engine',
                color1: '#ff4a5a', // Vibrant engine accent color
                color2: '#e04050',
                blocks: [
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: "--- System & WASM Utilities ---"
                    },
                    // COMMAND block to fetch and initialize a WebAssembly binary
                    {
                        opcode: 'loadWasm',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Hatsan2D load WASM from URL: [URL]',
                        arguments: {
                            URL: { 
                                type: Scratch.ArgumentType.STRING, 
                                defaultValue: 'https://example.com/matrix_math.wasm' 
                            }
                        }
                    },
                    // REPORTER block to execute a function from the loaded WASM binary
                    {
                        opcode: 'callWasmFunction',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'Hatsan2D call WASM function: [FUNC_NAME] with Arg 1: [ARG1] Arg 2: [ARG2]',
                        arguments: {
                            FUNC_NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'add' },
                            ARG1: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                            ARG2: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
                        }
                    },
                    {
                        opcode: 'logToConsole',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Hatsan2D log [MESSAGE]',
                        arguments: {
                            MESSAGE: { 
                                type: Scratch.ArgumentType.STRING, 
                                defaultValue: 'Hello from Fugi32 architecture!' 
                            }
                        }
                    },
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: "--- Vector Math ---"
                    },
                    {
                        opcode: 'getDistance',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'Hatsan2D distance from X1: [X1] Y1: [Y1] to X2: [X2] Y2: [Y2]',
                        arguments: {
                            X1: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                            Y1: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                            X2: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                            Y2: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
                        }
                    },
                    {
                        opcode: 'getAngle',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'Hatsan2D angle from X1: [X1] Y1: [Y1] to X2: [X2] Y2: [Y2]',
                        arguments: {
                            X1: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                            Y1: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                            X2: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                            Y2: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
                        }
                    },
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: "--- Physics & Collision ---"
                    },
                    {
                        opcode: 'checkAABBCollision',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'Hatsan2D Box Collide? Obj1(X: [X1] Y: [Y1] W: [W1] H: [H1]) Obj2(X: [X2] Y: [Y2] W: [W2] H: [H2])',
                        arguments: {
                            X1: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                            Y1: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                            W1: { type: Scratch.ArgumentType.NUMBER, defaultValue: 20 },
                            H1: { type: Scratch.ArgumentType.NUMBER, defaultValue: 20 },
                            X2: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                            Y2: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                            W2: { type: Scratch.ArgumentType.NUMBER, defaultValue: 20 },
                            H2: { type: Scratch.ArgumentType.NUMBER, defaultValue: 20 }
                        }
                    }
                ]
            };
        }

        // --- Core Execution Logic ---

        async loadWasm(args) {
            this.logToConsole(`Attempting to load WebAssembly binary from: ${args.URL}`);
            try {
                // Fetch the remote binary file
                const response = await fetch(args.URL);
                if (!response.ok) throw new Error(`HTTP status error: ${response.status}`);
                
                const buffer = await response.arrayBuffer();
                // Compile the binary into an operational WebAssembly module instance
                const wasmModule = await WebAssembly.instantiate(buffer, {});
                
                this.wasmInstance = wasmModule.instance;
                this.logToConsole("WebAssembly module loaded and compiled successfully!");
            } catch (error) {
                console.error("[Hatsan2D Error]: Failed to instantiate WASM compiled binary:", error);
                this.logToConsole(`WASM Load Failed: ${error.message}`);
            }
        }

        callWasmFunction(args) {
            if (!this.wasmInstance) {
                this.logToConsole("Error: Cannot call WASM function. No module has been loaded yet.");
                return 0;
            }

            const funcName = args.FUNC_NAME;
            // Check if the requested function exists in our compiled module export table
            if (typeof this.wasmInstance.exports[funcName] === 'function') {
                // Call the low-level function and pass the argument numbers directly
                return this.wasmInstance.exports[funcName](args.ARG1, args.ARG2);
            } else {
                this.logToConsole(`Error: Export function '${funcName}' not found in WASM module.`);
                return 0;
            }
        }

        logToConsole(args) {
            const msg = typeof args === 'string' ? args : args.MESSAGE;
            console.log(`[Hatsan2D Engine]: ${msg}`);
        }

        getDistance(args) {
            const dx = args.X2 - args.X1;
            const dy = args.Y2 - args.Y1;
            return Math.sqrt(dx * dx + dy * dy);
        }

        getAngle(args) {
            const dx = args.X2 - args.X1;
            const dy = args.Y2 - args.Y1;
            return Math.atan2(dy, dx) * (180 / Math.PI);
        }

        checkAABBCollision(args) {
            return (
                args.X1 < args.X2 + args.W2 &&
                args.X1 + args.W1 > args.X2 &&
                args.Y1 < args.Y2 + args.H2 &&
                args.Y1 + args.H1 > args.Y2
            );
        }
    }

    Scratch.extensions.register(new Hatsan2D());
})(Scratch);