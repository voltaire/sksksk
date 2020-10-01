#!/bin/bash

set -e

mkdir -p /worlds /data
s3cmd get --progress $BACKUP_S3_URI /data/pumpcraft.tar.gz
cd /worlds
tar xvf /data/pumpcraft.tar.gz
overviewer.py --config /overviewer_cfg.py
s3cmd sync --storage-class ONEZONE_IA --delete-removed --reduced-redundancy --progress /output/ s3://map.tonkat.su/