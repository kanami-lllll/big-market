# Big Market 大营销系统

Big Market 是一个包含用户前台、ERP 管理端、Java 后端和完整中间件栈的营销活动系统。当前仓库已经整理为 Docker Compose 全量一键启动方案。

## 项目组成

| 目录 | 角色 | 技术栈 | 说明 |
| --- | --- | --- | --- |
| `big-market-master` | Java 后端 | Spring Boot、Dubbo、MyBatis、XXL-Job、RabbitMQ、Redis、MySQL、Elasticsearch | 提供营销活动、抽奖、账户、订单、任务调度、ERP 接口等核心能力 |
| `big-market-front-main` | 用户前台 | Next.js、React、Tailwind CSS | 面向用户的活动页面和抽奖交互页面 |
| `big-market-erp-master` | ERP 管理端 | Umi Max、Ant Design Pro、React | 面向运营/管理人员的后台管理页面 |
| `docker-compose.yml` | 全量编排 | Docker Compose | 一键拉起后端、两个前端和所有必要中间件 |
| `.env.example` | 环境变量模板 | Compose env | 统一管理端口、账号、API 地址和部署开关 |

## 架构关系

```text
用户浏览器
  ├─ http://localhost:3000  -> 用户前台 big-market-front-main
  ├─ http://localhost:8000  -> ERP 管理端 big-market-erp-master
  └─ 调用 http://localhost:8098 -> Java 后端 big-market-master

Java 后端
  ├─ MySQL             业务库、Nacos 库、XXL-Job 库
  ├─ Redis             缓存、库存、锁等
  ├─ RabbitMQ          消息队列
  ├─ Nacos             Dubbo 注册中心
  ├─ XXL-Job Admin     定时任务调度中心
  ├─ Elasticsearch     订单/活动相关搜索数据
  ├─ Canal Server      监听 MySQL binlog
  └─ Canal Adapter     同步数据到 Elasticsearch
```

## 快速启动

### 1. 环境要求

请先确认本机已经安装并启动：

| 工具 | 建议版本 |
| --- | --- |
| Docker Desktop | 支持 Docker Compose v2 |
| Docker Compose | `docker compose` 命令可用 |
| 内存 | 建议 12 GB 以上，推荐 16 GB 以上 |
| 磁盘 | 建议预留 10 GB 以上 |

> 当前 full 版会同时启动 MySQL、Redis、RabbitMQ、Nacos、Zookeeper、Elasticsearch、Kibana、Canal、XXL-Job、Prometheus、Grafana 等组件，资源占用明显高于普通前后端项目。

### 2. 准备环境变量

首次启动前可以复制一份 `.env`：

```powershell
Copy-Item .env.example .env
```

如果不创建 `.env`，Compose 也会使用 `docker-compose.yml` 中的默认值。

### 3. 一键构建并启动

```powershell
docker compose up -d --build
```

首次启动会拉取较多镜像，并初始化 MySQL 数据。根据网络和机器性能，第一次启动可能需要 10 到 20 分钟。

### 4. 查看启动状态

```powershell
docker compose ps
```

核心服务应至少达到以下状态：

| 服务 | 期望状态 |
| --- | --- |
| `big-market-backend` | `healthy` |
| `big-market-front` | `healthy` |
| `big-market-erp` | `healthy` |
| `big-market-mysql` | `healthy` |
| `big-market-redis` | `healthy` |
| `big-market-rabbitmq` | `healthy` |
| `big-market-nacos` | `healthy` |
| `big-market-xxl-job-admin` | `healthy` |
| `big-market-elasticsearch` | `healthy` |

`canal-adapter`、`canal-server`、`grafana`、`kibana`、`phpmyadmin`、`prometheus` 等没有全部配置 healthcheck，状态为 `Up` 即可。

## 访问地址

| 模块 | 地址 | 默认账号 |
| --- | --- | --- |
| 用户前台 | http://localhost:3000 | 无 |
| ERP 管理端 | http://localhost:8000 | Docker 部署默认跳过模板登录 |
| Java 后端健康检查 | http://localhost:8098/actuator/health | 无 |
| phpMyAdmin | http://localhost:8899 | `root / 123456` |
| Redis Admin | http://localhost:8081 | `admin / admin` |
| RabbitMQ Management | http://localhost:15672 | `admin / admin` |
| Nacos | http://localhost:8848/nacos | 常见默认账号为 `nacos / nacos` |
| XXL-Job Admin | http://localhost:9090/xxl-job-admin | 常见默认账号为 `admin / 123456` |
| Elasticsearch | http://localhost:9200 | 无 |
| Kibana | http://localhost:5601 | 无 |
| Prometheus | http://localhost:9091 | 无 |
| Grafana | http://localhost:4000 | `admin / admin` |

## 端口规划

| 服务 | 容器端口 | 宿主机端口 | 变量 |
| --- | --- | --- | --- |
| Backend | `8098` | `8098` | `BACKEND_PORT` |
| Front | `3000` | `3000` | `FRONT_PORT` |
| ERP | `80` | `8000` | `ERP_PORT` |
| MySQL | `3306` | `13306` | `MYSQL_PORT` |
| Redis | `6379` | `16379` | `REDIS_PORT` |
| RabbitMQ | `5672` | `5672` | `RABBITMQ_PORT` |
| RabbitMQ UI | `15672` | `15672` | `RABBITMQ_MANAGEMENT_PORT` |
| Nacos | `8848` | `8848` | `NACOS_PORT` |
| Nacos gRPC | `9848` | `9848` | `NACOS_GRPC_PORT` |
| Zookeeper | `2181` | `2181` | `ZOOKEEPER_PORT` |
| Elasticsearch HTTP | `9200` | `9200` | `ELASTICSEARCH_HTTP_PORT` |
| Elasticsearch Transport | `9300` | `9300` | `ELASTICSEARCH_TRANSPORT_PORT` |
| Kibana | `5601` | `5601` | `KIBANA_PORT` |
| XXL-Job Admin | `9090` | `9090` | `XXL_JOB_ADMIN_PORT` |
| Prometheus | `9090` | `9091` | `PROMETHEUS_PORT` |
| Grafana | `3000` | `4000` | `GRAFANA_PORT` |

## 常用命令

### 启动

```powershell
docker compose up -d --build
```

### 停止

```powershell
docker compose down
```

### 停止并清理数据卷

该命令会删除 MySQL、Redis、RabbitMQ、Elasticsearch、Grafana 的持久化数据。只有在需要重新初始化数据库时再执行。

```powershell
docker compose down -v
```

### 查看日志

```powershell
docker logs -f big-market-backend
docker logs -f big-market-mysql
docker logs -f big-market-nacos
docker logs -f big-market-xxl-job-admin
```

### 重新构建单个服务

```powershell
docker compose build backend
docker compose build front
docker compose build erp
```

### 重新启动单个服务

```powershell
docker compose up -d backend
docker compose up -d front
docker compose up -d erp
```

## 健康检查

可以用下面的命令快速验证核心入口：

```powershell
$urls = @(
  'http://localhost:8098/actuator/health',
  'http://localhost:3000/',
  'http://localhost:8000/',
  'http://localhost:9091/-/ready',
  'http://localhost:4000/api/health',
  'http://localhost:8848/nacos/actuator/health',
  'http://localhost:9090/xxl-job-admin/',
  'http://localhost:15672/',
  'http://localhost:8899/',
  'http://localhost:9200/_cluster/health'
)

foreach ($url in $urls) {
  try {
    $r = Invoke-WebRequest -UseBasicParsing $url -TimeoutSec 10
    Write-Host "$url -> $($r.StatusCode)"
  } catch {
    Write-Host "$url -> ERROR $($_.Exception.Message)"
  }
}
```

全部核心入口返回 `200` 即可认为 full 版基础部署成功。

## 环境变量说明

`.env.example` 中已经给出默认值：

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `MYSQL_ROOT_PASSWORD` | MySQL root 密码 | `123456` |
| `RABBITMQ_DEFAULT_USER` | RabbitMQ 用户名 | `admin` |
| `RABBITMQ_DEFAULT_PASS` | RabbitMQ 密码 | `admin` |
| `PUBLIC_API_HOST_URL` | 浏览器访问后端的 API 地址 | `http://localhost:8098` |
| `ERP_SKIP_AUTH` | ERP Docker 部署是否跳过模板登录 | `true` |
| `GRAFANA_ADMIN_USER` | Grafana 管理员账号 | `admin` |
| `GRAFANA_ADMIN_PASSWORD` | Grafana 管理员密码 | `admin` |

如果部署到云服务器，需要把 `PUBLIC_API_HOST_URL` 改成浏览器可访问的公网后端地址，例如：

```env
PUBLIC_API_HOST_URL=http://your-server-ip:8098
```

修改后需要重新构建前端镜像：

```powershell
docker compose build front erp
docker compose up -d front erp
```

## 数据初始化

MySQL 初始化 SQL 位于：

```text
big-market-master/docs/dev-ops/mysql/sql
```

首次启动时，MySQL 容器会自动执行该目录下的 SQL，包括：

| SQL | 作用 |
| --- | --- |
| `big_market.sql` | 主业务库 |
| `big_market_01.sql` | 分库 01 |
| `big_market_02.sql` | 分库 02 |
| `nacos.sql` | Nacos 配置库 |
| `xxl_job.sql` | XXL-Job 配置库 |
| `init.sql` | Canal 用户和复制权限 |

注意：这些 SQL 只会在 MySQL 数据卷首次创建时自动执行。如果已经启动过，再修改 SQL 不会自动重新导入。需要重新初始化时执行：

```powershell
docker compose down -v
docker compose up -d --build
```

Elasticsearch 运营查询数据由 `es-init` 容器初始化。该容器会自动创建以下索引，并调用 Canal Adapter ETL 接口把 MySQL 分表中的历史抽奖单导入 ES：

| ES 索引 | 用途 |
| --- | --- |
| `big_market.user_raffle_order` | ERP 用户抽奖单列表 |
| `big_market.raffle_activity_order` | 活动订单同步链路 |

后端 ERP 查询已改为调用 Elasticsearch REST SQL API，不再依赖 Elasticsearch JDBC 许可证。

## Docker 化改造说明

当前 full 版一键启动做了以下部署改造：

| 改造点 | 目的 |
| --- | --- |
| 后端新增 Dockerfile | 使用 Maven + JDK 8 在容器内构建，避免本地 JDK 版本影响 |
| 后端新增 `application-docker.yml` | 把 MySQL、Redis、RabbitMQ、Nacos、XXL、ES 地址统一改为 Compose 服务名 |
| 用户前台 Dockerfile | 构建 Next.js standalone 产物 |
| ERP Dockerfile + Nginx | 构建 Umi 静态产物并通过 Nginx 提供 SPA 页面 |
| 前台/ERP API 地址环境变量化 | 统一浏览器调用后端地址 |
| ERP `ERP_SKIP_AUTH` | Docker 演示环境跳过 Ant Design Pro 模板登录阻断 |
| Compose 健康检查 | 控制后端在中间件 ready 后再启动 |
| `es-init` 初始化容器 | 自动创建 ES 索引并触发 Canal Adapter 全量 ETL |
| ERP 抽奖单查询改为 ES REST SQL | 保留 ES 查询链路，同时绕开 ES JDBC 许可证限制 |
| MySQL 启动参数化 | 避免 Windows 挂载 `my.cnf` 权限导致配置被 MySQL 忽略 |
| Grafana 使用 SQLite | 避免示例 grafana.ini 中历史 MySQL 地址导致启动失败 |

## 常见问题

### 1. 首次启动很慢

正常。首次启动需要拉取大量镜像、构建三个自研镜像、初始化 MySQL 数据库。MySQL 初始化期间可能持续数分钟。

查看 MySQL 初始化日志：

```powershell
docker logs -f big-market-mysql
```

看到下面日志表示初始化完成：

```text
MySQL init process done. Ready for start up.
```

### 2. Docker Hub 拉镜像失败

如果看到 `EOF`、`failed to fetch oauth token`、`short read` 等错误，通常是网络问题。可以重试：

```powershell
docker compose up -d
```

也可以单独拉取失败的镜像：

```powershell
docker pull 镜像名:版本
```

### 3. 端口被占用

修改 `.env` 中对应端口，然后重新启动。例如本机 `3000` 被占用：

```env
FRONT_PORT=3001
```

再执行：

```powershell
docker compose up -d
```

### 4. 前端页面能打开但接口失败

确认 `PUBLIC_API_HOST_URL` 是浏览器可访问的后端地址。

本机部署通常是：

```env
PUBLIC_API_HOST_URL=http://localhost:8098
```

云服务器部署通常是：

```env
PUBLIC_API_HOST_URL=http://服务器公网IP:8098
```

修改后需要重新构建前端：

```powershell
docker compose build front erp
docker compose up -d front erp
```

### 5. 兑换抽奖次数提示活动库存不足

如果用户前台提示 `ERR_BIZ_005 活动库存不足`，但数据库里的 `raffle_activity_sku.stock_count_surplus` 仍有库存，通常是 Redis 中的活动 SKU 库存缓存还没有预热。

当前用户前台首页已经会自动调用装配接口预热默认活动。如果仍然遇到该问题，可以手动执行：

```powershell
Invoke-WebRequest -UseBasicParsing "http://localhost:8098/api/v1/raffle/activity/armory?activityId=100301"
```

也可以在页面上点击“装配抽奖”按钮后再兑换抽奖次数。

### 6. 后端本地 Maven 编译失败但 Docker 能构建

项目后端偏 Java 8 生态。本机如果使用较新的 JDK，可能出现 Lombok 或注解处理相关错误。Dockerfile 使用 JDK 8 构建，优先以 Docker 构建结果为准。

### 7. MySQL 配置文件被忽略

Windows 挂载配置文件时可能出现权限为 777，MySQL 会忽略该配置。当前 Compose 已将 binlog、字符集、时区等关键参数放到 `mysql.command` 中，避免该问题影响 Canal 和后端。

## 当前验证结果

本项目已经在 Windows + Docker Desktop 环境下完成 full 版启动验证：

| 验证项 | 结果 |
| --- | --- |
| `docker compose config --quiet` | 通过 |
| 后端镜像构建 | 通过 |
| 用户前台镜像构建 | 通过 |
| ERP 镜像构建 | 通过 |
| MySQL 初始化 SQL | 通过 |
| 后端健康检查 | 通过 |
| 用户前台访问 | 通过 |
| ERP 管理端访问 | 通过 |
| Nacos / XXL / RabbitMQ / Redis / ES | 通过 |
| Prometheus / Grafana | 通过 |


## 4C4G 服务器 Lite 版 Docker 部署

Lite 版用于 4 核 4G 云服务器，只保留用户前台和核心抽奖链路，舍弃 ERP、Elasticsearch、Canal、Kibana、Prometheus、Grafana、phpMyAdmin、redis-admin 等较重服务。

### Lite 版保留服务

| 服务 | 作用 |
| --- | --- |
| `front` | 用户前台页面 |
| `backend` | Java 后端核心业务 |
| `mysql` | 业务数据、订单、奖品、库存、积分 |
| `redis` | 抽奖策略缓存、库存扣减、防超卖 |
| `rabbitmq` | 异步发奖、积分兑换、任务消息 |
| `nacos` | Dubbo 注册中心 |
| `xxl-job-admin` | 定时任务与补偿任务 |

### Lite 版不启动服务

| 服务 | 不启动原因 | 影响 |
| --- | --- | --- |
| `erp` | 管理端前端，不属于核心抽奖链路 | 不能访问 ERP 后台 |
| `elasticsearch` | 内存占用较高，主要服务 ERP 查询 | ERP 抽奖订单查询不可用 |
| `canal-server` / `canal-adapter` | 用于 MySQL 同步 Elasticsearch | ES 数据同步不可用 |
| `kibana` | Elasticsearch 可视化工具 | 不影响前台抽奖 |
| `prometheus` / `grafana` | 监控看板 | 不影响核心业务 |
| `phpmyadmin` / `redis-admin` | 数据库和 Redis Web 管理工具 | 不影响核心业务 |
| `zookeeper` | Docker 版默认使用 Nacos，不启用 Zookeeper | 不影响默认链路 |

### 1. 准备环境变量

复制 Lite 版环境变量模板：

```bash
cp .env.lite.example .env.lite
```

修改 `.env.lite`：

```env
PUBLIC_API_HOST_URL=http://服务器公网IP:8098
MYSQL_ROOT_PASSWORD=替换成你的MySQL强密码
RABBITMQ_DEFAULT_USER=admin
RABBITMQ_DEFAULT_PASS=替换成你的RabbitMQ强密码
BACKEND_PORT=8098
FRONT_PORT=3000
```

本机测试时可以使用：

```env
PUBLIC_API_HOST_URL=http://localhost:8098
```

云服务器部署时必须改成浏览器可以访问的公网地址，例如：

```env
PUBLIC_API_HOST_URL=http://123.123.123.123:8098
```

### 2. 启动 Lite 版

```bash
docker compose --env-file .env.lite -p big-market-lite -f docker-compose.lite.yml up -d --build
```

参数说明：

| 参数 | 作用 |
| --- | --- |
| `--env-file .env.lite` | 指定 Lite 版环境变量文件 |
| `-p big-market-lite` | 指定 Compose 项目名，避免和 full 版容器混淆 |
| `-f docker-compose.lite.yml` | 使用 Lite 版编排文件 |
| `up -d --build` | 后台启动，并在代码变化后重新构建镜像 |

### 3. 查看启动状态

```bash
docker compose --env-file .env.lite -p big-market-lite -f docker-compose.lite.yml ps
```

正常情况下，以下服务应为 `healthy`：

```text
big-market-lite-mysql
big-market-lite-redis
big-market-lite-rabbitmq
big-market-lite-nacos
big-market-lite-xxl-job-admin
big-market-lite-backend
big-market-lite-front
```

### 4. 访问地址

本机测试：

| 页面 / 服务 | 地址 |
| --- | --- |
| 用户前台 | `http://localhost:3000` |
| Java 后端 | `http://localhost:8098` |
| 后端健康检查 | `http://localhost:8098/actuator/health` |

云服务器部署：

| 页面 / 服务 | 地址 |
| --- | --- |
| 用户前台 | `http://服务器公网IP:3000` |
| Java 后端 | `http://服务器公网IP:8098` |
| 后端健康检查 | `http://服务器公网IP:8098/actuator/health` |

云服务器安全组至少需要放行：

| 端口 | 用途 |
| --- | --- |
| `3000` | 用户前台 |
| `8098` | Java 后端 API |

MySQL、Redis、RabbitMQ、Nacos、XXL-Job 在 Lite 版中默认不暴露公网端口，只在 Docker 内部网络访问。

### 5. 停止 Lite 版

停止容器但保留数据卷：

```bash
docker compose --env-file .env.lite -p big-market-lite -f docker-compose.lite.yml down
```

如果需要连数据卷一起删除，谨慎执行：

```bash
docker compose --env-file .env.lite -p big-market-lite -f docker-compose.lite.yml down -v
```

`down -v` 会删除 MySQL、Redis、RabbitMQ 的 Lite 版数据卷，等于清空 Lite 环境数据。

### 6. Lite 版注意事项

Lite 版目标是让 4C4G 服务器稳定运行核心抽奖链路，不是完整后台管理版。

当前 Lite 版不支持 ERP 管理端、Elasticsearch 订单查询、Canal 数据同步和 Grafana 监控看板。如果需要这些能力，请使用默认 `docker-compose.yml` 启动 full 版。

Lite 版后端关闭了 `management.health.db.enabled`，避免因为不启动 Elasticsearch 导致 `/actuator/health` 返回 503。MySQL、Redis、RabbitMQ 等核心依赖仍由 Docker Compose 的健康检查保证。

4C4G 环境可以用于功能演示和小规模压测，不适合做高并发极限压测。压测时建议逐步提高并发，并观察：

```bash
docker stats
```

重点关注 `backend`、`mysql`、`nacos`、`xxl-job-admin` 的内存占用。
