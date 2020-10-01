from .optimizeimages import optipng
import multiprocessing
import os

optimizeimg = [optipng()]

worlds = {
    "overworld": os.getenv('SKSKSK_OVERWORLD_DIR', 'pumpcraft'),
    "nether": os.getenv('SKSKSK_NETHER_DIR', 'pumpcraft_nether'),
    "the_end": os.getenv('SKSKSK_THE_END_DIR', 'pumpcraft_the_end'),
}

end_smooth_lighting = [Base(), EdgeLines(), SmoothLighting(strength=0.5)]

renders = {
    "overworld_day": {
        "world": "overworld",
        "title": "Daytime",
        "rendermode": "smooth_lighting",
        "zoom": {
            "defaultzoom": 8,
        },
    },
    "overworld_night": {
        "world": "overworld",
        "title": "Nighttime",
        "rendermode": "smooth_night",
        "zoom": {
            "defaultzoom": 8,
        },
    },
    "overworld": {
        "world": "overworld",
        "title": "Caves",
        "rendermode": "cave",
    },
    "nether": {
        "world": "nether",
        "title": "Nether",
        "rendermode": "nether_smooth_lighting",
    },
    "the_end": {
        "world": "the_end",
        "title": "The End",
        "rendermode": "end_smooth_lighting",
    },
    renders['biomes'] = {
        'title': 'Biomes',
        'rendermode': [ClearBase(), BiomeOverlay()],
        'overlay': ['day']
    },
}

outputdir = "/output/"
try:
    processes = int(os.getenv("THREADS"))
except TypeError:
    processes = multiprocessing.cpu_count()