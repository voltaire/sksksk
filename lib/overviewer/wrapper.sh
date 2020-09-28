#!/bin/bash

set -e

mkdir -p /worlds /data
aws s3 cp $BACKUP_S3_URI /data/pumpcraft.tar.gz
cd /worlds
tar xvf /data/pumpcraft.tar.gz
overviewer.py --config /overviewer_cfg.py
aws s3 sync /output/ s3://skskskstack-skskskworldmapscf6b4e22-1ldpl0tgqx9ok/