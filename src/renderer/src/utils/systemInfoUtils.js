const si = require('systeminformation')

async function getHardwareInfo() {
  try {
    // CPU信息
    const cpu = await si.cpu()
    // GPU信息
    const graphics = await si.graphics()
    // 内存信息
    const mem = await si.mem()
    // 硬盘信息
    const disks = await si.fsSize()
    // 操作系统信息
    const os = await si.osInfo()

    return new Promise((reslove, reject) => {
      try {
        const params = {
          cpu: {
            manufacturer: cpu.manufacturer,
            brand: cpu.brand,
            physicalCores: cpu.physicalCores,
            cores: cpu.cores,
            speed: cpu.speed,
            speedMax: cpu.speedMax,
            speedMin: cpu.speedMin,
            cache: cpu.cache
          },
          gpu: graphics.controllers.map((gpu) => ({
            model: gpu.model,
            vendor: gpu.vendor,
            vram: gpu.vram,
            driverVersion: gpu.driverVersion
          })),
          memory: {
            total: formatBytes(mem.total),
            free: formatBytes(mem.free),
            used: formatBytes(mem.used),
            active: formatBytes(mem.active),
            available: formatBytes(mem.available),
            swapTotal: formatBytes(mem.swaptotal),
            swapUsed: formatBytes(mem.swapused),
            swapFree: formatBytes(mem.swapfree)
          },
          disks: disks.map((disk) => ({
            fs: disk.fs,
            type: disk.type,
            size: formatBytes(disk.size),
            used: formatBytes(disk.used),
            available: formatBytes(disk.available),
            mount: disk.mount,
            usePercentage: disk.use
          })),
          os: {
            platform: os.platform,
            distro: os.distro,
            release: os.release,
            kernel: os.kernel,
            arch: os.arch
          }
        }
        reslove(params)
      } catch (e) {
        reject(e)
      }
    })
  } catch (error) {
    console.error('Error getting hardware info:', error)
    return Promise.reject(error)
  }
}

// 格式化字节数为可读格式
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 获取CPU使用率
async function getCpuUsage() {
  try {
    const load = await si.currentLoad()
    return {
      currentLoad: load.currentLoad.toFixed(2),
      avgLoad: load.avgLoad.toFixed(2),
      coreLoads: load.cpus.map((core) => ({
        load: core.load.toFixed(2)
      }))
    }
  } catch (error) {
    console.error('Error getting CPU usage:', error)
    throw error
  }
}

// 获取GPU使用率
async function getGpuUsage() {
  try {
    const graphics = await si.graphics()
    return graphics.controllers.map((gpu) => ({
      model: gpu.model,
      utilizationGpu: gpu.utilizationGpu || 'N/A',
      memoryTotal: gpu.memoryTotal ? formatBytes(gpu.memoryTotal * 1024 * 1024) : 'N/A',
      memoryUsed: gpu.memoryUsed ? formatBytes(gpu.memoryUsed * 1024 * 1024) : 'N/A',
      temperatureGpu: gpu.temperatureGpu || 'N/A'
    }))
  } catch (error) {
    console.error('Error getting GPU usage:', error)
    throw error
  }
}

// 获取实时内存使用情况
async function getMemoryUsage() {
  try {
    const mem = await si.mem()
    return {
      total: formatBytes(mem.total),
      used: formatBytes(mem.used),
      free: formatBytes(mem.free),
      active: formatBytes(mem.active),
      available: formatBytes(mem.available),
      usePercentage: ((mem.used / mem.total) * 100).toFixed(2)
    }
  } catch (error) {
    console.error('Error getting memory usage:', error)
    throw error
  }
}

// 获取硬盘使用情况
async function getDiskUsage() {
  try {
    const disks = await si.fsSize()
    return disks.map((disk) => ({
      fs: disk.fs,
      type: disk.type,
      size: formatBytes(disk.size),
      used: formatBytes(disk.used),
      available: formatBytes(disk.available),
      mount: disk.mount,
      usePercentage: disk.use
    }))
  } catch (error) {
    console.error('Error getting disk usage:', error)
    throw error
  }
}

export default {
  getHardwareInfo
}
