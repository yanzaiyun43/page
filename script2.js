// 核心状态管理
const state = {
    currentImage: null,
    history: [], // 每次加载页面时清空历史记录
    maxHistory: 10,
    isLoading: false
}

// DOM元素缓存
const dom = {
    loader: document.querySelector('.loader'),
    image: document.getElementById('anime-image'),
    historyList: document.getElementById('history-list'),
    historyBtn: document.getElementById('history-btn')
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    // 清空本地存储的历史记录
    localStorage.removeItem('imageHistory')
    loadNewImage()
    renderHistory()
    setupEventListeners()
})

// 事件监听器
function setupEventListeners() {
    dom.historyBtn.addEventListener('click', toggleHistory)
    document.addEventListener('click', handleOutsideClick)
    dom.image.addEventListener('click', loadNewImage)
}

// 历史记录管理
function updateHistory(url) {
    const existingIndex = state.history.findIndex(item => item.url === url)
    if (existingIndex > -1) state.history.splice(existingIndex, 1)
    
    state.history.push({
        url,
        timestamp: Date.now(),
        thumbnail: url
    })
    
    if (state.history.length > state.maxHistory) {
        state.history.shift()
    }
    
    localStorage.setItem('imageHistory', JSON.stringify(state.history))
    renderHistory()
}

function renderHistory() {
    dom.historyList.innerHTML = state.history
        .slice()
        .reverse()
        .map((item, index) => `
            <div class="history-item" onclick="loadFromHistory('${item.url}')">
                < img src="${item.thumbnail}" class="history-thumbnail">
                <span>${formatDate(item.timestamp)}</span>
            </div>
        `).join('')
}

function formatDate(timestamp) {
    const date = new Date(timestamp)
    return `${date.getMonth()+1}/${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`
}

// 图片加载
async function loadNewImage() {
    if (state.isLoading) return
    state.isLoading = true
    showLoader()
    
    try {
        const apiUrl = `http://shanhe.kim/api/tu/anime.php?t=${Date.now()}`
        const response = await fetch(apiUrl)
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        
        const blob = await response.blob()
        const objectURL = URL.createObjectURL(blob)
        
        await loadImage(objectURL)
        updateHistory(objectURL)
        
    } catch (error) {
        console.error('加载失败:', error)
        setTimeout(loadNewImage, 2000)
    } finally {
        state.isLoading = false
        hideLoader()
    }
}

async function loadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => {
            console.log('图片加载成功');
            dom.image.src = url
            dom.image.classList.add('loaded')
            state.currentImage = url
            resolve()
        }
        img.onerror = () => {
            console.error('图片加载失败');
            reject()
        }
        img.src = url
    })
}

// 从历史记录加载图片
function loadFromHistory(url) {
    loadImage(url).then(() => {
        state.currentImage = url
        updateHistory(url) // 更新历史记录，确保其在列表顶部
    })
}

// 下载功能
async function downloadImage() {
    if (!state.currentImage) return
    
    try {
        const response = await fetch(state.currentImage)
        const blob = await response.blob()
        const filename = `anime_${Date.now()}.jpg`

        // 安卓原生接口
        if (typeof AndroidInterface !== 'undefined') {
            const reader = new FileReader()
            reader.onload = () => {
                try {
                    const base64 = reader.result.split(',')[1]
                    AndroidInterface.saveImage(base64, filename)
                } catch (error) {
                    console.error('安卓接口错误:', error)
                    fallbackDownload(blob, filename)
                }
            }
            reader.readAsDataURL(blob)
        } 
        // 现代浏览器API
        else if ('showSaveFilePicker' in window) {
            const handle = await window.showSaveFilePicker({
                suggestedName: filename,
                types: [{
                    description: 'JPEG图片',
                    accept: {'image/jpeg': ['.jpg']}
                }]
            })
            const writable = await handle.createWritable()
            await writable.write(blob)
            await writable.close()
        }
        // 传统下载方式
        else {
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = filename
            link.style.display = 'none'
            document.body.appendChild(link)
            link.click()
            setTimeout(() => {
                URL.revokeObjectURL(url)
                link.remove()
            }, 500)
        }
    } catch (error) {
        handleDownloadError(error)
    }
}

// 工具函数
function toggleHistory() {
    dom.historyList.style.display = 
        dom.historyList.style.display === 'flex' ? 'none' : 'flex'
}

function handleOutsideClick(e) {
    if (!e.target.closest('#history-btn')) {
        dom.historyList.style.display = 'none'
    }
}

function showLoader() {
    dom.loader.style.display = 'block'
    dom.image.classList.remove('loaded')
}

function hideLoader() {
    dom.loader.style.display = 'none'
}

function handleDownloadError(error) {
    console.error('下载失败:', error)
    alert(`下载失败: ${error.message || '未知错误'}`)
}