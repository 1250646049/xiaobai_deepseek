<template>
    <div class="container local">
        <div class="header">
            <h1><i class="fas fa-microchip"></i> 系统硬件信息</h1>
            <p>本机系统硬件信息 | 模型兼容性</p>
        </div>
    
        <div class="info-grid">
            <!-- 在 info-grid div 的最前面添加以下代码 -->
            <div class="info-card model-compatibility">
                <h2><i class="fas fa-brain"></i> AI模型兼容性</h2>
                <div class="model-grid">
                    <div class="model-item">
                        <div class="model-header">
                            <i class="fas fa-microchip"></i>
                            <span>CPU模型支持</span>
                        </div>
                        <div class="model-list" id="cpu-models">
                            <div class="model-entry">
                                <span class="model-name">LLaMA 2-7B</span>
                                <span class="compatibility-badge compatible">支持</span>
                            </div>
                            <div class="model-entry">
                                <span class="model-name">ChatGLM2-6B</span>
                                <span class="compatibility-badge compatible">支持</span>
                            </div>
                            <div class="model-entry">
                                <span class="model-name">Stable Diffusion</span>
                                <span class="compatibility-badge warning">性能受限</span>
                            </div>
                        </div>
                    </div>
                    <div class="model-item">
                        <div class="model-header">
                            <i class="fas fa-tv"></i>
                            <span>GPU模型支持</span>
                        </div>
                        <div class="model-list" id="gpu-models">
                            <div class="model-entry">
                                <span class="model-name">LLaMA 2-70B</span>
                                <span class="compatibility-badge" id="llama-70b">检测中...</span>
                            </div>
                            <div class="model-entry">
                                <span class="model-name">Stable Diffusion XL</span>
                                <span class="compatibility-badge" id="sdxl">检测中...</span>
                            </div>
                            <div class="model-entry">
                                <span class="model-name">ChatGLM3-6B</span>
                                <span class="compatibility-badge" id="chatglm3">检测中...</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    
            <!-- CPU信息 -->
            <div class="info-card">
    
                <h2><i class="fas fa-microchip"></i> CPU 信息</h2>
                <div class="info-item">
                    <span class="info-label"><i class="fas fa-cog"></i> 处理器型号</span>
                    <span class="info-value" id="cpu-model">{{systemInfo.cpu["brand"]?systemInfo.cpu["brand"]:'加载中'}}</span>
                </div>
                <div class="info-item">
                    <span class="info-label"><i class="fas fa-layer-group"></i> 核心数</span>
                    <span class="info-value" id="cpu-cores">{{systemInfo.cpu["cores"]?systemInfo.cpu["cores"]:'加载中'}}</span>
                </div>
                <div class="info-item">
                    <span class="info-label"><i class="fas fa-tachometer-alt"></i> 使用率</span>
                    <span class="info-value" id="cpu-usage">{{cpuUsedRatio}}</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" id="cpu-progress" :style="{width:cpuUsedRatio}"></div>
                </div>
            </div>
    
            <!-- 内存信息 -->
            <div class="info-card">
                <h2><i class="fas fa-memory"></i> 内存信息</h2>
                <div class="info-item">
                    <span class="info-label"><i class="fas fa-database"></i> 总内存</span>
                    <span class="info-value" id="memory-total">加载中...</span>
                </div>
                <div class="info-item">
                    <span class="info-label"><i class="fas fa-server"></i> 已使用</span>
                    <span class="info-value" id="memory-used">加载中...</span>
                </div>
                <div class="info-item">
                    <span class="info-label"><i class="fas fa-percentage"></i> 使用率</span>
                    <span class="info-value" id="memory-usage">0%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" id="memory-progress" style="width: 0%"></div>
                </div>
            </div>
    
            <!-- 显卡信息 -->
            <div class="info-card">
                <h2><i class="fas fa-tv"></i> 显卡信息</h2>
                <div class="info-item">
                    <span class="info-label"><i class="fas fa-microchip"></i> 显卡型号</span>
                    <span class="info-value" id="gpu-model">加载中...</span>
                </div>
                <div class="info-item">
                    <span class="info-label"><i class="fas fa-memory"></i> 显存大小</span>
                    <span class="info-value" id="gpu-memory">加载中...</span>
                </div>
                <div class="info-item">
                    <span class="info-label"><i class="fas fa-code-branch"></i> 驱动版本</span>
                    <span class="info-value" id="gpu-driver">加载中...</span>
                </div>
            </div>
    
            <!-- 硬盘信息 -->
            <div class="info-card">
                <h2><i class="fas fa-hdd"></i> 硬盘信息</h2>
                <div class="info-item">
                    <span class="info-label"><i class="fas fa-database"></i> 总容量</span>
                    <span class="info-value" id="disk-total">加载中...</span>
                </div>
                <div class="info-item">
                    <span class="info-label"><i class="fas fa-chart-pie"></i> 已使用</span>
                    <span class="info-value" id="disk-used">加载中...</span>
                </div>
                <div class="info-item">
                    <span class="info-label"><i class="fas fa-save"></i> 剩余空间</span>
                    <span class="info-value" id="disk-free">加载中...</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" id="disk-progress" style="width: 0%"></div>
                </div>
            </div>
        </div>
    
        <button class="refresh-btn" onclick="refreshInfo()">
            <i class="fas fa-sync-alt"></i> 刷新信息
        </button>
    
    </div>
</template>

<script setup>
import { computed, onMounted, reactive } from "vue";
import systemInfoUtil from "@renderer/utils/systemInfoUtils"
const systemInfo = reactive({
  cpu: {

  },
  disks: [],
  gpu: [],
  memory: {},
  os: {}
})


const cpuUsedRatio = computed(() => {
  if (!systemInfo.cpu["speed"] || !systemInfo.cpu["cores"]) {
    return "加载中"
  }
  const {speed,cores}=systemInfo.cpu
  return Math.floor(((Number(speed)/Number(cores))*100).toFixed(4))+"%"
})

function initSystemInfo() {
  systemInfoUtil.getHardwareInfo()
    .then(r => {
      console.log(r)
      for (const item in r) {
        const result = r[item]
        if (item in systemInfo) {
          systemInfo[item] = result
        }
      }
    }).catch(e => {
      console.log(e)
    })
}


onMounted(() => {
  initSystemInfo()
})



</script>

<style lang="scss" scoped>
.container {
    max-width: 100%;
    margin: 0 auto;
    padding: 20px;
    background: #f0f2f5;
    color: #2c3e50;
    line-height: 1.6;
    min-height: 100vh;
    background: linear-gradient(135deg, #f6f8fb 0%, #f1f4f9 100%);
    box-sizing: border-box;
}

.header {
    text-align: center;
    padding: 40px 0;
    background: linear-gradient(135deg, #4834d4, #686de0);
    color: white;
    border-radius: 20px;
    margin-bottom: 30px;
    box-shadow: 0 10px 30px rgba(72, 52, 212, 0.2);
    position: relative;
    overflow: hidden;
}

.header::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, transparent 45%, rgba(255, 255, 255, 0.1) 50%, transparent 55%);
    animation: shine 3s infinite;
}

@keyframes shine {
    0% {
        transform: translateX(-100%);
    }

    100% {
        transform: translateX(100%);
    }
}

.header h1 {
    font-size: 2.8em;
    margin-bottom: 15px;
    font-weight: 700;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.header p {
    font-size: 1.2em;
    opacity: 0.9;
}

.info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 25px;
    margin-top: 20px;
    padding: 10px;
}

.info-card {
    background: white;
    padding: 25px;
    border-radius: 20px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.info-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(to bottom, #4834d4, #686de0);
    opacity: 0;
    transition: opacity 0.3s ease;
}

.info-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

.info-card:hover::before {
    opacity: 1;
}

.info-card h2 {
    color: #2c3e50;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 2px solid #f0f2f5;
    display: flex;
    align-items: center;
    font-size: 1.5em;
}

.info-card h2 i {
    margin-right: 10px;
    color: #4834d4;
}

.info-item {
    margin: 15px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
}

.info-label {
    font-weight: 500;
    color: #6c757d;
    display: flex;
    align-items: center;
}

.info-label i {
    margin-right: 8px;
    color: #4834d4;
    font-size: 0.9em;
}

.info-value {
    color: #2c3e50;
    font-weight: 600;
    background: #f8f9fa;
    padding: 5px 12px;
    border-radius: 15px;
    font-size: 0.95em;
}

.refresh-btn {
    background: linear-gradient(135deg, #4834d4, #686de0);
    color: white;
    border: none;
    padding: 15px 35px;
    border-radius: 30px;
    cursor: pointer;
    font-size: 1.1em;
    transition: all 0.3s ease;
    margin: 30px auto;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 5px 15px rgba(72, 52, 212, 0.3);
}

.refresh-btn i {
    margin-right: 8px;
}

.refresh-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(72, 52, 212, 0.4);
}

.progress-bar {
    width: 100%;
    height: 10px;
    background: #f0f2f5;
    border-radius: 20px;
    overflow: hidden;
    margin-top: 10px;
    position: relative;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #4834d4, #686de0);
    transition: width 0.5s ease;
    position: relative;
    border-radius: 20px;
}

.progress-fill::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg,
            rgba(255, 255, 255, 0.1) 0%,
            rgba(255, 255, 255, 0.2) 50%,
            rgba(255, 255, 255, 0.1) 100%);
}

@media (max-width: 768px) {
    .info-grid {
        grid-template-columns: 1fr;
        padding: 5px;
    }

    .header {
        padding: 30px 20px;
        border-radius: 15px;
    }

    .header h1 {
        font-size: 2em;
    }
}

/* 添加加载动画 */
.loading {
    animation: pulse 1.5s infinite;
}

@keyframes pulse {
    0% {
        opacity: 1;
    }

    50% {
        opacity: 0.5;
    }

    100% {
        opacity: 1;
    }
}

.model-compatibility {
    grid-column: 1 / -1;
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
}

.model-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
    margin-top: 15px;
}

.model-item {
    background: #f8f9fa;
    padding: 15px;
    border-radius: 15px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.model-header {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    color: #4834d4;
    font-weight: 600;
}

.model-header i {
    margin-right: 10px;
    font-size: 1.2em;
}

.model-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.model-entry {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    background: white;
    border-radius: 10px;
    transition: transform 0.2s ease;
}

.model-entry:hover {
    transform: translateX(5px);
}

.model-name {
    font-weight: 500;
    color: #2c3e50;
}

.compatibility-badge {
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.9em;
    font-weight: 500;
}

.compatibility-badge.compatible {
    background: #a8e6cf;
    color: #1b4332;
}

.compatibility-badge.warning {
    background: #ffd3b6;
    color: #7c3c21;
}

.compatibility-badge.incompatible {
    background: #ffaaa5;
    color: #6a1b1b;
}
</style>