#include <emscripten/bind.h>
#include "waveterrain.cpp"

using namespace emscripten;

EMSCRIPTEN_BINDINGS(CLASS_WaveTerrain) {
    class_<WaveTerrain>("WaveTerrain")
        .constructor();
}
