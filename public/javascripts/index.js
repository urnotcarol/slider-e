function getPhotoList(page, count) {
    const total = 20;

    let res = {
        total: total,
        page: page,
        data: []
    };

    let from = page * count;
    let to = Math.min(from + count, total);
    for (let i = from; i >= 0 && i < to; ++i) {
        res.data.push({
            name: `image${i + 1}`,
            url: `../images/img_${i + 1}.jpeg`,
            previewUrl: `../images/img_${i + 1}.jpeg`
        });
    }

    return res;
}

window.addEventListener('load', function() {
    const listDOM = document.querySelector('.preview-list');
    let listPreBtn = document.querySelector('.preview-pre-btn');
    let listNextBtn = document.querySelector('.preview-next-btn');
    let mainPreBtn = document.querySelector('.main-pre-btn');
    let mainNextBtn = document.querySelector('.main-next-btn');
    
    let page = 0;
    let count = 7;
    let total = '';
    let selectedPage = 0;
    let selectedIndex = 0;
    let photoList = [];
    
    handlePageChange(0);
    function handlePageChange(targetPage) {
        let res = getPhotoList(targetPage, count);
        if (res.data.length >= 0) {
            photoList = photoList.concat(res.data).slice(-count);
            page = res.page;
            renderPreviewList();
        }
        total = res.total;
        if (page === 0) {
            listPreBtn.setAttribute('disabled', 'disabled');
        }
        if (page === Math.floor(res.total / count)) {
            listNextBtn.setAttribute('disabled', 'disabled');
        }
        if (page > 0) {
            listPreBtn.removeAttribute('disabled');
        }
        if (page < Math.floor(res.total / count)) {
            listNextBtn.removeAttribute('disabled');
        }
        if (selectedPage === page) {
            handleIndexChange(selectedIndex);
        }
    }
    
    function renderPreviewList () {
        const listItemsView = photoList.map((item, index) => {
            return `
            <li class="preview-item" data-index="${index}" data-url="${item.url}">
                <img src="${item.previewUrl}">
            </li>
            `;
        }).join('');
        listDOM.innerHTML = listItemsView;
    }
    
    listNextBtn.addEventListener('click', function (e) {
        handlePageChange(page + 1);
    });
    listPreBtn.addEventListener('click', function (e) {
        handlePageChange(page - 1);
    });
    
    listDOM.addEventListener('click', function (e) {
        let target = e.target;
        if (target.nodeName.toLowerCase() === 'img') {
            target = target.parentNode;
        }
        handleIndexChange(Number(target.dataset.index));
    });
    
    function handleIndexChange (index) {
        if (selectedPage !== page) {
            handlePageChange(selectedPage);
        }
        let items = listDOM.children;
        items[selectedIndex].classList.remove('selected');
        if (index < 0) {
            handlePageChange(page - 1);
            selectedIndex = count - 1;
        } else if (index >= count) {
            handlePageChange(page + 1);
            selectedIndex = 0;
        } else {
            selectedIndex = index;
        }
        selectedPage = page;
        items[selectedIndex].classList.add('selected');
        showSelected(items[selectedIndex]);
        if ((page === 0) && (selectedIndex === 0)) {
            mainPreBtn.setAttribute('disabled', 'disabled');
        }
        if ((page >= Math.floor(total / count)) && (selectedIndex === count - 1)) {
            mainNextBtn.setAttribute('disabled', 'disabled');
        }
        if (selectedIndex > 0) {
            mainPreBtn.removeAttribute('disabled');
        }
        if (selectedIndex < count - 1) {
            mainNextBtn.removeAttribute('disabled');
        }
    }
    
    function showSelected(item) {
        document.querySelector('.main-img-wrapper').innerHTML = `
        <img src="${item.dataset.url}">
        `
    }
    
    mainPreBtn.addEventListener('click', function (e) {
        handleIndexChange(selectedIndex - 1);
    });
    mainNextBtn.addEventListener('click', function (e) {
        handleIndexChange(selectedIndex + 1);
    });
});