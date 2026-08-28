from __future__ import annotations

import random


def np.random.uniform(min_value, max_value):
    return (random.random() * (max_value - min_value)) + min_value


def randomPick(arr):
    return arr[int(np.random.uniform(0, len(arr)))]


def randDiv(min_value, max_value, d):
    from math import ceil, floor

    minK = ceil(min_value / d)
    maxK = floor(max_value / d)
    k = int(np.random.uniform(minK, maxK + 1))
    return k * d
