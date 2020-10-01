import multiprocessing
import os

worlds = {
    "overworld": os.getenv('SKSKSK_OVERWORLD_DIR', 'pumpcraft'),
    "nether": os.getenv('SKSKSK_NETHER_DIR', 'pumpcraft_nether'),
    "the_end": os.getenv('SKSKSK_THE_END_DIR', 'pumpcraft_the_end'),
}

end_smooth_lighting = [Base(), EdgeLines(), SmoothLighting(strength=0.5)] # pylint: disable=undefined-variable

renders = {
    "overworld_day": {
        "world": "overworld",
        "title": "Daytime",
        "rendermode": "smooth_lighting",
        "defaultzoom": 8,
    },
    "overworld_night": {
        "world": "overworld",
        "title": "Nighttime",
        "rendermode": "smooth_night",
        "defaultzoom": 8,
    },
    "overworld_cave": {
        "world": "overworld",
        "title": "Caves",
        "rendermode": "cave",
        "defaultzoom": 8,
    },
    "nether": {
        "world": "nether",
        "title": "Nether",
        "rendermode": "nether_smooth_lighting",
    },
    "the_end": {
        "world": "the_end",
        "title": "The End",
        "rendermode": end_smooth_lighting,
    },
    "biomes": {
        "world": "overworld",
        "title": "Biomes",
        "rendermode": [ClearBase(), BiomeOverlay()], # pylint: disable=undefined-variable
        "overlay": ["overworld_day"]
    },
}

outputdir = "/output/"
try:
    processes = int(os.getenv("THREADS"))
except TypeError:
    processes = multiprocessing.cpu_count()