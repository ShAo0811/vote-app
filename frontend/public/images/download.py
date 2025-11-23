import os
import json
import requests

# 当前目录即为 /frontend/public/images/
base_dir = os.path.dirname(__file__)
config_path = os.path.join(base_dir, '..', 'arknights_config.json')
images_dir = base_dir

# 读取 config 文件
with open(config_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

pic_dict = data.get("DICT_PIC_URL", {})

# 下载所有头像
for name, url in pic_dict.items():
    filename = os.path.join(images_dir, f"{name}.png")
    if os.path.exists(filename):
        print(f"✅ 已存在，跳过: {filename}")
        continue
    try:
        print(f"⬇️ 下载中: {name} → {url}")
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        with open(filename, 'wb') as f:
            f.write(response.content)
        print(f"✅ 成功保存: {filename}")
    except Exception as e:
        print(f"❌ 下载失败: {name} - {e}")
