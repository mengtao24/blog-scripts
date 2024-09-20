const simpleHash = (key, tableSize) => {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash += key.charCodeAt(i);
    }
    return hash % tableSize;
  };
  
  const getToday = () => {
    const date = new Date();
  
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份从0开始，所以需要+1，并且补0
    const day = String(date.getDate()).padStart(2, "0"); // 日期不足两位补0
  
    return `${year}-${month}-${day}`;
  };
  
  const getTodayPostLink = () => {
    return fetch("/wp-json/wp/v2/posts?per_page=1")
      .then((res) => {
        const totalPosts = res.headers.get("x-wp-totalpages");
        const todayPost = simpleHash(getToday(), totalPosts);
        return todayPost;
      })
      .then((targetPost) => {
        return fetch(`/wp-json/wp/v2/posts?per_page=1&offset=${targetPost}`);
      })
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        return json[0].link;
      });
  };
  
  // 访问随机一篇博文
  export const randomPost = {
    run: () => {
      const linkDOM = document.querySelector(".random-post a");
      if (linkDOM) {
        linkDOM.addEventListener("click", function (event) {
          event.preventDefault();
          getTodayPostLink().then((link) => {
            window.location.href = link;
          });
        });
      }
    },
  };
  