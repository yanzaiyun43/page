document.addEventListener('DOMContentLoaded', () => {
      const apiUrl = 'https://applet.dimtown.com/api/walls?sort=updatedAt:desc&pagination%5Bpage%5D=';
      const wallpapersContainer = document.getElementById('wallpapers');
      const modal = document.getElementById('myModal');
      const modalImage = document.getElementById('modal-image');
      const closeBtn = document.querySelector('.close');
      const downloadBtn = document.getElementById('downloadBtn');
      const message = document.getElementById('message');
      let currentPage = 1;
      let hasMorePages = true;

      function fetchWallpapers(page) {
        setTimeout(() => {
          fetch(`${apiUrl}${page}`)
            .then(response => response.json())
            .then(data => {
              if (data.data.length === 0) {
                hasMorePages = false;
                message.textContent = '已经到底了';
              } else {
                message.textContent = '';
                data.data.forEach(item => {
                  const { id, attributes } = item;
                  const { title, image, cover } = attributes;
                  const card = document.createElement('div');
                  card.className = 'wallpaper-card';

                  const img = document.createElement('img');
                  img.onload = () => {
                    img.style.opacity = 1; // 确保图片加载完成后显示
                  };
                  img.onerror = () => {
                    img.src = cover; // 如果image加载失败，尝试cover字段
                  };
                  img.src = image;
                  img.alt = title;

                  const titleDiv = document.createElement('div');
                  titleDiv.className = 'title';
                  titleDiv.textContent = title;

                  card.appendChild(img);
                  card.appendChild(titleDiv);
                  card.addEventListener('click', () => {
                    modal.style.display = 'block';
                    modalImage.src = image;
                    downloadBtn.style.display = 'block';
                  });
                  wallpapersContainer.appendChild(card);
                });
              }
            })
            .catch(error => {
              console.error('Error fetching data:', error);
            });
        }, 1000); // 添加1秒延时
      }

      fetchWallpapers(currentPage);

      closeBtn.onclick = () => {
        modal.style.display = 'none';
        downloadBtn.style.display = 'none';
      };

      modalImage.onclick = () => {
        modal.style.display = 'none';
        downloadBtn.style.display = 'none';
      };

      window.onclick = (event) => {
        if (event.target === modal) {
          modal.style.display = 'none';
          downloadBtn.style.display = 'none';
        }
      };

      downloadBtn.onclick = () => {
        const imageUrl = modalImage.src;
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = 'anime_wallpaper';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        modal.style.display = 'none';
        downloadBtn.style.display = 'none';
      };

      window.onscroll = () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight && hasMorePages) {
          currentPage++;
          fetchWallpapers(currentPage);
        }
      };
    });