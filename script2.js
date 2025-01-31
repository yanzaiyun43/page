// 自动显示弹窗
        window.addEventListener('DOMContentLoaded', () => {
          document.getElementById('modal').style.display = 'flex';
        });
        
        // 未成年按钮
        document.getElementById('btn1').addEventListener('click', () => {
          alert('你还小，不适合看这些\n请离开！');
        });
        
        // 已成年按钮
        document.getElementById('btn2').addEventListener('click', async () => {
          const videoContainer = document.getElementById('videoContainer');
          const btnGroup = document.getElementById('btnGroup');
          const video = document.getElementById('gameVideo');
          
          try {
            // 显示加载状态
            btnGroup.style.opacity = '0.5';
            btnGroup.style.pointerEvents = 'none';
        
            // 显示视频容器
            videoContainer.style.display = 'block';
            btnGroup.style.display = 'none';
        
            // 确保视频不是静音状态
            video.muted = false;
        video.controls = false; // 隐藏控制条
            // 自动播放视频
            await video.play();
            
          } catch (error) {
            console.log('视频播放错误:', error);
            alert('视频加载失败，请检查网络连接');
            btnGroup.style.display = 'flex';
            btnGroup.style.opacity = '1';
            btnGroup.style.pointerEvents = 'all';
          }
        
          // 视频播放结束后恢复界面
          video.onended = () => {
            btnGroup.style.display = 'flex';
            videoContainer.style.display = 'none';
            btnGroup.style.opacity = '1';
            btnGroup.style.pointerEvents = 'all';
          };
        });
        
        // ESC键关闭
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
            document.getElementById('modal').style.display = 'none';
          }
        });