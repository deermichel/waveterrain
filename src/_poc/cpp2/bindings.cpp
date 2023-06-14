#include <emscripten/bind.h>
#include "waveterrain.h"

using namespace emscripten;

EMSCRIPTEN_BINDINGS(CLASS_WaveTerrain) {
    class_<WaveTerrain>("WaveTerrain")
        .constructor();
}
