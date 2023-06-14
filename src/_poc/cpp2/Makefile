EMFLAGS = \
	--bind \
	-s WASM=1 \
	-s WASM_ASYNC_COMPILATION=0 \
	-s SINGLE_FILE=1 \
	-s EXPORT_ES6=1 \
	-s MODULARIZE=1 \
	-s ENVIRONMENT=shell

SOURCES = \
	bindings.cpp \
	waveterrain.cpp

OUT = waveterrain.js

build: $(SOURCES)
	@emcc $(EMFLAGS) -o $(OUT) $(SOURCES)
