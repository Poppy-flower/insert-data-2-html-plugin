const fetch = require('node-fetch');

/**
 *  @param open boolean 是否开启数据插入
 *  @param url string 请求的URL 如：http://127.0.0.1/detail
 *  @param method string 请求的方法类型 GET POST UPDATE default:POST
 *  @param headers object 请求头
 *  @param params object 请求的参数
 *  @param key string 默认"ACTIVITY_HOME_DATA"
 */

class InsertData2HtmlPlugin {
    constructor({open, url, method, headers, params, key}){
        this.open = open;
        this.url - url;
        this.method = method || 'POST';
        this.headers = headers || {};
        this.params = params;
        this.key = key || 'DETAIL';
    }

    apply(compiler) {
        if(!this.open){
            return;
        }

        compiler.hooks.make.tapAsync('InsertData2HtmlPlugin', async (compilation, getDataCallback) => {
            const homeData = await this.fetchDetailData();
            compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tap('htmlWebpackPluginBeforeHtmlProcessing', htmlPluginData => {
                let result = `
                <head>
                    <script>
                        ;(function(){
                            ${this.key}: ${JSON.stringify(homeData)}
                        })(window)
                    </script>
                `;
                htmlPluginData.html = htmlPluginData.html.replace('<head>', result);
            });
            getDataCallback();
        })
    }

    fetchDetailData() {
        if(!this.url){
            return Promise.resolve({error: '请配置请求的url'});
        }

        return fetch(this.url, {
            method: this.method,
            body: JSON.stringify(this.params),
            headers: {'Content-Type': 'application/json', ...this.headers}
        })
            .then(res => res.json())
            .catch(err => {
                return Promise.resolve({error: err});
            })
    }
}

module.exports = InsertData2HtmlPlugin;