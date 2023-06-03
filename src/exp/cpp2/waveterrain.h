#ifndef WAVETERRAIN_H
#define WAVETERRAIN_H

#include <vector>

typedef float sample_t;
typedef std::vector<std::vector<sample_t>> table_t;

class WaveTerrain {
public:
    WaveTerrain(uint32_t tableSize);

    float evalTerrain(float x, float z) const;

    void render(sample_t *output, uint32_t numFrames);

private:
    table_t mTable;

    table_t generateTable(uint32_t size) const;
};

#endif
