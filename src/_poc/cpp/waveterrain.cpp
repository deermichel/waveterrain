#include <stdint.h>

class WaveTerrain {
public:
    WaveTerrain() {}

    void render(float *output, int32_t num_frames) {
        for (int32_t i = 0; i < num_frames; ++i) {
            output[i] = 0.0f;
        }
    }

private:
};
