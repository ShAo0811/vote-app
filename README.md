
# vote-app

##  项目简介
这是一个基于 React + Flask 构建的全栈投票应用，支持用户对干员进行强度投票，并实时展示结果排行。

- 前端：React + Vite 构建单页应用，支持快速开发与打包部署
- 后端：Flask 提供投票、结果、干员数据等接口
- 数据存储：使用 Python `pickle` 持久化投票数据
- 支持本地开发 / ngrok 外部共享 / 一体化部署

---

##  技术栈

| 层级 | 工具 |
|------|------|
| 前端 | React 18+, Vite, JavaScript ES6+ |
| 后端 | Python 3.9+, Flask, Flask-CORS |
| 存储 | `pickle` 文件持久化（支持替换为数据库） |

---

##  本地运行指南

### 1️⃣ 克隆项目

```bash
git clone https://gitee.com/zhen-you-gao-tou-ba/vote-app.git
cd vote-app
```

### 2️⃣ 安装前端依赖

```bash
cd frontend
npm install
```

### 3️⃣ 启动前端开发服务器

```bash
npm run dev
# 默认运行于 http://localhost:5173
```

### 4️⃣ 启动后端 Flask 服务

```bash
cd ../backend
pip install -r requirements.txt
python app.py
# 默认运行于 http://localhost:9876
```

---

##  对外共享开发环境（可选）

使用 [ngrok](https://ngrok.com/) 暴露本地服务：

```bash
ngrok http 5173  # 共享前端页面
ngrok http 9876  # 共享 Flask 后端接口
```

确保前端 `.env` 配置中 `VITE_BACKEND_URL` 指向你后端 ngrok 地址。

---

##  项目结构

```
vote-app/
├── frontend/        # React 前端项目（使用 Vite）
│   ├── src/
│   ├── public/
│   └── vite.config.js
├── backend/         # Flask 后端项目
│   ├── app.py
│   ├── arknights/   # 后端模块目录
│   │   ├── routes.py
│   │   └── data/    # 投票分数数据文件（.pickle）
├── README.md
```

---

##  开发建议与贡献流程

1. Fork 本项目
2. 创建分支（建议命名为 feature/xxx）
3. 开发并提交代码
4. 提交 Pull Request 进行合并

---

##  相关资源

- [React 官方文档](https://reactjs.org/)
- [Vite 官方文档](https://vitejs.dev/)
- [Flask 官方文档](https://flask.palletsprojects.com/)
- [ngrok 官方文档](https://ngrok.com/docs)
