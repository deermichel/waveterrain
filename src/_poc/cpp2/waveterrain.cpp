#include "waveterrain.h"

float map(float t, float x0, float x1, float y0, float y1) {
    return y0 + (y1-y0) * (t-x0) / (x1-x0);
}

WaveTerrain::WaveTerrain(uint32_t tableSize)
    : mTable(generateTable(tableSize)) {}

float WaveTerrain::evalTerrain(float x, float z) const {
    return (x-y) * (x-1) * (x+1) * (y-1) * (y+1);
}

table_t WaveTerrain::generateTable(uint32_t size) const {
    table_t table;
    table.resize(size);
    for (uint32_t i = 0; i < size; i++) {
        table[i].resize(size);
        for (uint32_t j = 0; j < size; j++) {
            float x = map(i, 0, size, -1, 1);
            float y = map(j, 0, size, -1, 1);
            table[i][j] = evalTerrain(x, y);
        }
    }
    return table;
}
