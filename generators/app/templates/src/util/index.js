/**
 * 给body添加overflowY:hidden
 * @export
 * @param {boolean} 是否overflowY:hidden
 */
export function bodyOverflow(isOverflow) {
    let appDom = document.getElementById('app');
    let body = document.body;
    if (isOverflow) {
        addClass(document.documentElement, 'noscroll');
    } else {
        removeClass(document.documentElement, 'noscroll');
    }
}
export function addClass(el, className) {
    if (el.classList)
        el.classList.add(className);
    else
        el.className += ' ' + className;
}
export function removeClass(el, className) {
    if (el.classList)
        el.classList.remove(className);
    else
        el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
}
/**
 * 设置title
 * @param {string} title文字
 */
export function setTitle(title) {
    document.title = title;
    //解决document.title 在 ios 下不生效bug方案 ios内生效
    const mobile = navigator.userAgent.toLowerCase();
    // const length = document.querySelectorAll('iframe').length;
    if (/iphone|ipad|ipod/.test(mobile)) {
        const iframe = document.createElement('iframe');
        iframe.style.cssText = 'display: none; width: 0; height: 0;position:fixed;';
        //iframe.setAttribute('src', '//www.jd.com/favicon.ico');
        iframe.addEventListener('load', () => {
            setTimeout(() => {
                iframe.removeEventListener('load', false);
                document.body.removeChild(iframe);
            }, 0);
        });
        document.body.appendChild(iframe);
    }
}

export function getMarkMobile(str){
    if(str!= null && str.length == 11){
        return str.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
    } else{
        return '';
    }
}

// 正则规则
export const regRule = {
    name: /^[\u4e00-\u9fa5]{1,100}$|^[A-Za-z]+\/[A-Za-z]+( [A-Za-z]+)?$|^[\u4e00-\u9fa5]+[a-zA-Z]+$/,
    email:/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
    mobile : /(^1[3|4|5|7|8]{1}[0-9]{1}\*{4}\d{4}$)|(^1[3|4|5|7|8]{1}[0-9]{9}$)/,
    PSP: /^[A-Za-z0-9]*$/, // 护照（http://www.voidcn.com/blog/sunkaikaisun/article/p-3766234.html）
    HKM: /^[A-Za-z0-9]*$/, // 港澳通行证
    MOC : /^[\u4e00-\u9fa5]{1}字第\d{6,7}$/,  //军官证、士兵证格式为:*字第+6/7位数字
    numAndLetter : /^[A-Za-z0-9]*$/ , //数字和英文
};

export function smartScroll(container, selectorScrollable) {
    let $ = function(str) {
        return window.document.querySelector(str);
    }
    var container = $(container);

    // 如果没有滚动容器选择器，或者已经绑定了滚动时间，忽略
    if (!selectorScrollable || container.isBindScroll) {
        return;
    }

    var data = {
        posY: 0,
        maxscroll: 0
    };
    container.addEventListener('touchstart', function(event) {
        var events = event.touches[0] || event;
        var target = event.target;

        if (!target) return;

        var elScroll;

        while (target) {
            if (target == $(selectorScrollable)) {
                elScroll = target;
                break;
            }
            target = target.parentNode;
        }
        if (!elScroll) {
            data.maxscroll = 0;
            return;
        }
        data.elScroll = elScroll;
        data.posY = events.pageY;
        data.scrollY = elScroll.scrollTop;
        // 是否可以滚动
        data.maxscroll = elScroll.scrollHeight - elScroll.clientHeight;
    }, false);
    container.addEventListener('touchmove', function(evt) {
        if (data.maxscroll <= 0) {
            event.preventDefault();
            return;
        }

        // 滚动元素
        var elScroll = data.elScroll;
        // 当前的滚动高度
        var scrollTop = elScroll.scrollTop;

        // 现在移动的垂直位置，用来判断是往上移动还是往下
        var events = evt.touches[0] || event;
        // 移动距离
        var distanceY = events.pageY - data.posY;

        // 上下边缘检测
        if (distanceY > 0 && scrollTop == 0) {
            // 往上滑，并且到头
            // 禁止滚动的默认行为
            event.preventDefault();
            return;
        }

        // 下边缘检测
        if (distanceY < 0 && (scrollTop + 1 >= data.maxscroll)) {
            // 往下滑，并且到头
            // 禁止滚动的默认行为
            event.preventDefault();
            return;
        }
    }, false);
    container.addEventListener('touchend', function(evt) {
        data.maxscroll = 0;
    }, false);
    // 防止多次重复绑定
    container.isBindScroll = true;
};
/**
 * localStorage封装
 */
export const storage = {
    // 根据key获取localStorage
    getItem(key) {
        let item = '';
        try {
           item = window.localStorage.getItem(key)||'';
        } catch (e) {
            return '';
        }
        return item;
    },
    // 设置localStorage
    setItem(key, value) {
        try {
            if(typeof(items)=='object'){
                window.localStorage.setItem(key, JSON.stringify(value));
            }else{
                window.localStorage.setItem(key, value);
            }
        } catch (e) {
            return false;
        }
    },
    // 根据key删除localStorage
    removeItem(key){
        try {
            window.localStorage.removeItem(key);
        } catch (e) {
            return false;
        }
    },
    // 清空localStrage
    clear() {
        try {
            window.localStorage.clear();
        } catch (e) {
            return false;
        }
    },
    /**
     * 设置cookie
     * @param {any} name  cookie键
     * @param {any} value cookie值
     * @param {any} time  时间，单位天
     */
    setCookie(name, value, time) {
        var exp = new Date();
        exp.setTime(exp.getTime() + time*24*60*60*1000);
        document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
    },
    /**
     * 获取cookie
     * @export
     * @param {string} cookie键
     * @returns
     */
    getCookie(name) {
        //读取COOKIE
        var reg = new RegExp("(^| )" + name + "(?:=([^;]*))?(;|$)"),
            val = document.cookie.match(reg);
        return val ? (val[2] ? unescape(val[2]) : "") : null;
    }
}

/**
 * 将时间戳转换成日期格式
 * yyyy-MM-dd hh:mm:ss
 */
export function getTime(timeLong) {
    let  date = new Date(timeLong);
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    let D = date.getDate() + ' ';
    let h = date.getHours() + ':';
    let m = date.getMinutes() + ':';
    let s = date.getSeconds();
    return Y+M+D+h+m+s;
}

export const deepCopy = require('lodash.clonedeep');

export function closest(el, selector) {
    const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;

    while (el) {
        if (matchesSelector.call(el, selector)) {
            return el;
        } else {
            el = el.parentElement;
        }
    }
    return null;
}


