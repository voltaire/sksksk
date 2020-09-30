#!/bin/bash

set -e

mkdir -p /worlds /data
aws s3 cp $BACKUP_S3_URI /data/pumpcraft.tar.gz
cd /worlds
tar xvf /data/pumpcraft.tar.gz
overviewer.py --config /overviewer_cfg.py
aws s3 sync --storage-class ONEZONE_IA --delete /output/ s3://map.tonkat.su/