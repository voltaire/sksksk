import multiprocessing
import os

worlds = {
    "overworld": os.getenv('SKSKSK_OVERWORLD_DIR', 'pumpcraft'),
    "nether": os.getenv('SKSKSK_NETHER_DIR', 'pumpcraft_nether'),
    "the_end": os.getenv('SKSKSK_THE_END_DIR', 'pumpcraft_the_end'),
}

renders = {
    "overworld_day": {
        "world": "overworld",
        "title": "Daytime",
        "rendermode": "smooth_lighting",
    },
    "overworld_night": {
        "world": "overworld",
        "title": "Nighttime",
        "rendermode": "smooth_night",
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
        "rendermode": "lighting",
    },
}

outputdir = "/output/"
processes = multiprocessing.cpu_count()