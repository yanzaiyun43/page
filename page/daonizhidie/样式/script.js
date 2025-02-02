document.addEventListener('DOMContentLoaded', () => {
            const apiUrl = 'https://animedb.sinaapp.com/proxy/p.php?page=';
            const wallpapersContainer = document.getElementById('wallpapers');
            const modal = document.getElementById('myModal');
            const modalImage = document.getElementById('modal-image');
            const closeBtn = document.querySelector('.close');
            const downloadBtn = document.getElementById('downloadBtn');
            let currentPage = 1;
            let hasMorePages = true;

            function fetchWallpapers(page) {
                fetch(`${apiUrl}${page}&size=30`,{
                            mode:'no-cors'
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.length === 0) {
                            hasMorePages = false;
                            return;
                        }
                        data.forEach(item => {
                            const { mmid, preview, original, illustid, illustorid } = item;
                            const card = document.createElement('div');
                            card.className = 'wallpaper-card';

                            const img = document.createElement('img');
                            const modifiedPreview = preview.replace('https://i.pximg.net', 'https://wxdl.freephantom.cn/i.pximg.net');
                            img.src = modifiedPreview;
                            img.alt = `Pixiv ${mmid}`;

                            const titleDiv = document.createElement('div');
                            titleDiv.className = 'title';
                            titleDiv.textContent = `画师ID: ${illustorid} | 作品ID: ${illustid}`;

                            card.appendChild(img);
                            card.appendChild(titleDiv);
                            card.addEventListener('click', () => {
                                modal.style.display = 'block';
                                const modifiedOriginal = original.replace('https://i.pximg.net', 'https://wxdl.freephantom.cn/i.pximg.net');
                                modalImage.src = modifiedOriginal;
                                downloadBtn.style.display = 'block';
                            });
                            wallpapersContainer.appendChild(card);
                        });
                    })
                    .catch(error => {
                        console.error('Error fetching data:', error);
                    });
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
                const link = document.createElement('a');
                link.href = modalImage.src;
                link.download = 'anime_wallpaper';
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                modal.style.display = 'none';
                downloadBtn.style.display = 'none';
            };

            window.addEventListener('scroll', () => {
                if (window.innerHeight + window.scrollY >= document.body.scrollHeight && hasMorePages) {
                    currentPage++;
                    fetchWallpapers(currentPage);
                }
            });
        });
