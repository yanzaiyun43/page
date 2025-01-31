function tt(){
   let hu=document.getElementById("txxt").value;
   alert("你的身高是:"+hu+"厘米");
   }
// 获取按钮元素
        const button = document.getElementById('goToManPage');

        // 为按钮添加点击事件监听器
        button.addEventListener('click', function() {
            // 跳转到 man.html 页面
            window.location.href = 'comic.html';
        });