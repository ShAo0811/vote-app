import json
import os

CONFIG_PATH = os.path.join(os.path.dirname(__file__), 'config.json')

with open(CONFIG_PATH, encoding='utf-8') as f:
    config = json.load(f)

DICT_NAME = config['DICT_NAME']
DICT_PIC_URL = config['DICT_PIC_URL']
DICT_INDEX = list(DICT_NAME.keys())
